package database

import (
	"errors"
	"fmt"
	"housy/models"
	"housy/pkg/bcrypt"
	"housy/pkg/mysql"
	"log"
	"strconv"
	"time"

	"gorm.io/gorm"
)

func RunSeeder() {
	// ==================================
	// CREATE SUPER ADMIN ON MIGRATION
	// ==================================

	// cek is list_as table exist
	if mysql.DB.Migrator().HasTable(&models.ListAs{}) {
		// check is list_as table has minimum 1 Role as owner
		err := mysql.DB.First(&models.ListAs{}, "id = ?", 1).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {

			// create 2 Role
			newRole := []models.ListAs{
				{Name: "Owner"},
				{Name: "Tenant"},
			}

			// insert admin to database
			errAddListAs := mysql.DB.Select("Name").Create(&newRole).Error
			if errAddListAs != nil {
				fmt.Println(errAddListAs.Error())
				log.Fatal("Seeding failed")
			}
		}
	}

	// cek is user table exist
	if mysql.DB.Migrator().HasTable(&models.User{}) {
		// check is user table has minimum 1 user as admin
		err := mysql.DB.First(&models.User{}, "ListAsId = ?", 1).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {

			// Hashing password
			hashPassword, err := bcrypt.HashingPassword("123")
			if err != nil {
				log.Fatal("Hash password failed")
			}

			// create 1 admin
			newUser := models.User{
				Fullname: "Owner",
				Username: "owner",
				Password: hashPassword,
				ListAsId: 1,
				Email:    "owner@housy.com",
				Gender:   "Male",
				Phone:    "081234567890",
				Address:  "Diruma aja",
				Image:    "https://api.dicebear.com/5.x/thumbs/svg?seed=" + strconv.Itoa(int(time.Now().Unix())),
			}

			// insert admin to database
			errAddUser := mysql.DB.Select("Fullname", "Username", "Password", "ListAsId", "Email", "Gender", "Phone", "Address", "Image").Create(&newUser).Error
			if errAddUser != nil {
				fmt.Println(errAddUser.Error())
				log.Fatal("Seeding failed")
			}
		}
	}

	// cek is cities table exist
	if mysql.DB.Migrator().HasTable(&models.City{}) {
		// check is cities table has minimum 2 Cities
		err := mysql.DB.First(&models.City{}, "id = ?", 1).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {

			// create 2 Role
			newUser := []models.City{
				{Name: "Tangerang"},
				{Name: "Tangerang Selatan"},
			}

			// insert admin to database
			errAddCity := mysql.DB.Select("Name").Create(&newUser).Error
			if errAddCity != nil {
				fmt.Println(errAddCity.Error())
				log.Fatal("Seeding failed")
			}
		}
	}

	fmt.Println("Seeding completed successfully")
}
