package usersdto

import "housy/models"

type UserResponse struct {
	ID       int           `json:"id"`
	Fullname string        `json:"fullname"`
	Username string        `json:"username"`
	ListAs   models.ListAs `json:"list_as"`
	Email    string        `json:"email"`
	Password string        `json:"password"`
	Gender   string        `json:"gender"`
	Phone    string        `json:"phone"`
	Address  string        `json:"address"`
	Image    string        `json:"image"`
}

type ChangePasswordResponse struct {
	Username string `json:"username"`
	Message string `json:"message"`
}

