# Seeder Pay - API Specification (v1)

本文件定義了 Seeder Pay 後端系統的所有 RESTful 端點及其使用說明。

- **Base URL**: `http://localhost:8080/api/v1`
- **Auth**: 當前版本使用 Mock 租戶驗證，默認 Tenant ID 為 `acct_demo_123`。

---

## 1. 產品與價格 (Products & Prices)

### 1.1 建立產品
- **Method**: `POST`
- **Path**: `/products`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```

### 1.2 產品列表
- **Method**: `GET`
- **Path**: `/products`
- **Response**: `{ "data": [ProductObject] }`

### 1.3 取得單一產品
- **Method**: `GET`
- **Path**: `/products/:id`

### 1.4 更新產品
- **Method**: `PUT`
- **Path**: `/products/:id`

### 1.5 停用 (存檔) 產品
- **Method**: `DELETE`
- **Path**: `/products/:id`

### 1.6 建立價格
- **Method**: `POST`
- **Path**: `/prices`
- **Body**:
  ```json
  {
    "product_id": "string",
    "currency": "TWD",
    "unit_amount": 1000,
    "billing_interval": "month", // "month", "year", or ""
    "interval_count": 1
  }
  ```

### 1.7 取得產品的所有價格
- **Method**: `GET`
- **Path**: `/products/:id/prices`

---

## 2. 顧客管理 (Customers)

### 2.1 建立顧客
- **Method**: `POST`
- **Path**: `/customers`
- **Body**:
  ```json
  {
    "email": "customer@example.com",
    "name": "Jane Doe"
  }
  ```

### 2.2 顧客列表
- **Method**: `GET`
- **Path**: `/customers`
- **Query Params**: `?email=...` (可選，按 Email 精確搜尋)

### 2.3 取得單一顧客
- **Method**: `GET`
- **Path**: `/customers/:id`

### 2.4 更新顧客信息
- **Method**: `PUT`
- **Path**: `/customers/:id`

---

## 3. 訂閱與發票 (Subscriptions & Invoices)

### 3.1 創建訂閱 (支付)
- **Method**: `POST`
- **Path**: `/subscriptions`
- **Body**:
  ```json
  {
    "customer_id": "string",
    "price_id": "string",
    "token": "tok_visa" // Mock token
  }
  ```

### 3.2 訂閱列表
- **Method**: `GET`
- **Path**: `/subscriptions`

### 3.3 獲取單一訂閱
- **Method**: `GET`
- **Path**: `/subscriptions/:id`

### 3.4 取消訂閱
- **Method**: `PUT`
- **Path**: `/subscriptions/:id/cancel`
- **Body**: `{ "immediate": false }` (false 表示週期結束後取消)

### 3.5 發票/訂單列表
- **Method**: `GET`
- **Path**: `/invoices`

### 3.6 獲取單一發票
- **Method**: `GET`
- **Path**: `/invoices/:id`

---

## 4. 統計數據 (Stats)

### 4.1 儀表板總覽數據
- **Method**: `GET`
- **Path**: `/stats/overview`
- **Response**:
  ```json
  {
    "total_revenue": 10000,
    "active_subscribers": 4,
    "total_customers": 10,
    "total_orders": 12,
    "mrr": 3969,
    "pending_invoices": 1
  }
  ```
