package model

import (
	"time"
)

type CoreSubscription struct {
	ID                 string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	TenantID           string    `gorm:"column:tenant_id;type:varchar(64);not null" json:"tenant_id"`
	CustomerID         string    `gorm:"column:customer_id;type:varchar(64);not null" json:"customer_id"`
	PriceID            string    `gorm:"column:price_id;type:varchar(64);not null" json:"price_id"`
	Status             string    `gorm:"column:status;type:varchar(32);not null" json:"status"`
	CurrentPeriodStart time.Time `gorm:"column:current_period_start;type:datetime;not null" json:"current_period_start"`
	CurrentPeriodEnd   time.Time `gorm:"column:current_period_end;type:datetime;not null" json:"current_period_end"`
	CancelAtPeriodEnd  int       `gorm:"column:cancel_at_period_end;type:tinyint(1);not null;default:0" json:"cancel_at_period_end"`
	Version            int       `gorm:"column:version;type:int(11);not null;default:1" json:"version"`
	CreatedAt          time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt          time.Time `gorm:"column:updated_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (CoreSubscription) TableName() string {
	return "core_subscription"
}

type TxInvoice struct {
	ID              string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	TenantID        string    `gorm:"column:tenant_id;type:varchar(64);not null" json:"tenant_id"`
	CustomerID      string    `gorm:"column:customer_id;type:varchar(64);not null" json:"customer_id"`
	SubscriptionID  string    `gorm:"column:subscription_id;type:varchar(64)" json:"subscription_id"`
	AmountDue       int       `gorm:"column:amount_due;type:int(11);not null" json:"amount_due"`
	AmountPaid      int       `gorm:"column:amount_paid;type:int(11);not null;default:0" json:"amount_paid"`
	Status          string    `gorm:"column:status;type:varchar(32);not null" json:"status"`
	PaymentIntentID string    `gorm:"column:payment_intent_id;type:varchar(64)" json:"payment_intent_id"`
	CreatedAt       time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (TxInvoice) TableName() string {
	return "tx_invoice"
}
