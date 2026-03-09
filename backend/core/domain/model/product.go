package model

import (
	"time"
)

type CoreProduct struct {
	ID          string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	TenantID    string    `gorm:"column:tenant_id;type:varchar(64);not null" json:"tenant_id"`
	Name        string    `gorm:"column:name;type:varchar(128);not null" json:"name"`
	Description string    `gorm:"column:description;type:text" json:"description"`
	CreatedAt   time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"updated_at"`
	Active      int       `gorm:"column:active;type:tinyint(1);not null;default:1" json:"active"`
}

func (CoreProduct) TableName() string {
	return "core_product"
}

type CorePrice struct {
	ID              string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	ProductID       string    `gorm:"column:product_id;type:varchar(64);not null" json:"product_id"`
	Currency        string    `gorm:"column:currency;type:varchar(3);not null;default:'TWD'" json:"currency"`
	UnitAmount      int       `gorm:"column:unit_amount;type:int(11);not null" json:"unit_amount"`
	BillingInterval string    `gorm:"column:billing_interval;type:varchar(20)" json:"billing_interval"`
	IntervalCount   int       `gorm:"column:interval_count;type:int(11);not null;default:1" json:"interval_count"`
	CreatedAt       time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
	Active          int       `gorm:"column:active;type:tinyint(1);not null;default:1" json:"active"`
}

func (CorePrice) TableName() string {
	return "core_price"
}
