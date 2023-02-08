package authdto

type LoginResponse struct {
	ID       int    `gorm:"type: int" json:"id"`
	Username string `gorm:"type: varchar(255)" json:"username"`
	ListAsId int    `gorm:"type: int" json:"list_as_id"`
	Image    string `gorm:"type: string" json:"image"`
	Token    string `gorm:"type: varchar(255)" json:"token"`
}

type RegisterResponse struct {
	Username string `gorm:"type: varchar(255)" json:"username"`
	Message  string `gorm:"type: varchar(255)" json:"message"`
}

type CheckAuthResponse struct {
	ID       int    `gorm:"type: int" json:"id"`
	Username string `gorm:"type: varchar(255)" json:"username"`
	ListAsId int    `gorm:"type: int" json:"list_as_id"`
	Image    string `gorm:"type: string" json:"image"`
}
