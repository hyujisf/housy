package models

import "time"

type ListAs struct {
	ID        int       `json:"id" gorm:"primary_key:auto_increment"`
	Name      string    `json:"name" gorm:"type: varchar(255)"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}
type ListAsResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (ListAsResponse) TableName() string {
	return "list_as"
}
