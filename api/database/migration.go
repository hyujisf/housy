package database

import (
	"fmt"
	"housy/models"
	"housy/pkg/sql"
)

func RunMigration() {
	err := sql.DB.AutoMigrate(
		&models.User{},
		&models.Property{},
		&models.City{},
		&models.ListAs{},
		&models.Transaction{},
	)

	if err != nil {
		fmt.Println(err)
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}
