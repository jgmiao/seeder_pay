package db

import (
	"context"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"

	"gorm.io/gorm"
)

// ---- Subscription Repository ----

type mysqlSubscriptionRepo struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) port.SubscriptionRepository {
	return &mysqlSubscriptionRepo{db: db}
}

func (r *mysqlSubscriptionRepo) CreateSubscription(ctx context.Context, sub *model.CoreSubscription) error {
	return r.db.WithContext(ctx).Create(sub).Error
}

func (r *mysqlSubscriptionRepo) GetSubscriptionByID(ctx context.Context, id string) (*model.CoreSubscription, error) {
	var s model.CoreSubscription
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&s).Error
	return &s, err
}

func (r *mysqlSubscriptionRepo) ListSubscriptions(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreSubscription, error) {
	var subs []model.CoreSubscription
	err := r.db.WithContext(ctx).Where("tenant_id = ?", tenantID).Limit(limit).Offset(offset).Order("created_at DESC").Find(&subs).Error
	return subs, err
}

func (r *mysqlSubscriptionRepo) UpdateSubscriptionStatus(ctx context.Context, id, status string, cancelAtPeriodEnd int) error {
	updates := map[string]interface{}{
		"status": status,
	}
	if cancelAtPeriodEnd >= 0 {
		updates["cancel_at_period_end"] = cancelAtPeriodEnd
	}
	return r.db.WithContext(ctx).Model(&model.CoreSubscription{}).Where("id = ?", id).Updates(updates).Error
}

// ---- Invoice Repository ----

type mysqlInvoiceRepo struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) port.InvoiceRepository {
	return &mysqlInvoiceRepo{db: db}
}

func (r *mysqlInvoiceRepo) CreateInvoice(ctx context.Context, invoice *model.TxInvoice) error {
	return r.db.WithContext(ctx).Create(invoice).Error
}

func (r *mysqlInvoiceRepo) GetInvoiceByID(ctx context.Context, id string) (*model.TxInvoice, error) {
	var inv model.TxInvoice
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&inv).Error
	return &inv, err
}

func (r *mysqlInvoiceRepo) ListInvoices(ctx context.Context, tenantID string, limit, offset int) ([]model.TxInvoice, error) {
	var invs []model.TxInvoice
	err := r.db.WithContext(ctx).Where("tenant_id = ?", tenantID).Limit(limit).Offset(offset).Order("created_at DESC").Find(&invs).Error
	return invs, err
}
