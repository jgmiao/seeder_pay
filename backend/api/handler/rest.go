package handler

import (
	"net/http"
	"seeder_pay_api/core/domain/service"
	"seeder_pay_api/core/port"
	"seeder_pay_api/core/port/gateway"
	"time"

	"github.com/gin-gonic/gin"
)

type RestHandler struct {
	productService      port.ProductService
	customerService     port.CustomerService
	subscriptionService port.SubscriptionService
	invoiceService      port.InvoiceService
	promoCodeService    port.PromoCodeService
	statsSvc            *service.StatsService
}

func NewRestHandler(
	ps port.ProductService,
	cs port.CustomerService,
	ss port.SubscriptionService,
	is port.InvoiceService,
	stats *service.StatsService,
	promo port.PromoCodeService,
) *RestHandler {
	return &RestHandler{
		productService:      ps,
		customerService:     cs,
		subscriptionService: ss,
		invoiceService:      is,
		statsSvc:            stats,
		promoCodeService:    promo,
	}
}

// EnsureTenant is a simple mock middleware to act as auth extraction
func EnsureTenant(c *gin.Context) string {
	return "acct_demo_123"
}

// ======================== PRODUCTS ========================

// POST /apis/v1/products
func (h *RestHandler) CreateProduct(c *gin.Context) {
	tenantID := EnsureTenant(c)
	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	prod, err := h.productService.CreateProduct(c.Request.Context(), tenantID, req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, prod)
}

// GET /apis/v1/products
func (h *RestHandler) ListProducts(c *gin.Context) {
	tenantID := EnsureTenant(c)
	prods, err := h.productService.ListProducts(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prods})
}

// GET /apis/v1/products/:id
func (h *RestHandler) GetProduct(c *gin.Context) {
	id := c.Param("id")
	prod, err := h.productService.GetProductByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}
	c.JSON(http.StatusOK, prod)
}

// PUT /apis/v1/products/:id
func (h *RestHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	prod, err := h.productService.UpdateProduct(c.Request.Context(), id, req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, prod)
}

// DELETE /apis/v1/products/:id
func (h *RestHandler) ArchiveProduct(c *gin.Context) {
	id := c.Param("id")
	if err := h.productService.ArchiveProduct(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// ======================== PRICES ========================

// POST /apis/v1/prices
func (h *RestHandler) CreatePrice(c *gin.Context) {
	var req struct {
		ProductID       string `json:"product_id" binding:"required"`
		Currency        string `json:"currency"`
		UnitAmount      int    `json:"unit_amount" binding:"required"`
		BillingInterval string `json:"billing_interval"`
		IntervalCount   int    `json:"interval_count"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Currency == "" {
		req.Currency = "TWD"
	}
	if req.IntervalCount == 0 {
		req.IntervalCount = 1
	}
	price, err := h.productService.CreatePrice(c.Request.Context(), req.ProductID, req.Currency, req.UnitAmount, req.BillingInterval, req.IntervalCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, price)
}

// GET /apis/v1/products/:id/prices
func (h *RestHandler) ListPrices(c *gin.Context) {
	id := c.Param("id")
	prices, err := h.productService.ListPricesByProduct(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prices})
}

// ======================== CUSTOMERS ========================

// POST /apis/v1/customers
func (h *RestHandler) CreateCustomer(c *gin.Context) {
	tenantID := EnsureTenant(c)
	var req struct {
		Email string `json:"email" binding:"required,email"`
		Name  string `json:"name"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cus, err := h.customerService.CreateCustomer(c.Request.Context(), tenantID, req.Email, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cus)
}

// GET /apis/v1/customers
func (h *RestHandler) ListCustomers(c *gin.Context) {
	tenantID := EnsureTenant(c)
	email := c.Query("email")
	if email != "" {
		cus, err := h.customerService.GetCustomerByEmail(c.Request.Context(), tenantID, email)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": []interface{}{cus}})
		return
	}
	customers, err := h.customerService.ListCustomers(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customers})
}

// GET /apis/v1/customers/:id
func (h *RestHandler) GetCustomer(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	cus, err := h.customerService.GetCustomer(c.Request.Context(), tenantID, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}
	c.JSON(http.StatusOK, cus)
}

// PUT /apis/v1/customers/:id
func (h *RestHandler) UpdateCustomer(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	var req struct {
		Email string `json:"email" binding:"required,email"`
		Name  string `json:"name"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cus, err := h.customerService.UpdateCustomer(c.Request.Context(), tenantID, id, req.Email, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cus)
}

// DELETE /apis/v1/customers/:id
func (h *RestHandler) DeleteCustomer(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	if err := h.customerService.DeleteCustomer(c.Request.Context(), tenantID, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// ======================== SUBSCRIPTIONS ========================

// POST /apis/v1/subscriptions
func (h *RestHandler) CreateSubscription(c *gin.Context) {
	tenantID := EnsureTenant(c)
	var req struct {
		CustomerID string `json:"customer_id" binding:"required"`
		PriceID    string `json:"price_id" binding:"required"`
		Token      string `json:"token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sub, err := h.subscriptionService.Subscribe(c.Request.Context(), tenantID, req.CustomerID, req.PriceID, gateway.Token(req.Token))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sub)
}

// GET /apis/v1/subscriptions
func (h *RestHandler) ListSubscriptions(c *gin.Context) {
	tenantID := EnsureTenant(c)
	subs, err := h.subscriptionService.ListSubscriptions(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subs})
}

// GET /apis/v1/subscriptions/:id
func (h *RestHandler) GetSubscription(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	sub, err := h.subscriptionService.GetSubscription(c.Request.Context(), tenantID, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "subscription not found"})
		return
	}
	c.JSON(http.StatusOK, sub)
}

