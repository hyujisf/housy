package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AddTransaction(transaction models.Transaction) (models.Transaction, error)
	FindTransaction() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	UpdateTransaction(transaction models.Transaction) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) AddTransaction(Transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&Transaction).Error

	return Transaction, err
}

func (r *repository) FindTransaction() ([]models.Transaction, error) {
	var Transaction []models.Transaction
	err := r.db.Preload("Property.City").Find(&Transaction).Error

	return Transaction, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").First(&Transaction, ID).Error

	return Transaction, err
}

func (r *repository) UpdateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error

	return transaction, err
}