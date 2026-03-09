package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"seeder_pay_api/api/handler"
	"seeder_pay_api/core/domain/model"
	"seeder_pay_api/core/domain/service"
	"seeder_pay_api/core/port/gateway"
	"seeder_pay_api/db"
)

func main() {
	// Initialize Database
	database, err := gorm.Open(sqlite.Open("seeder_local.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Auto Migrate
	database.AutoMigrate(
		&model.AccountTenant{},
		&model.CoreCustomer{},
		&model.CoreProduct{},
		&model.CorePrice{},
		&model.CoreSubscription{},
		&model.TxInvoice{},
		&model.CorePromoCode{},
	)

	// Dependency Injection
	productRepo := db.NewProductRepository(database)
	priceRepo := db.NewPriceRepository(database)
	customerRepo := db.NewCustomerRepository(database)
	subscriptionRepo := db.NewSubscriptionRepository(database)
	invoiceRepo := db.NewInvoiceRepository(database)
	promoRepo := db.NewPromoCodeRepository(database)

	productSvc := service.NewProductService(productRepo, priceRepo)
	customerSvc := service.NewCustomerService(customerRepo)
	statsSvc := service.NewStatsService(database)
	promoSvc := service.NewPromoCodeService(promoRepo)

	// Use mock payment gateway for now
	paymentGateway := gateway.NewMockPaymentAdapter()
	subscriptionSvc := service.NewSubscriptionService(subscriptionRepo, priceRepo, paymentGateway)
	invoiceSvc := service.NewInvoiceService(invoiceRepo)

	restHandler := handler.NewRestHandler(productSvc, customerSvc, subscriptionSvc, invoiceSvc, statsSvc, promoSvc)

	// Setup Router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	v1 := r.Group("/api/v1")
	{
		// Products
		v1.POST("/products", restHandler.CreateProduct)
		v1.GET("/products", restHandler.ListProducts)
		v1.GET("/products/:id", restHandler.GetProduct)
		v1.PUT("/products/:id", restHandler.UpdateProduct)
		v1.DELETE("/products/:id", restHandler.ArchiveProduct)
		v1.GET("/products/:id/prices", restHandler.ListPrices)

		// Prices
		v1.POST("/prices", restHandler.CreatePrice)

		// Customers
		v1.POST("/customers", restHandler.CreateCustomer)
		v1.GET("/customers", restHandler.ListCustomers)
		v1.GET("/customers/:id", restHandler.GetCustomer)
		v1.PUT("/customers/:id", restHandler.UpdateCustomer)
		v1.DELETE("/customers/:id", restHandler.DeleteCustomer)

		// Subscriptions
		v1.POST("/subscriptions", restHandler.CreateSubscription)
		v1.GET("/subscriptions", restHandler.ListSubscriptions)
		v1.GET("/subscriptions/:id", restHandler.GetSubscription)
		v1.PUT("/subscriptions/:id/cancel", restHandler.CancelSubscription)

		// Invoices (Orders)
		v1.GET("/invoices", restHandler.ListInvoices)
		v1.GET("/invoices/:id", restHandler.GetInvoice)

		// Stats
		v1.GET("/stats/overview", restHandler.GetStatsOverview)

		// Promo Codes
		v1.GET("/promo-codes", restHandler.ListPromoCodes)
		v1.POST("/promo-codes", restHandler.CreatePromoCode)
		v1.DELETE("/promo-codes/:id", restHandler.DeletePromoCode)
		v1.PATCH("/promo-codes/:id/active", restHandler.TogglePromoCode)
	}

	log.Println("Starting Server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
