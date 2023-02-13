package routes

import (
	"housy/handlers"
	"housy/pkg/mysql"
	"housy/repositories"


	"github.com/gorilla/mux"
)

func FilterRoutes(r *mux.Router) {
	filterRepository := repositories.RepositoryFilter(mysql.DB)
	h := handlers.HandlerFilter(filterRepository)

	r.HandleFunc("/singleFilter", h.SingleParameter).Methods("GET")
	r.HandleFunc("/multiFilter", h.MultiParameter).Methods("GET")

	
}