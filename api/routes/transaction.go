package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/sql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func TransRoute(r *mux.Router) {
	transactionRepository := repositories.RepositoryTransaction(sql.DB)
	h := handlers.HandleTransaction(transactionRepository)

	r.HandleFunc("/transaction", middleware.Auth(h.AddTransaction)).Methods("POST")
	r.HandleFunc("/createMidtrans/{id}", middleware.Auth(h.CreateMidtrans)).Methods("GET")
	r.HandleFunc("/notification", h.Notification).Methods("POST")

	r.HandleFunc("/myBooking", middleware.Auth(h.GetMyBooking)).Methods("GET")
}
