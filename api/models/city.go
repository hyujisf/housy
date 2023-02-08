package models

import "time"

type City struct {
	ID        int       `json:"id" gorm:"primary_key:auto_increment"`
	Name      string    `json:"name" gorm:"type: varchar(255)"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}
type CityResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (CityResponse) TableName() string {
	return "city"
}
