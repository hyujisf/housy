package transactiondto

type TransactionRequest struct {
	ID         int     `json:"id" form:"id" `
	PropertyID int     `json:"property_id" form:"property_id" validate:"required"`
	Checkin    string  `json:"checkin" form:"checkin" validate:"required"`
	Checkout   string  `json:"checkout" form:"checkout" validate:"required"`
	Status     string  `json:"status" form:"status" validate:"required"`
	Total      float64 `json:"total" form:"total" validate:"required"`
	UserID     int     `json:"user_id" form:"user_id"`
}
