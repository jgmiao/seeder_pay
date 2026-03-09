package service

import (
	"context"
	"fmt"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"
	"seeder_pay_api/core/port/gateway"
	"strings"
	"time"

	"github.com/google/uuid"
)

type subscriptionService struct {
	subRepo   port.SubscriptionRepository
	priceRepo port.PriceRepository
	paymentGw gateway.PaymentGateway
}

func NewSubscriptionService(sr port.SubscriptionRepository, pr port.PriceRepository, gw gateway.PaymentGateway) port.SubscriptionService {
	return &subscriptionService{
		subRepo:   sr,
		priceRepo: pr,
		paymentGw: gw,
	}
}

// Subscribe processes the initial checkout and sets up the subscription
func (s *subscriptionService) Subscribe(ctx context.Context, tenantID, customerID, priceID string, token gateway.Token) (*model.CoreSubscription, error) {
	price, err := s.priceRepo.GetPriceByID(ctx, priceID)
	if err != nil || price == nil {
		return nil, fmt.Errorf("invalid price plan")
	}

	// 1. Synchronously attempt the first charge
	tx, err := s.paymentGw.Charge(ctx, price.UnitAmount, price.Currency, token)
	if err != nil {
		return nil, fmt.Errorf("initial payment failed: %w", err)
	}

	// 2. Create the subscription state machine record
	now := time.Now()
	var nextBilling time.Time

	if price.BillingInterval == "month" {
		nextBilling = now.AddDate(0, price.IntervalCount, 0)
	} else if price.BillingInterval == "year" {
		nextBilling = now.AddDate(price.IntervalCount, 0, 0)
	} else {
		nextBilling = now
	}

	sub := &model.CoreSubscription{
		ID:                 "sub_" + strings.ReplaceAll(uuid.New().String(), "-", ""),
		TenantID:           tenantID,
		CustomerID:         customerID,
		PriceID:            priceID,
		Status:             "active",
		CurrentPeriodStart: now,
		CurrentPeriodEnd:   nextBilling,
		Version:            1,
		CreatedAt:          now,
		UpdatedAt:          now,
	}

	err = s.subRepo.CreateSubscription(ctx, sub)
	if err != nil {
		fmt.Printf("[CRITICAL] Payment succeeded but sub save failed: tx %s\n", tx)
		return nil, err
	}

	return sub, nil
}

func (s *subscriptionService) ListSubscriptions(ctx context.Context, tenantID string) ([]model.CoreSubscription, error) {
	return s.subRepo.ListSubscriptions(ctx, tenantID, 100, 0)
}

func (s *subscriptionService) GetSubscription(ctx context.Context, tenantID, id string) (*model.CoreSubscription, error) {
	sub, err := s.subRepo.GetSubscriptionByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("subscription not found")
	}
	if sub.TenantID != tenantID {
		return nil, fmt.Errorf("subscription not found")
	}
	return sub, nil
}

func (s *subscriptionService) CancelSubscription(ctx context.Context, tenantID, id string, immediate bool) (*model.CoreSubscription, error) {
	sub, err := s.subRepo.GetSubscriptionByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("subscription not found")
	}
	if sub.TenantID != tenantID {
		return nil, fmt.Errorf("subscription not found")
	}
	if sub.Status == "canceled" {
		return nil, fmt.Errorf("subscription already canceled")
	}

	if immediate {
		// Cancel immediately
		if err := s.subRepo.UpdateSubscriptionStatus(ctx, id, "canceled", 0); err != nil {
			return nil, err
		}
		sub.Status = "canceled"
	} else {
		// Cancel at period end
		if err := s.subRepo.UpdateSubscriptionStatus(ctx, id, sub.Status, 1); err != nil {
			return nil, err
		}
		sub.CancelAtPeriodEnd = 1
	}
	return sub, nil
}
