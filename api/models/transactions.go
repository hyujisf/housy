package models

import "time"

type Transaction struct {
	ID         int                  `json:"id" gorm:"primary_key:auto_increment"`
	PropertyID int                  `json:"-"`
	Property   PropertyResponse     `json:"property" gorm:"foreignKey:PropertyID"`
	Checkin    time.Time            `json:"checkin" gorm:"type: date"`
	Checkout   time.Time            `json:"checkout" gorm:"type: date"`
	UserID   int                  `json:"user_id"`
	User     UsersProfileResponse `json:"-" `
	Total      float64              `json:"total" gorm:"type: decimal(10,2)"`
	Status     string               `json:"status" gorm:"type: varchar(255)"`
	CreatedAt  time.Time            `json:"-"`
	UpdatedAt  time.Time            `json:"-"`
}

type TransactionResponse struct {
	ID         int                  `json:"id"`
	PropertyID int                  `json:"property_id"`
	Property   PropertyResponse     `json:"property"`
	Checkin    time.Time            `json:"checkin"`
	Checkout   time.Time            `json:"checkout"`
	TenantID   int                  `json:"tenant_id"`
	Tenant     UsersProfileResponse `json:"-"`
	OwnerID    int                  `json:"owner_id"`
	Owner      UsersProfileResponse `json:"-"`
	Total      float64              `json:"total"`
	Status     int                  `json:"status"`
}

func (TransactionResponse) TableName() string {
	return "transaction"
}
