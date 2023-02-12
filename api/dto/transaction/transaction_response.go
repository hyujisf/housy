package transactiondto

import (
	"housy/models"
)

type TransactionResponse struct {
	ID         int                     `json:"id" `
	PropertyID int                     `json:"property_id" `
	Property   models.PropertyResponse `json:"property" `
	Checkin    string                  `json:"checkin" `
	Checkout   string                  `json:"checkout" `
	Status     string                  `json:"status" `
	Total      float64                 `json:"total" `
}
