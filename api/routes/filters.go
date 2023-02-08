package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/sql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func FilterRoutes(r *mux.Router) {
	filterRepository := repositories.RepositoryFilter(sql.DB)
	h := handlers.HandlerFilter(filterRepository)

	r.HandleFunc("/singleFilter", middleware.Auth(h.SingleParameter)).Methods("GET")
	r.HandleFunc("/multiFilter", middleware.Auth(h.MultiParameter)).Methods("GET")

}
