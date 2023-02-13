package handlers

import (
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	"housy/models"
	"housy/repositories"
	"net/http"

	// "github.com/golang-jwt/jwt/v4"
)

type handlerFilter struct {
	FilterRepository repositories.FilterRepository
}

func HandlerFilter(FilterRepository repositories.FilterRepository) *handlerFilter {
	return &handlerFilter{FilterRepository}
}

func (h *handlerFilter) SingleParameter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	// userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userRole := int(userInfo["list_as_id"].(float64))

	// if userRole != 2 {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized as Tenant"}
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }

	singleParams := r.URL.Query().Get("city")

	fmt.Println(singleParams)

	city, _ := h.FilterRepository.FindCity()

	dataCity := models.City{}

	for _, data := range city {
		if singleParams == data.Name {
			dataCity = models.City{
				ID:   data.ID,
				Name: singleParams,
			}
		}

	}

	cityId := dataCity.ID

	houses, err := h.FilterRepository.SingleParameter(cityId)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "City not found"}
		fmt.Println("2")
		json.NewEncoder(w).Encode(response)
		return
	}


	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: houses}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerFilter) MultiParameter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	// userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userRole := int(userInfo["list_as_id"].(float64))

	// if userRole != 2 {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized as Tenant"}
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }

	params := r.URL.Query()

	houses, err := h.FilterRepository.MultiParameter(params)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}
	

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: houses}
	json.NewEncoder(w).Encode(response)
}
