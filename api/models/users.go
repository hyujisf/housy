package models

import (
	"time"
)

type User struct {
	ID        int       `json:"id" gorm:"primary_key:auto_increment"`
	Fullname  string    `json:"fullname" gorm:"type: varchar(255)"`
	Username  string    `json:"username" gorm:"type: varchar(255)"`
	Email     string    `json:"email" gorm:"type: varchar(255)"`
	Password  string    `json:"-" gorm:"type: varchar(255)"`
	ListAs    ListAs    `json:"listAs" gorm:"foreignKey:ListAsId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ListAsId  int       `json:"-" gorm:"type: int"`
	Gender    string    `json:"gender" gorm:"type: varchar(255)"`
	Phone     string    `json:"phone" gorm:"type: varchar(255)"`
	Address   string    `json:"address" gorm:"type: text"`
	Image     string    `json:"image" gorm:"type: varchar(255)"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type UsersProfileResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
}

func (UsersProfileResponse) TableName() string {
	return "users"
}
