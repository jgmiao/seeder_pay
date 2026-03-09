package port

import (
	"context"
	"seeder_pay_api/core/domain/model"
)

type ProductRepository interface {
	CreateProduct(ctx context.Context, product *model.CoreProduct) error
	GetProductByID(ctx context.Context, id string) (*model.CoreProduct, error)
	ListProducts(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreProduct, error)
	UpdateProduct(ctx context.Context, product *model.CoreProduct) error
	ArchiveProduct(ctx context.Context, id string) error
}

type PriceRepository interface {
	CreatePrice(ctx context.Context, price *model.CorePrice) error
	GetPriceByID(ctx context.Context, id string) (*model.CorePrice, error)
	ListPricesByProduct(ctx context.Context, productID string) ([]model.CorePrice, error)
}

type CustomerRepository interface {
	CreateCustomer(ctx context.Context, customer *model.CoreCustomer) error
	GetCustomerByID(ctx context.Context, id string) (*model.CoreCustomer, error)
	GetCustomerByEmail(ctx context.Context, tenantID, email string) (*model.CoreCustomer, error)
	ListCustomers(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreCustomer, error)
	UpdateCustomer(ctx context.Context, customer *model.CoreCustomer) error
	DeleteCustomer(ctx context.Context, id string) error
}

type SubscriptionRepository interface {
	CreateSubscription(ctx context.Context, sub *model.CoreSubscription) error
	GetSubscriptionByID(ctx context.Context, id string) (*model.CoreSubscription, error)
	ListSubscriptions(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreSubscription, error)
	UpdateSubscriptionStatus(ctx context.Context, id, status string, cancelAtPeriodEnd int) error
}

type InvoiceRepository interface {
	CreateInvoice(ctx context.Context, invoice *model.TxInvoice) error
	GetInvoiceByID(ctx context.Context, id string) (*model.TxInvoice, error)
	ListInvoices(ctx context.Context, tenantID string, limit, offset int) ([]model.TxInvoice, error)
}

type PromoCodeRepository interface {
	CreatePromoCode(ctx context.Context, promo *model.CorePromoCode) error
	ListPromoCodes(ctx context.Context, tenantID string) ([]model.CorePromoCode, error)
	DeletePromoCode(ctx context.Context, id string) error
	UpdatePromoCodeActive(ctx context.Context, id string, active int) error
}
