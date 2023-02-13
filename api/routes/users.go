package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	// r.HandleFunc("/users", h.FindUsers).Methods("GET")
	r.HandleFunc("/user/{id}", h.GetUser).Methods("GET")
	r.HandleFunc("/user/changePassword", middleware.Auth(h.ChangePassword)).Methods("PATCH")
	// r.HandleFunc("/user/{id}/changePhotoProfile", middleware.Auth(middleware.UploadFile(h.ChangePhotoProfile))  ).Methods("PATCH")
	r.HandleFunc("/user/changeImage/{id}", middleware.UploadFile(h.ChangeImage)).Methods("PATCH")
	// r.HandleFunc("/user/{id}", h.DeleteUser).Methods("DELETE")
}