// PUT /apis/v1/subscriptions/:id/cancel
func (h *RestHandler) CancelSubscription(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	var req struct {
		Immediate bool `json:"immediate"`
	}
	c.ShouldBindJSON(&req)

	sub, err := h.subscriptionService.CancelSubscription(c.Request.Context(), tenantID, id, req.Immediate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sub)
}

// ======================== INVOICES/ORDERS ========================

// GET /apis/v1/invoices
func (h *RestHandler) ListInvoices(c *gin.Context) {
	tenantID := EnsureTenant(c)
	invs, err := h.invoiceService.ListInvoices(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": invs})
}

// GET /apis/v1/invoices/:id
func (h *RestHandler) GetInvoice(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	inv, err := h.invoiceService.GetInvoice(c.Request.Context(), tenantID, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "invoice not found"})
		return
	}
	c.JSON(http.StatusOK, inv)
}

// ======================== STATS ========================

// GET /apis/v1/stats/overview
func (h *RestHandler) GetStatsOverview(c *gin.Context) {
	tenantID := EnsureTenant(c)
	stats, err := h.statsSvc.GetOverview(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// ======================== PROMO CODES ========================

// GET /apis/v1/promo-codes
func (h *RestHandler) ListPromoCodes(c *gin.Context) {
	tenantID := EnsureTenant(c)
	promos, err := h.promoCodeService.ListPromoCodes(c.Request.Context(), tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": promos})
}

// POST /apis/v1/promo-codes
func (h *RestHandler) CreatePromoCode(c *gin.Context) {
	tenantID := EnsureTenant(c)
	var req struct {
		Code          string     `json:"code" binding:"required"`
		DiscountType  string     `json:"discount_type" binding:"required"` // 'percent' | 'fixed'
		DiscountValue int        `json:"discount_value" binding:"required"`
		MaxUses       *int       `json:"max_uses"`
		ExpiresAt     *time.Time `json:"expires_at"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	promo, err := h.promoCodeService.CreatePromoCode(c.Request.Context(), tenantID, req.Code, req.DiscountType, req.DiscountValue, req.MaxUses, req.ExpiresAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, promo)
}

// DELETE /apis/v1/promo-codes/:id
func (h *RestHandler) DeletePromoCode(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	if err := h.promoCodeService.DeletePromoCode(c.Request.Context(), tenantID, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// PATCH /apis/v1/promo-codes/:id/active
func (h *RestHandler) TogglePromoCode(c *gin.Context) {
	tenantID := EnsureTenant(c)
	id := c.Param("id")
	var req struct {
		Active bool `json:"active"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.promoCodeService.TogglePromoCode(c.Request.Context(), tenantID, id, req.Active); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
