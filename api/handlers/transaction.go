package handlers

import (
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	transactiondto "housy/dto/transaction"
	"housy/models"
	"housy/repositories"
	"log"
	"net/http"
	"os"
	"strconv"

	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"gopkg.in/gomail.v2"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
)

// Declare Coreapi Client ...
var c = coreapi.Client{
	ServerKey: os.Getenv("SERVER_KEY"),
	ClientKey: os.Getenv("CLIENT_KEY"),
}

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
		fmt.Println("valid")
		json.NewEncoder(w).Encode(response)
		return
	}

	var TransIdIsMatch = false
	var TransactionId int
	for !TransIdIsMatch {
		TransactionId = userId + request.PropertyID + int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(TransactionId)
		if transactionData.ID == 0 {
			TransIdIsMatch = true
		}
	}

	checkin, _ := time.Parse("2006-01-02", request.Checkin)
	checkout, _ := time.Parse("2006-01-02", request.Checkout)

	transaction := models.Transaction{
		ID:         TransactionId,
		PropertyID: request.PropertyID,
		Checkin:    checkin,
		Checkout:   checkout,
		UserID:     userId,
		Total:      request.Total,
		Status:     request.Status,
	}

	fmt.Println(transaction)

	data, err := h.TransactionRepository.AddTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	err = h.TransactionRepository.UpdateStatus(data.PropertyID)
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

func (h *handleTransaction) CreateMidtrans(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userId := int(userInfo["id"].(float64))
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	// request := new(transactiondto.TransactionRequest)
	// if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
	// 	fmt.Println("satu")
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }
	// fmt.Println(request)

	// validation := validator.New()
	// err := validation.Struct(request)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
	// 	fmt.Println("valid")
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }
	dataTransactions, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}

	// // Create Unique Transaction Id ...
	// var TransIdIsMatch = false
	// var TransactionId int
	// for !TransIdIsMatch {
	// 	TransactionId = userId + dataTransactions.ID + rand.Intn(10000) - rand.Intn(100)
	// 	transactionData, _ := h.TransactionRepository.GetTransaction(TransactionId)
	// 	if transactionData.ID == 0 {
	// 		TransIdIsMatch = true
	// 	}
	// }

	// checkin, _ := time.Parse("2006-01-02", request.Checkin)
	// checkout, _ := time.Parse("2006-01-02", request.Checkout)

	// transaction := models.Transaction{
	// 	ID: TransactionId,
	// 	PropertyID: request.PropertyID,
	// 	Checkin:    checkin,
	// 	Checkout:   checkout,
	// 	UserID:     userId,
	// 	Total:      request.Total,
	// 	Status:     "pending",
	// }

	// fmt.Println(transaction)

	// dataTransactions, err := h.TransactionRepository.GetTransaction(data.ID)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	json.NewEncoder(w).Encode(err.Error())
	// 	return
	// }

	// Request payment token from midtrans ...
	// 1. Initiate Snap client
	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(dataTransactions.ID),
			GrossAmt: int64(dataTransactions.Total),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: dataTransactions.User.Fullname,
			Email: dataTransactions.User.Email,
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)

	fmt.Println(snapResp)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: snapResp}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) Notification(w http.ResponseWriter, r *http.Request) {
	var notificationPayload map[string]interface{}

	err := json.NewDecoder(r.Body).Decode(&notificationPayload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId, _ := strconv.Atoi(notificationPayload["order_id"].(string))

	transaction, _ := h.TransactionRepository.GetTransaction(orderId)
	fmt.Println(transaction)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			// TODO set transaction status on your database to 'challenge'
			// e.g: 'Payment status challenged. Please take action on your Merchant Administration Portal
			h.TransactionRepository.UpdateTransaction("pending", orderId)
		} else if fraudStatus == "accept" {
			// TODO set transaction status on your database to 'success'
			h.TransactionRepository.UpdateTransaction("success", orderId)
			SendMail("success", transaction)

		}
	} else if transactionStatus == "settlement" {
		// TODO set transaction status on your databaase to 'success'
		h.TransactionRepository.UpdateTransaction("success", orderId)
		SendMail("success", transaction)

	} else if transactionStatus == "deny" {
		// TODO you can ignore 'deny', because most of the time it allows payment retries
		// and later can become success
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransaction("failed", orderId)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		// TODO set transaction status on your databaase to 'failure'
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransaction("failed", orderId)
	} else if transactionStatus == "pending" {
		// TODO set transaction status on your databaase to 'pending' / waiting payment
		h.TransactionRepository.UpdateTransaction("pending", orderId)
	}

	w.WriteHeader(http.StatusOK)
}

func (h *handleTransaction) FindTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userId := int(userInfo["id"].(float64))

	if userListAs != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.FindTransaction(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((err.Error()))
		return
	}
	fmt.Println(transaction)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) GetTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	// userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userListAs := int(userInfo["list_as_id"].(float64))

	// if userListAs != 2 {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }

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

func (h *handleTransaction) GetMyBooking(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))

	if userListAs != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.GetMyBooking(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	// fmt.Println(transaction)
	// fmt.Println("11")

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) History(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))

	if userListAs != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.HistoryTenant(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	// fmt.Println(transaction)
	// fmt.Println("11")

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) HistoryOwner(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	// userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))

	// if userListAs != 1 {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
	// 	json.NewEncoder(w).Encode(response)
	// 	return
	// }

	transaction, err := h.TransactionRepository.HistoryOwner(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	// fmt.Println(transaction)
	// fmt.Println("11")

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func SendMail(status string, transaction models.Transaction) {

	if status != transaction.Status && (status == "success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "Housy <" + os.Getenv("SYSTEM_EMAIL") + ">"
		var CONFIG_AUTH_EMAIL = os.Getenv("SYSTEM_EMAIL")
		var CONFIG_AUTH_PASSWORD = os.Getenv("SYSTEM_PASSWORD")

		var propertytName = transaction.Property.Name
		var price = strconv.Itoa(int(transaction.Total))

		fmt.Println(transaction.User.Email)

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
	  <html lang="en">
		<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<style>
		  h1 {
		  color: brown;
		  }
		</style>
		</head>
		<body>
		<h2>Property payment :</h2>
		<ul style="list-style-type:none;">
		  <li>Name : %s</li>
		  <li>Total payment: Rp.%s</li>
		  <li>Status : <b>%s</b></li>
		</ul>
		</body>
	  </html>`, propertytName, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}
