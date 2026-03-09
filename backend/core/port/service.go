package port

import (
	"context"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port/gateway"
	"time"
)

type ProductService interface {
	CreateProduct(ctx context.Context, tenantID, name, description string) (*model.CoreProduct, error)
	GetProductByID(ctx context.Context, id string) (*model.CoreProduct, error)
	ListProducts(ctx context.Context, tenantID string) ([]model.CoreProduct, error)
	UpdateProduct(ctx context.Context, id, name, description string) (*model.CoreProduct, error)
	ArchiveProduct(ctx context.Context, id string) error
	CreatePrice(ctx context.Context, productID, currency string, unitAmount int, billingInterval string, intervalCount int) (*model.CorePrice, error)
	ListPricesByProduct(ctx context.Context, productID string) ([]model.CorePrice, error)
}

type CustomerService interface {
	CreateCustomer(ctx context.Context, tenantID, email, name string) (*model.CoreCustomer, error)
	GetCustomer(ctx context.Context, tenantID, id string) (*model.CoreCustomer, error)
	GetCustomerByEmail(ctx context.Context, tenantID, email string) (*model.CoreCustomer, error)
	ListCustomers(ctx context.Context, tenantID string) ([]model.CoreCustomer, error)
	UpdateCustomer(ctx context.Context, tenantID, id, email, name string) (*model.CoreCustomer, error)
	DeleteCustomer(ctx context.Context, tenantID, id string) error
}

type SubscriptionService interface {
	Subscribe(ctx context.Context, tenantID, customerID, priceID string, token gateway.Token) (*model.CoreSubscription, error)
	ListSubscriptions(ctx context.Context, tenantID string) ([]model.CoreSubscription, error)
	GetSubscription(ctx context.Context, tenantID, id string) (*model.CoreSubscription, error)
	CancelSubscription(ctx context.Context, tenantID, id string, immediate bool) (*model.CoreSubscription, error)
}

type InvoiceService interface {
	ListInvoices(ctx context.Context, tenantID string) ([]model.TxInvoice, error)
	GetInvoice(ctx context.Context, tenantID, id string) (*model.TxInvoice, error)
}

type PromoCodeService interface {
	CreatePromoCode(ctx context.Context, tenantID, code, discountType string, discountValue int, maxUses *int, expiresAt *time.Time) (*model.CorePromoCode, error)
	ListPromoCodes(ctx context.Context, tenantID string) ([]model.CorePromoCode, error)
	DeletePromoCode(ctx context.Context, tenantID, id string) error
	TogglePromoCode(ctx context.Context, tenantID, id string, active bool) error
}

// StatsOverview holds aggregated dashboard metrics
type StatsOverview struct {
	TotalRevenue      int64 `json:"total_revenue"`
	ActiveSubscribers int64 `json:"active_subscribers"`
	TotalCustomers    int64 `json:"total_customers"`
	TotalOrders       int64 `json:"total_orders"`
	MRR               int64 `json:"mrr"`
	PendingInvoices   int64 `json:"pending_invoices"`
}
