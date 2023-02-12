package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/sql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func PropertyRoutes(r *mux.Router) {
	propertyRepository := repositories.RepositoryProperty(sql.DB)
	h := handlers.HandlerProperty(propertyRepository)

	// sementara
	// r.HandleFunc("/property", middleware.Auth(h.AddProperty)).Methods("POST")
	// this
	r.HandleFunc("/properties", h.FindProperties).Methods("GET")
	r.HandleFunc("/property/{id}", h.GetProperty).Methods("GET")
	r.HandleFunc("/property", middleware.Auth(middleware.UploadFile(h.AddProperty))).Methods("POST")
	r.HandleFunc("/cities", h.FindCities).Methods("GET")
	// r.HandleFunc("/properties", middleware.Auth(h.FindProperties)).Methods("GET")
	// r.HandleFunc("/property/{id}", h.GetProperty).Methods("GET")
	// r.HandleFunc("/property", middleware.Auth(middleware.UploadFile(h.AddProperty))).Methods("POST")
	// r.HandleFunc("/property/{id}", middleware.Auth(h.DeleteProperty)).Methods("DELETE")
}
