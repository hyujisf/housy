package routes

import (
	"housy/handlers"
	"housy/pkg/sql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func ProfileRoutes(r *mux.Router) {
	profileRepository := repositories.RepositoryProfile(sql.DB)
	h := handlers.HandlerProfile(profileRepository)

	r.HandleFunc("/profile/{id}", h.GetProfile).Methods("GET")
}
