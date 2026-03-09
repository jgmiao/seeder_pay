package service

import (
	"context"
	"fmt"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/port"
)

type invoiceService struct {
	invoiceRepo port.InvoiceRepository
}

func NewInvoiceService(ir port.InvoiceRepository) port.InvoiceService {
	return &invoiceService{invoiceRepo: ir}
}

func (s *invoiceService) ListInvoices(ctx context.Context, tenantID string) ([]model.TxInvoice, error) {
	return s.invoiceRepo.ListInvoices(ctx, tenantID, 100, 0)
}

func (s *invoiceService) GetInvoice(ctx context.Context, tenantID, id string) (*model.TxInvoice, error) {
	inv, err := s.invoiceRepo.GetInvoiceByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("invoice not found")
	}
	if inv.TenantID != tenantID {
		return nil, fmt.Errorf("invoice not found")
	}
	return inv, nil
}
