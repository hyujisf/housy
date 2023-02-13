package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func TransRoute(r *mux.Router) {
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	h := handlers.HandleTransaction(transactionRepository)

	r.HandleFunc("/transaction", middleware.Auth(h.AddTransaction)).Methods("POST")
	r.HandleFunc("/createMidtrans/{id}", middleware.Auth(h.CreateMidtrans)).Methods("GET")
	r.HandleFunc("/notification", h.Notification).Methods("POST")
	r.HandleFunc("/historyTenant", middleware.Auth(h.History)).Methods("GET")
	r.HandleFunc("/historyOwner", middleware.Auth(h.HistoryOwner)).Methods("GET")
	r.HandleFunc("/allTransaction", middleware.Auth(h.FindTransaction)).Methods("GET")
	r.HandleFunc("/myBooking", middleware.Auth(h.GetMyBooking)).Methods("GET")
	r.HandleFunc("/getTransaction/{id}", middleware.Auth(h.GetTransaction)).Methods("GET")
}