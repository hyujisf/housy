package usersdto

type ChangePasswordRequest struct {
	OldPassword        string `json:"old_password" form:"old_password" validate:"required"`
	ConfirmNewPassword string `json:"confirm_new_password" form:"confirm_new_password" validate:"required"`
}

type ChangePhotoRequest struct {
	Image        string `json:"image" form:"image" validate:"required"`
}
