package model

import "time"

type CorePromoCode struct {
	ID            string     `gorm:"primaryKey;column:id;type:varchar(64)" json:"id"`
	TenantID      string     `gorm:"column:tenant_id;type:varchar(64);not null" json:"tenant_id"`
	Code          string     `gorm:"column:code;type:varchar(64);not null;uniqueIndex" json:"code"`
	DiscountType  string     `gorm:"column:discount_type;type:varchar(20);not null" json:"discount_type"` // 'percent' | 'fixed'
	DiscountValue int        `gorm:"column:discount_value;type:int(11);not null" json:"discount_value"`
	MaxUses       *int       `gorm:"column:max_uses;type:int(11)" json:"max_uses"`
	UsedCount     int        `gorm:"column:used_count;type:int(11);not null;default:0" json:"used_count"`
	ExpiresAt     *time.Time `gorm:"column:expires_at;type:datetime" json:"expires_at"`
	Active        int        `gorm:"column:active;type:tinyint(1);not null;default:1" json:"active"`
	CreatedAt     time.Time  `gorm:"column:created_at;type:datetime;not null;default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (CorePromoCode) TableName() string {
	return "core_promo_code"
}
