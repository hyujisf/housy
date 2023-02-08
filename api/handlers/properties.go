package handlers

import (
	"encoding/json"
	propertiesdto "housy/dto/properties"
	dto "housy/dto/result"
	"housy/models"
	"housy/repositories"
	"net/http"
	"strconv"

	// "os"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"gorm.io/datatypes"
)

type handlerProperty struct {
	PropertyRepository repositories.PropertyRepository
}

func HandlerProperty(PropertyRepository repositories.PropertyRepository) *handlerProperty {
	return &handlerProperty{PropertyRepository}
}

func (h *handlerProperty) FindProperties(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// // get data user token
	// userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userRole := int(userInfo["list_as_id"].(float64))

	// if userRole != 2 {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized as Tenant"}
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }

	properties, err := h.PropertyRepository.FindProperties()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	// for i, p := range properties {
	// 	imagePath := os.Getenv("PATH_FILE") + p.Image
	// 	properties[i].Image = imagePath
	// }

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: properties}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerProperty) GetProperty(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	property, err := h.PropertyRepository.GetProperty(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: property}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerProperty) AddProperty(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized as Owner"}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Get dataFile from midleware and store to filename variable here ...
	dataContex := r.Context().Value("dataFile") // add this code
	filename := dataContex.(string)             // add this code

	city_id, _ := strconv.Atoi(r.FormValue("city_id"))
	price, _ := strconv.Atoi(r.FormValue("price"))
	bedroom, _ := strconv.Atoi(r.FormValue("bedroom"))
	bathroom, _ := strconv.Atoi(r.FormValue("bathroom"))
	size, _ := strconv.Atoi(r.FormValue("size"))

	request := propertiesdto.PropertyRequest{
		Name:        r.FormValue("name"),
		CityId:      city_id,
		Address:     r.FormValue("address"),
		Price:       float64(price),
		TypeRent:    r.FormValue("type_rent"),
		Amenities:   datatypes.JSON(r.FormValue("amenities")),
		Bedroom:     bedroom,
		Bathroom:    bathroom,
		Description: r.FormValue("description"),
		Size:        size,
		District:    r.FormValue("district"),
		Image:       filename,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	property := models.Property{
		Name:        request.Name,
		CityId:      request.CityId,
		Address:     request.Address,
		Price:       request.Price,
		TypeRent:    request.TypeRent,
		Amenities:   request.Amenities,
		Bedroom:     request.Bedroom,
		Bathroom:    request.Bathroom,
		Description: request.Description,
		Size:        request.Size,
		District:    request.District,
		Image:       request.Image,
		UserID:      userId,
	}

	data, err := h.PropertyRepository.AddProperty(property)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	property, _ = h.PropertyRepository.GetProperty(data.ID)

	dataProperty := propertiesdto.PropertyResponse{
		ID:          property.ID,
		Name:        property.Name,
		City:        property.City,
		Address:     property.Address,
		Price:       property.Price,
		TypeRent:    property.TypeRent,
		Amenities:   property.Amenities,
		Bedroom:     property.Bedroom,
		Bathroom:    property.Bathroom,
		Description: property.Description,
		Size:        property.Size,
		District:    property.District,
		Image:       property.Image,
		UserID:      property.UserID,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataProperty}
	json.NewEncoder(w).Encode(response)
}

// func (h *handlerProperty) DeleteProperty(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")

// 	id, _ := strconv.Atoi(mux.Vars(r)["id"])
// 	property, err := h.PropertyRepository.GetProperty(id)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
// 		json.NewEncoder(w).Encode(response)
// 		return
// 	}

// 	data, err := h.PropertyRepository.DeleteProperty(property)
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
// 		json.NewEncoder(w).Encode(response)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// 	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProperty(data)}
// 	json.NewEncoder(w).Encode(response)
// }

// func convertResponseProperty(u models.Property) models.PropertyResponse {
// 	return models.PropertyResponse{
// 		ID:        u.ID,
// 		Name:      u.Name,
// 		City:      u.City,
// 		Address:   u.Address,
// 		Price:     u.Price,
// 		TypeRent:  u.TypeRent,
// 		Amenities: u.Amenities,
// 		Bedroom:   u.Bedroom,
// 		Bathroom:  u.Bathroom,
// 		Image:     u.Image,
// 		User: u.User,
// 	}
// }
