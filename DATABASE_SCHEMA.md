# Seeder Pay - Database Schema

本文件記錄了 Seeder Pay 系統的微服務資料庫綱要（DDL）與預設初始化資料（DML）。

目前系統在本地端開發預設使用 SQLite，而在正式環境（Production）預期使用 MySQL/PostgreSQL。以下 DDL 以標準相容 SQL 為準。

## 1. DDL (Data Definition Language)

### 1.1 租戶與核心設定表
```sql
-- 帳戶租戶表 (管理不同的商戶/使用者)
CREATE TABLE `account_tenant` (
    `id` varchar(64) PRIMARY KEY,
    `name` varchar(128) NOT NULL,
    `gateway_provider` varchar(32) NOT NULL DEFAULT 'mock',
    `gateway_config` text,
    `status` tinyint(2) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 核心業務與商品表
```sql
-- 客戶表 (訂閱與購買商品的使用者)
CREATE TABLE `core_customer` (
    `id` varchar(64) PRIMARY KEY,
    `tenant_id` varchar(64) NOT NULL,
    `email` varchar(128) NOT NULL,
    `name` varchar(128),
    `default_payment_method_id` varchar(64),
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE `core_product` (
    `id` varchar(64) PRIMARY KEY,
    `tenant_id` varchar(64) NOT NULL,
    `name` varchar(128) NOT NULL,
    `description` text,
    `active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 價格表 (一個商品可以有多個定價方案)
CREATE TABLE `core_price` (
    `id` varchar(64) PRIMARY KEY,
    `product_id` varchar(64) NOT NULL,
    `currency` varchar(3) NOT NULL DEFAULT 'TWD',
    `unit_amount` int(11) NOT NULL,
    `billing_interval` varchar(20), -- 'month', 'year', or NULL for one-time
    `interval_count` int(11) NOT NULL DEFAULT 1,
    `active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 1.3 訂閱與交易紀錄表
```sql
-- 訂閱紀錄表
CREATE TABLE `core_subscription` (
    `id` varchar(64) PRIMARY KEY,
    `tenant_id` varchar(64) NOT NULL,
    `customer_id` varchar(64) NOT NULL,
    `price_id` varchar(64) NOT NULL,
    `status` varchar(32) NOT NULL, -- e.g., 'active', 'canceled', 'past_due'
    `current_period_start` datetime NOT NULL,
    `current_period_end` datetime NOT NULL,
    `cancel_at_period_end` tinyint(1) NOT NULL DEFAULT 0,
    `version` int(11) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 交易發票表 (用於記錄每次扣款狀態)
CREATE TABLE `tx_invoice` (
    `id` varchar(64) PRIMARY KEY,
    `tenant_id` varchar(64) NOT NULL,
    `customer_id` varchar(64) NOT NULL,
    `subscription_id` varchar(64),
    `amount_due` int(11) NOT NULL,
    `amount_paid` int(11) NOT NULL DEFAULT 0,
    `status` varchar(32) NOT NULL, -- e.g., 'paid', 'open', 'void'
    `payment_intent_id` varchar(64),
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 優惠碼/促銷碼表
CREATE TABLE `core_promo_code` (
    `id` varchar(64) PRIMARY KEY,
    `tenant_id` varchar(64) NOT NULL,
    `code` varchar(64) NOT NULL,
    `discount_type` varchar(20) NOT NULL, -- 'percent' | 'fixed'
    `discount_value` int(11) NOT NULL,
    `max_uses` int(11),
    `used_count` int(11) NOT NULL DEFAULT 0,
    `expires_at` datetime,
    `active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. DML (Data Manipulation Language)

系統在啟動時，若為空資料庫，可使用以下 DML 進行測試帳號與基礎資料的初始化。

### 2.1 初始化開發租戶 (Tenant)
*(目前系統中 `handler.EnsureTenant` 暫時寫死了 `acct_demo_123`)*

```sql
INSERT INTO `account_tenant` 
(`id`, `name`, `gateway_provider`, `status`) 
VALUES 
('acct_demo_123', 'Seeder Demo Merchant', 'mock', 1);
```

### 2.2 初始化測試商品與定價 (選用)
```sql
-- 建立一筆測試商品
INSERT INTO `core_product` 
(`id`, `tenant_id`, `name`, `description`, `active`) 
VALUES 
('prod_demo_001', 'acct_demo_123', '進階創作者方案', '解鎖所有 Premium 限定文章', 1);

-- 建立對應的測試價格 (NT$ 990 / 月)
INSERT INTO `core_price` 
(`id`, `product_id`, `currency`, `unit_amount`, `billing_interval`, `interval_count`, `active`) 
VALUES 
('price_demo_001', 'prod_demo_001', 'TWD', 990, 'month', 1, 1);
```
