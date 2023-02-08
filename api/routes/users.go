package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/sql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router) {
	userRepository := repositories.RepositoryUser(sql.DB)
	h := handlers.HandlerUser(userRepository)

	// r.HandleFunc("/users", h.FindUsers).Methods("GET")
	r.HandleFunc("/user/{id}", h.GetUser).Methods("GET")
	r.HandleFunc("/user/{id}/changePassword", h.ChangePassword).Methods("PATCH")
	r.HandleFunc("/user/{id}/changePhotoProfile", middleware.Auth(middleware.UploadFile(h.ChangePhotoProfile))).Methods("PATCH")
	// r.HandleFunc("/user/changeImage/{id}", h.ChangeImage).Methods("PATCH")
	// r.HandleFunc("/user/{id}", h.DeleteUser).Methods("DELETE")
}
