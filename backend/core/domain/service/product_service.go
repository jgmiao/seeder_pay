package service

import (
	"context"
	"fmt"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"
	"strings"
	"time"

	"github.com/google/uuid"
)

type productService struct {
	productRepo port.ProductRepository
	priceRepo   port.PriceRepository
}

func NewProductService(pr port.ProductRepository, pir port.PriceRepository) port.ProductService {
	return &productService{
		productRepo: pr,
		priceRepo:   pir,
	}
}

func (s *productService) CreateProduct(ctx context.Context, tenantID, name, description string) (*model.CoreProduct, error) {
	product := &model.CoreProduct{
		ID:          "prod_" + strings.ReplaceAll(uuid.New().String(), "-", ""),
		TenantID:    tenantID,
		Name:        name,
		Description: description,
		Active:      1,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	err := s.productRepo.CreateProduct(ctx, product)
	if err != nil {
		return nil, err
	}
	return product, nil
}

func (s *productService) GetProductByID(ctx context.Context, id string) (*model.CoreProduct, error) {
	return s.productRepo.GetProductByID(ctx, id)
}

func (s *productService) ListProducts(ctx context.Context, tenantID string) ([]model.CoreProduct, error) {
	return s.productRepo.ListProducts(ctx, tenantID, 100, 0)
}

func (s *productService) UpdateProduct(ctx context.Context, id, name, description string) (*model.CoreProduct, error) {
	product, err := s.productRepo.GetProductByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("product not found")
	}
	product.Name = name
	product.Description = description
	product.UpdatedAt = time.Now()
	if err := s.productRepo.UpdateProduct(ctx, product); err != nil {
		return nil, err
	}
	return product, nil
}

func (s *productService) ArchiveProduct(ctx context.Context, id string) error {
	return s.productRepo.ArchiveProduct(ctx, id)
}

func (s *productService) CreatePrice(ctx context.Context, productID, currency string, unitAmount int, billingInterval string, intervalCount int) (*model.CorePrice, error) {
	price := &model.CorePrice{
		ID:              "price_" + strings.ReplaceAll(uuid.New().String(), "-", ""),
		ProductID:       productID,
		Currency:        currency,
		UnitAmount:      unitAmount,
		BillingInterval: billingInterval,
		IntervalCount:   intervalCount,
		Active:          1,
		CreatedAt:       time.Now(),
	}
	err := s.priceRepo.CreatePrice(ctx, price)
	if err != nil {
		return nil, err
	}
	return price, nil
}

func (s *productService) ListPricesByProduct(ctx context.Context, productID string) ([]model.CorePrice, error) {
	return s.priceRepo.ListPricesByProduct(ctx, productID)
}
