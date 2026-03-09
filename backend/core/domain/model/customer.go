package model

import (
	"time"
)

type CoreCustomer struct {
	ID                     string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	TenantID               string    `gorm:"column:tenant_id;type:varchar(64);not null" json:"tenant_id"`
	Email                  string    `gorm:"column:email;type:varchar(128);not null" json:"email"`
	Name                   string    `gorm:"column:name;type:varchar(128)" json:"name"`
	DefaultPaymentMethodID string    `gorm:"column:default_payment_method_id;type:varchar(64)" json:"default_payment_method_id"`
	CreatedAt              time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt              time.Time `gorm:"column:updated_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (CoreCustomer) TableName() string {
	return "core_customer"
}
