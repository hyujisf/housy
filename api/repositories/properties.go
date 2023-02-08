package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type PropertyRepository interface {
	FindProperties() ([]models.Property, error)
	GetProperty(ID int) (models.Property, error)
	AddProperty(property models.Property) (models.Property, error)
	DeleteProperty(property models.Property) (models.Property, error)
}

func RepositoryProperty(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProperties() ([]models.Property, error) {
	var properties []models.Property
	err := r.db.Preload("City").Find(&properties).Error

	return properties, err
}

func (r *repository) GetProperty(ID int) (models.Property, error) {
	var property models.Property
	err := r.db.Preload("City").Preload("User").First(&property, ID).Error

	return property, err
}

func (r *repository) AddProperty(property models.Property) (models.Property, error) {
	err := r.db.Preload("City").Preload("User").Create(&property).Error

	return property, err
}

func (r *repository) DeleteProperty(property models.Property) (models.Property, error) {
	err := r.db.Delete(&property).Error

	return property, err
}
