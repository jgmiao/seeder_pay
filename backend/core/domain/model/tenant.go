package model

import (
	"time"
)

type AccountTenant struct {
	ID              string    `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	Name            string    `gorm:"column:name;type:varchar(128);not null" json:"name"`
	GatewayProvider string    `gorm:"column:gateway_provider;type:varchar(32);not null;default:'mock'" json:"gateway_provider"`
	GatewayConfig   string    `gorm:"column:gateway_config;type:text" json:"gateway_config"`
	CreatedAt       time.Time `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"updated_at"`
	Status          int       `gorm:"column:status;type:tinyint(2);not null;default:1" json:"status"`
}

func (AccountTenant) TableName() string {
	return "account_tenant"
}
