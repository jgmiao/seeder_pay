package gateway

import (
	"context"
	"errors"
	"time"

	"strings"

	"github.com/google/uuid"
)

type Token string
type TransactionID string

type CardInfo struct {
	Number string
	Exp    string
	CVC    string
}

type PaymentGateway interface {
	CreateCustomerToken(ctx context.Context, customerID string, cardData CardInfo) (Token, error)
	Charge(ctx context.Context, amount int, currency string, token Token) (TransactionID, error)
	Refund(ctx context.Context, transactionID TransactionID, amount int) error
}

// MockPaymentAdapter implements PaymentGateway for local testing and dev.
type MockPaymentAdapter struct{}

func NewMockPaymentAdapter() PaymentGateway {
	return &MockPaymentAdapter{}
}

func (m *MockPaymentAdapter) CreateCustomerToken(ctx context.Context, customerID string, cardData CardInfo) (Token, error) {
	// Simulate network delay
	time.Sleep(200 * time.Millisecond)

	// Basic validation mock
	if len(cardData.Number) < 14 {
		return "", errors.New("invalid card number")
	}

	token := "tok_mock_" + strings.ReplaceAll(uuid.New().String(), "-", "")
	return Token(token), nil
}

func (m *MockPaymentAdapter) Charge(ctx context.Context, amount int, currency string, token Token) (TransactionID, error) {
	time.Sleep(300 * time.Millisecond)

	if amount <= 0 {
		return "", errors.New("invalid charge amount")
	}

	// Randomly fail specific mock tokens for testing dunning (e.g., if token starts with tok_mock_fail)
	if strings.HasPrefix(string(token), "tok_mock_fail") {
		return "", errors.New("card declined by issuer")
	}

	txID := "ch_mock_" + strings.ReplaceAll(uuid.New().String(), "-", "")
	return TransactionID(txID), nil
}

func (m *MockPaymentAdapter) Refund(ctx context.Context, transactionID TransactionID, amount int) error {
	time.Sleep(100 * time.Millisecond)
	return nil
}
