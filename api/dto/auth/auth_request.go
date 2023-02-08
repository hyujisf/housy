package authdto

type RegisterRequest struct {
	Fullname string `gorm:"type: varchar(255)" json:"fullname" validate:"required"`
	Username string `gorm:"type: varchar(255)" json:"username" validate:"required"`
	Email    string `gorm:"type: varchar(255)" json:"email" validate:"required"`
	Password string `gorm:"type: varchar(255)" json:"password" validate:"required"`
	ListAsId string `gorm:"type: varchar(255)" json:"list_as_id" validate:"required"`
	Gender   string `gorm:"type: varchar(255)" json:"gender" validate:"required"`
	Phone    string `gorm:"type: varchar(255)" json:"phone" validate:"required"`
	Address  string `gorm:"type: varchar(255)" json:"address" validate:"required"`
	Image    string `gorm:"type: varchar(255)" json:"image" `
}
type LoginRequest struct {
	Username string `gorm:"type: varchar(255)" json:"username" validate:"required"`
	Password string `gorm:"type: varchar(255)" json:"password" validate:"required"`
}
