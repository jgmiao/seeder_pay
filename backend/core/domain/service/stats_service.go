package service

import (
	"context"
	"seeder_pay_api/core/port"

	"gorm.io/gorm"
)

type StatsService struct {
	db *gorm.DB
}

func NewStatsService(db *gorm.DB) *StatsService {
	return &StatsService{db: db}
}

func (s *StatsService) GetOverview(ctx context.Context, tenantID string) (*port.StatsOverview, error) {
	var totalRevenue, mrr int64
	var activeSubscribers, totalCustomers, totalOrders, pendingInvoices int64

	// Total revenue (sum of all paid invoices)
	s.db.WithContext(ctx).
		Table("tx_invoice").
		Where("tenant_id = ? AND status = 'paid'", tenantID).
		Select("COALESCE(SUM(amount_paid), 0)").
		Scan(&totalRevenue)

	// Active subscribers
	s.db.WithContext(ctx).
		Table("core_subscription").
		Where("tenant_id = ? AND status = 'active'", tenantID).
		Count(&activeSubscribers)

	// Total customers
	s.db.WithContext(ctx).
		Table("core_customer").
		Where("tenant_id = ?", tenantID).
		Count(&totalCustomers)

	// Total orders (invoices)
	s.db.WithContext(ctx).
		Table("tx_invoice").
		Where("tenant_id = ?", tenantID).
		Count(&totalOrders)

	// MRR: sum of unit_amount for all active monthly subscriptions
	type MRRResult struct {
		Total int64
	}
	var mrrResult MRRResult
	s.db.WithContext(ctx).
		Table("core_subscription cs").
		Joins("JOIN core_price cp ON cs.price_id = cp.id").
		Where("cs.tenant_id = ? AND cs.status = 'active' AND cp.billing_interval = 'month'", tenantID).
		Select("COALESCE(SUM(cp.unit_amount), 0) as total").
		Scan(&mrrResult)
	mrr = mrrResult.Total

	// Pending (open) invoices
	s.db.WithContext(ctx).
		Table("tx_invoice").
		Where("tenant_id = ? AND status = 'open'", tenantID).
		Count(&pendingInvoices)

	return &port.StatsOverview{
		TotalRevenue:      totalRevenue,
		ActiveSubscribers: activeSubscribers,
		TotalCustomers:    totalCustomers,
		TotalOrders:       totalOrders,
		MRR:               mrr,
		PendingInvoices:   pendingInvoices,
	}, nil
}
