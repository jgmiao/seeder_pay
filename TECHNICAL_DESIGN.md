# Seeder Pay

## 1. 需求与核心业务概述
Seeder Pay 是一个面向未来的订阅制和数字商品管理平台。系统主要致力于解决创作者和商家的痛点：提供高转化的极简结账体验、灵活的周期性计费（Subscription）方案管理、以及顾客/订单的统一跟踪面板。平台核心功能包括商品管理、周期计费方案设置、安全结账链接生成以及顾客管理。

## 2. 系统整体架构

系统采用了典型的前后端分离（Client-Server）及 Monorepo 目录管理结构，确保前后端能够独立迭代、灵活部署。

- **Frontend (表现层):** 基于 Next.js 构建的 SPA 应用，结合服务端渲染 (SSR) 与静态生成 (SSG) 提升首屏加载速度与 SEO 效果。
- **Backend (API 服务层):** 使用 Golang (Gin 框架) 开发的 RESTful API 服务，保障高并发处理能力与极低的内存开销。
- **Database (数据存储持久层):** 本地开发环境与极早期版本使用 SQLite，借助 Gorm ORM 抽象层，为后期一键迁移至 PostgreSQL 或 MySQL 等生产级关系型数据库做好准备。

## 3. 核心模块与技术栈设计

### 3.1 前端应用 (`/frontend`)
- **核心框架:** Next.js (App Router 模式), React 19。
- **样式与设计系统:** Tailwind CSS v4, shadcn/ui。保障极简、现代、高质感（如毛玻璃、微动效）的界面风格。
- **状态请求:** `axios` 用于向 API 发出请求。
- **架构划分:**
  - `src/app/dashboard/*`: 商户后台控制面板（商品配置、用户数据展示）。
  - `src/app/checkout/[id]`: 面向顾客的独立 C 端跨屏高转化结账界面。
  - `src/components/*`: 可高度复用的基础视图组件与 Layout。

### 3.2 后端应用 (`/backend`)
后端在代码组织上严格遵循领域驱动设计 (DDD) 以及洋葱架构 (Clean Architecture) 原则，保障核心业务逻辑不被框架及第三方库污染。
- **目录结构与分层:**
  - `/core/domain`: 核心领域层。定义业务模型 (`model`，如 Product, Customer) 及纯业务逻辑 (`service`)。
  - `/core/port`: 端口定义层。定义依赖接口（如数据仓储接口、支付网关对冲接口），实现依赖倒置 (DIP)。
  - `/api/handler`: 表示/接入层。基于 Gin 框架在此接收 HTTP 请求，完成参数校验与路由，并调用内部核心领域的 service 逻辑。
  - `/db`: 基础设施层（Adapter）。基于 Gorm 实现 `/core/port` 中的 Repository 接口，在此封装与 SQLite 数据库的最终交互操作 (\`repositories.go\`)。

## 4. 关键数据流向与交互模型

1. **客户端动作触发:** 用户（商家或顾客）在 Next.js 页面触发交互（如：创建了一个 "包月会员" 的计费方案）。
2. **API 请求发送:** 前端经校验后，携带着 Payload 向后端暴露的 RESTful 接口发送跨域请求（例如 `POST /api/products`）。
3. **路由解析与校验:** Go 语言后端的 `main.go` 进行路由分发，交给指定的 Handler (如 `rest.go`) 进行结构体反序列化与鉴权拦截。
4. **领域逻辑执行:** Handler 提取参数，抛给 `productService.go` 进而处理诸如价格校验、间隔周期 (`billing_interval`) 等内部规则。
5. **持久化:** Service 完备逻辑后，调用注入的 DB Repository 保存变动至 SQLite `seeder_local.db`。
6. **响应封装:** 后端以标准 JSON 结构响应成功与回显数据，前端执行状态清空及路由预加载。

## 5. 健壮性与未来扩展性考量

- **事务安全与幂等控制:** 涉及金钱计算的结账接口及回调需保障接口幂等性。
- **无状态化扩展:** API 后端完全无状态化（Stateless），在面临流量洪峰时可以通过容器化（Docker/k8s）手段快速横向扩展 (Scale-out)。
- **外部集成解耦:** 在 `port` 中定义了各类第三方（Gateway、Email 投递）接口，将来可无缝接入 Stripe, 绿界 (ECPay) 或 TapPay 等真实金流提供商，不影响主干业务代码。
