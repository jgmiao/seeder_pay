package service

import (
	"context"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"
	"strings"
	"time"

	"github.com/google/uuid"
)

type promoCodeService struct {
	repo port.PromoCodeRepository
}

func NewPromoCodeService(r port.PromoCodeRepository) port.PromoCodeService {
	return &promoCodeService{repo: r}
}

func (s *promoCodeService) CreatePromoCode(ctx context.Context, tenantID, code, discountType string, discountValue int, maxUses *int, expiresAt *time.Time) (*model.CorePromoCode, error) {
	promo := &model.CorePromoCode{
		ID:            "promo_" + strings.ReplaceAll(uuid.New().String(), "-", ""),
		TenantID:      tenantID,
		Code:          strings.ToUpper(code),
		DiscountType:  discountType,
		DiscountValue: discountValue,
		MaxUses:       maxUses,
		ExpiresAt:     expiresAt,
		Active:        1,
		CreatedAt:     time.Now(),
	}
	if err := s.repo.CreatePromoCode(ctx, promo); err != nil {
		return nil, err
	}
	return promo, nil
}

func (s *promoCodeService) ListPromoCodes(ctx context.Context, tenantID string) ([]model.CorePromoCode, error) {
	return s.repo.ListPromoCodes(ctx, tenantID)
}

func (s *promoCodeService) DeletePromoCode(ctx context.Context, tenantID, id string) error {
	// In a real app we might check tenant ownership here by getting the promo first
	return s.repo.DeletePromoCode(ctx, id)
}

func (s *promoCodeService) TogglePromoCode(ctx context.Context, tenantID, id string, active bool) error {
	val := 0
	if active {
		val = 1
	}
	return s.repo.UpdatePromoCodeActive(ctx, id, val)
}
