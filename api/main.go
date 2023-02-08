package main

import (
	"fmt"
	"housy/database"
	"housy/pkg/sql"
	"housy/routes"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	// godotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	DB_HOST := os.Getenv("DB_HOST")
	PORT := os.Getenv("PORT")
	API_VERSION := os.Getenv("API_VERSION")

	// Database
	sql.DatabaseInit()

	// Migration
	database.RunMigration()

	r := mux.NewRouter()

	routes.RouteInit(r.PathPrefix("/api/" + API_VERSION).Subrouter())

	// Initialization "uploads" folder to public here ...
	r.PathPrefix("/uploads").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	// Setup allowed Header, Method, and Origin for CORS on this below code ...
	var AllowedHeaders = handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	var AllowedMethods = handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS", "PATCH", "DELETE"})
	var AllowedOrigins = handlers.AllowedOrigins([]string{"*"})

	// Embed the setup allowed in 2 parameter on this below code ...
	fmt.Println("Server is running on http://" + DB_HOST + ":" + PORT + "/api/" + API_VERSION)
	http.ListenAndServe(":"+PORT, handlers.CORS(AllowedHeaders, AllowedMethods, AllowedOrigins)(r))
}
