package routes

import "github.com/gorilla/mux"

func RouteInit(r *mux.Router) {
	UserRoutes(r)
	AuthRoutes(r)
	PropertyRoutes(r)
	FilterRoutes(r)
	TransRoute(r)
}
