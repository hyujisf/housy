package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AddTransaction(transaction models.Transaction) (models.Transaction, error)
	CreateMidtrans(id int) (models.Transaction, error)
	FindTransaction() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	UpdateTransaction(status string, id int) error
	GetMyBooking(ID int) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) AddTransaction(Transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Preload("Property.City").Preload("User").Create(&Transaction).Error

	return Transaction, err
}

func (r *repository) CreateMidtrans(id int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("id = ?", id).First(&Transaction).Error

	return Transaction, err
}

func (r *repository) FindTransaction() ([]models.Transaction, error) {
	var Transaction []models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Preload("User").Find(&Transaction).Error

	return Transaction, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").First(&Transaction, ID).Error

	return Transaction, err
}

func (r *repository) UpdateTransaction(status string, id int) error {
	var transaction models.Transaction
	r.db.Preload("Property").First(&transaction, id)
	transaction.Status = status
	err := r.db.Preload("Property.City").Preload("User").Save(&transaction).Error

	return err
}

func (r *repository) GetMyBooking(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("user_id = ? AND status = ?", ID, "waiting payment").First(&Transaction).Error

	return Transaction, err
}
