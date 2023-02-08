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
	r.HandleFunc("/transactions", middleware.Auth(h.FindTransaction)).Methods("GET")
	r.HandleFunc("/transaction/{id}", middleware.Auth(h.GetTransaction)).Methods("GET")
	// r.HandleFunc("/transactions", middleware.Auth(h.GetTransactionID)).Methods("GET")
	// r.HandleFunc("/transaction/{id}", middleware.Auth(h.UpdateTransaction)).Methods("PATCH")
	// r.HandleFunc("/transaction/{id}", middleware.Auth(h.DeleteTransaction)).Methods("DELETE")
	// r.HandleFunc("/notification", middleware.Auth(h.Notification)).Methods("POST")
}
