package db

import (
	"context"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"

	"gorm.io/gorm"
)

// ---- Product Repository ----

type mysqlProductRepo struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) port.ProductRepository {
	return &mysqlProductRepo{db: db}
}

func (r *mysqlProductRepo) CreateProduct(ctx context.Context, product *model.CoreProduct) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *mysqlProductRepo) GetProductByID(ctx context.Context, id string) (*model.CoreProduct, error) {
	var p model.CoreProduct
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&p).Error
	return &p, err
}

func (r *mysqlProductRepo) ListProducts(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreProduct, error) {
	var ps []model.CoreProduct
	err := r.db.WithContext(ctx).Where("tenant_id = ?", tenantID).Limit(limit).Offset(offset).Order("created_at DESC").Find(&ps).Error
	return ps, err
}

func (r *mysqlProductRepo) UpdateProduct(ctx context.Context, product *model.CoreProduct) error {
	return r.db.WithContext(ctx).Model(product).Updates(map[string]interface{}{
		"name":        product.Name,
		"description": product.Description,
	}).Error
}

func (r *mysqlProductRepo) ArchiveProduct(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Model(&model.CoreProduct{}).Where("id = ?", id).Update("active", 0).Error
}

// ---- Price Repository ----

type mysqlPriceRepo struct {
	db *gorm.DB
}

func NewPriceRepository(db *gorm.DB) port.PriceRepository {
	return &mysqlPriceRepo{db: db}
}

func (r *mysqlPriceRepo) CreatePrice(ctx context.Context, price *model.CorePrice) error {
	return r.db.WithContext(ctx).Create(price).Error
}

func (r *mysqlPriceRepo) GetPriceByID(ctx context.Context, id string) (*model.CorePrice, error) {
	var p model.CorePrice
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&p).Error
	return &p, err
}

func (r *mysqlPriceRepo) ListPricesByProduct(ctx context.Context, productID string) ([]model.CorePrice, error) {
	var ps []model.CorePrice
	err := r.db.WithContext(ctx).Where("product_id = ?", productID).Find(&ps).Error
	return ps, err
}

// ---- Customer Repository ----

type mysqlCustomerRepo struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) port.CustomerRepository {
	return &mysqlCustomerRepo{db: db}
}

func (r *mysqlCustomerRepo) CreateCustomer(ctx context.Context, customer *model.CoreCustomer) error {
	return r.db.WithContext(ctx).Create(customer).Error
}

func (r *mysqlCustomerRepo) GetCustomerByID(ctx context.Context, id string) (*model.CoreCustomer, error) {
	var c model.CoreCustomer
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&c).Error
	return &c, err
}

func (r *mysqlCustomerRepo) GetCustomerByEmail(ctx context.Context, tenantID, email string) (*model.CoreCustomer, error) {
	var c model.CoreCustomer
	err := r.db.WithContext(ctx).Where("tenant_id = ? AND email = ?", tenantID, email).First(&c).Error
	return &c, err
}

func (r *mysqlCustomerRepo) ListCustomers(ctx context.Context, tenantID string, limit, offset int) ([]model.CoreCustomer, error) {
	var cs []model.CoreCustomer
	err := r.db.WithContext(ctx).Where("tenant_id = ?", tenantID).Limit(limit).Offset(offset).Order("created_at DESC").Find(&cs).Error
	return cs, err
}

func (r *mysqlCustomerRepo) UpdateCustomer(ctx context.Context, customer *model.CoreCustomer) error {
	return r.db.WithContext(ctx).Model(customer).Updates(map[string]interface{}{
		"email": customer.Email,
		"name":  customer.Name,
	}).Error
}

func (r *mysqlCustomerRepo) DeleteCustomer(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.CoreCustomer{}, "id = ?", id).Error
}

// ---- Promo Code Repository ----

type mysqlPromoCodeRepo struct {
	db *gorm.DB
}

func NewPromoCodeRepository(db *gorm.DB) port.PromoCodeRepository {
	return &mysqlPromoCodeRepo{db: db}
}

func (r *mysqlPromoCodeRepo) CreatePromoCode(ctx context.Context, promo *model.CorePromoCode) error {
	return r.db.WithContext(ctx).Create(promo).Error
}

func (r *mysqlPromoCodeRepo) ListPromoCodes(ctx context.Context, tenantID string) ([]model.CorePromoCode, error) {
	var ps []model.CorePromoCode
	err := r.db.WithContext(ctx).Where("tenant_id = ?", tenantID).Order("created_at DESC").Find(&ps).Error
	return ps, err
}

func (r *mysqlPromoCodeRepo) DeletePromoCode(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.CorePromoCode{}, "id = ?", id).Error
}

func (r *mysqlPromoCodeRepo) UpdatePromoCodeActive(ctx context.Context, id string, active int) error {
	return r.db.WithContext(ctx).Model(&model.CorePromoCode{}).Where("id = ?", id).Update("active", active).Error
}
