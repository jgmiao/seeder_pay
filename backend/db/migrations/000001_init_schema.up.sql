SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 商家租户表 (Tenant)
-- ----------------------------
CREATE TABLE `account_tenant` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, acct_xxx',
  `name` varchar(128) NOT NULL COMMENT '商家名称',
  `gateway_provider` varchar(32) NOT NULL DEFAULT 'mock' COMMENT '金流服务商: mock, payuni, 91app',
  `gateway_config` text COMMENT '金流配置JSON (加密存储)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1-有效, 0-停用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='商家租户表';

-- ----------------------------
-- 2. 顾客表 (Customer)
-- ----------------------------
CREATE TABLE `core_customer` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, cus_xxx',
  `tenant_id` varchar(64) NOT NULL COMMENT '隔离租户(商家)ID',
  `email` varchar(128) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `default_payment_method_id` varchar(64) DEFAULT NULL COMMENT '默认支付方式ID(绑卡标识)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_email` (`tenant_id`, `email`)
) ENGINE=InnoDB COMMENT='顾客信息表';

-- ----------------------------
-- 3. 商品与方案表 (Product & Price)
-- ----------------------------
CREATE TABLE `core_product` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, prod_xxx',
  `tenant_id` varchar(64) NOT NULL COMMENT '隔离租户',
  `name` varchar(128) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '描述',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否上架',
  PRIMARY KEY (`id`),
  KEY `idx_tenant` (`tenant_id`)
) ENGINE=InnoDB COMMENT='商品定义表';

CREATE TABLE `core_price` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, price_xxx',
  `product_id` varchar(64) NOT NULL COMMENT '关联商品ID',
  `currency` varchar(3) NOT NULL DEFAULT 'TWD' COMMENT '币种',
  `unit_amount` int(11) NOT NULL COMMENT '金额(单位:分或元)',
  `billing_interval` varchar(20) DEFAULT NULL COMMENT '计费周期: month, year (若为空则是单次购买)',
  `interval_count` int(11) NOT NULL DEFAULT '1' COMMENT '周期乘数，如 3 month 为一季',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB COMMENT='价格方案表';

-- ----------------------------
-- 4. 订阅层状态机表 (Subscription)
-- ----------------------------
CREATE TABLE `core_subscription` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, sub_xxx',
  `tenant_id` varchar(64) NOT NULL COMMENT '隔离租户ID',
  `customer_id` varchar(64) NOT NULL,
  `price_id` varchar(64) NOT NULL,
  `status` varchar(32) NOT NULL COMMENT '状态: incomplete, active, past_due, canceled',
  `current_period_start` datetime NOT NULL COMMENT '当前计费周期起始',
  `current_period_end` datetime NOT NULL COMMENT '当前计费周期结束',
  `cancel_at_period_end` tinyint(1) NOT NULL DEFAULT '0' COMMENT '若为1，则在当前周期结束后自动变更为canceled',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '乐观锁控制',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_status_end` (`status`, `current_period_end`) -- 用于调度器快速捞取到期续约数据
) ENGINE=InnoDB COMMENT='订阅状态机表';

-- ----------------------------
-- 5. 账单明细流水表 (Invoice & Payment)
-- ----------------------------
CREATE TABLE `tx_invoice` (
  `id` varchar(64) NOT NULL COMMENT '主键ID, in_xxx',
  `tenant_id` varchar(64) NOT NULL,
  `customer_id` varchar(64) NOT NULL,
  `subscription_id` varchar(64) DEFAULT NULL COMMENT '可为空，表示单次购买',
  `amount_due` int(11) NOT NULL,
  `amount_paid` int(11) NOT NULL DEFAULT '0',
  `status` varchar(32) NOT NULL COMMENT 'draft, open, paid, uncollectible, void',
  `payment_intent_id` varchar(64) DEFAULT NULL COMMENT '底层支付单流水ID (对应 payment_intent 表)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subscription` (`subscription_id`)
) ENGINE=InnoDB COMMENT='账单应收明细表';
