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

type customerService struct {
	customerRepo port.CustomerRepository
}

func NewCustomerService(cr port.CustomerRepository) port.CustomerService {
	return &customerService{customerRepo: cr}
}

func (s *customerService) CreateCustomer(ctx context.Context, tenantID, email, name string) (*model.CoreCustomer, error) {
	cus := &model.CoreCustomer{
		ID:        "cus_" + strings.ReplaceAll(uuid.New().String(), "-", ""),
		TenantID:  tenantID,
		Email:     email,
		Name:      name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	err := s.customerRepo.CreateCustomer(ctx, cus)
	if err != nil {
		return nil, err
	}
	return cus, nil
}

func (s *customerService) GetCustomer(ctx context.Context, tenantID, id string) (*model.CoreCustomer, error) {
	cus, err := s.customerRepo.GetCustomerByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("customer not found")
	}
	if cus.TenantID != tenantID {
		return nil, fmt.Errorf("customer not found")
	}
	return cus, nil
}

func (s *customerService) GetCustomerByEmail(ctx context.Context, tenantID, email string) (*model.CoreCustomer, error) {
	return s.customerRepo.GetCustomerByEmail(ctx, tenantID, email)
}

func (s *customerService) ListCustomers(ctx context.Context, tenantID string) ([]model.CoreCustomer, error) {
	return s.customerRepo.ListCustomers(ctx, tenantID, 100, 0)
}

func (s *customerService) UpdateCustomer(ctx context.Context, tenantID, id, email, name string) (*model.CoreCustomer, error) {
	cus, err := s.customerRepo.GetCustomerByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("customer not found")
	}
	if cus.TenantID != tenantID {
		return nil, fmt.Errorf("customer not found")
	}
	cus.Email = email
	cus.Name = name
	cus.UpdatedAt = time.Now()
	if err := s.customerRepo.UpdateCustomer(ctx, cus); err != nil {
		return nil, err
	}
	return cus, nil
}
func (s *customerService) DeleteCustomer(ctx context.Context, tenantID, id string) error {
	cus, err := s.customerRepo.GetCustomerByID(ctx, id)
	if err != nil {
		return fmt.Errorf("customer not found")
	}
	if cus.TenantID != tenantID {
		return fmt.Errorf("customer not found")
	}
	return s.customerRepo.DeleteCustomer(ctx, id)
}
