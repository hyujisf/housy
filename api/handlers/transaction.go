package handlers

import (
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	transactiondto "housy/dto/transaction"
	"housy/models"
	"housy/repositories"
	"net/http"
	"strconv"

	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
)

type handleTransaction struct {
	TransactionRepository repositories.TransactionRepository
}

func HandleTransaction(TransactionRepository repositories.TransactionRepository) *handleTransaction {
	return &handleTransaction{TransactionRepository}
}

func (h *handleTransaction) AddTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	request := new(transactiondto.TransactionRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		fmt.Println("satu")
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		fmt.Println("dua")
		json.NewEncoder(w).Encode(response)
		return
	}

	checkin, _ := time.Parse("2006-01-02", request.Checkin)
	checkout, _ := time.Parse("2006-01-02", request.Checkout)

	transaction := models.Transaction{
		PropertyID: request.PropertyID,
		Checkin:    checkin,
		Checkout:   checkout,
		UserID:     userId,
		Total:      request.Total,
		Status:     request.Status,
	}

	data, err := h.TransactionRepository.AddTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, _ = h.TransactionRepository.GetTransaction(data.ID)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) FindTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as"].(float64))

	if userListAs != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.FindTransaction()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) GetTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as"].(float64))

	if userListAs != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}
