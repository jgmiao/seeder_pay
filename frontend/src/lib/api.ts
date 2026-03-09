import axios from 'axios';

const BASE = 'http://localhost:8080/api/v1';

export const api = axios.create({
    baseURL: BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_demo_123',
    },
});

// ==================== Types ====================

export interface Product {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    active: number;
    created_at: string;
    updated_at: string;
}

export interface Price {
    id: string;
    product_id: string;
    currency: string;
    unit_amount: number;
    billing_interval: string; // 'month' | 'year' | ''
    interval_count: number;
    active: number;
    created_at: string;
}

export interface Customer {
    id: string;
    tenant_id: string;
    email: string;
    name: string;
    default_payment_method_id: string;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: string;
    tenant_id: string;
    customer_id: string;
    price_id: string;
    status: string; // 'active' | 'canceled' | 'past_due'
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: number;
    version: number;
    created_at: string;
    updated_at: string;
}

export interface Invoice {
    id: string;
    tenant_id: string;
    customer_id: string;
    subscription_id: string;
    amount_due: number;
    amount_paid: number;
    status: string; // 'paid' | 'open' | 'void'
    payment_intent_id: string;
    created_at: string;
}

export interface StatsOverview {
    total_revenue: number;
    active_subscribers: number;
    total_customers: number;
    total_orders: number;
    mrr: number;
    pending_invoices: number;
}

export interface PromoCode {
    id: string;
    tenant_id: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    max_uses: number | null;
    used_count: number;
    expires_at: string | null;
    active: number;
    created_at: string;
}

// ==================== Products API ====================
// ... (rest of the code)
export const promoCodesApi = {
    list: () => api.get<{ data: PromoCode[] }>('/promo-codes').then(r => r.data.data || []),
    create: (data: {
        code: string;
        discount_type: string;
        discount_value: number;
        max_uses?: number | null;
        expires_at?: string | null;
    }) => api.post<PromoCode>('/promo-codes', data).then(r => r.data),
    delete: (id: string) => api.delete(`/promo-codes/${id}`).then(r => r.data),
    toggle: (id: string, active: boolean) => api.patch(`/promo-codes/${id}/active`, { active }).then(r => r.data),
};

export const productsApi = {
    list: () => api.get<{ data: Product[] }>('/products').then(r => r.data.data || []),
    get: (id: string) => api.get<Product>(`/products/${id}`).then(r => r.data),
    create: (data: { name: string; description?: string }) =>
        api.post<Product>('/products', data).then(r => r.data),
    update: (id: string, data: { name: string; description?: string }) =>
        api.put<Product>(`/products/${id}`, data).then(r => r.data),
    archive: (id: string) =>
        api.delete(`/products/${id}`).then(r => r.data),
    listPrices: (productId: string) =>
        api.get<{ data: Price[] }>(`/products/${productId}/prices`).then(r => r.data.data || []),
    createPrice: (data: {
        product_id: string;
        unit_amount: number;
        billing_interval?: string;
        interval_count?: number;
        currency?: string;
    }) => api.post<Price>('/prices', data).then(r => r.data),
};

// ==================== Customers API ====================

export const customersApi = {
    list: () => api.get<{ data: Customer[] }>('/customers').then(r => r.data.data || []),
    get: (id: string) => api.get<Customer>(`/customers/${id}`).then(r => r.data),
    create: (data: { email: string; name?: string }) =>
        api.post<Customer>('/customers', data).then(r => r.data),
    update: (id: string, data: { email: string; name?: string }) =>
        api.put<Customer>(`/customers/${id}`, data).then(r => r.data),
    delete: (id: string) =>
        api.delete(`/customers/${id}`).then(r => r.data),
};

// ==================== Subscriptions API ====================

export const subscriptionsApi = {
    list: () => api.get<{ data: Subscription[] }>('/subscriptions').then(r => r.data.data || []),
    get: (id: string) => api.get<Subscription>(`/subscriptions/${id}`).then(r => r.data),
    create: (data: { customer_id: string; price_id: string; token: string }) =>
        api.post<Subscription>('/subscriptions', data).then(r => r.data),
    cancel: (id: string, immediate = false) =>
        api.put<Subscription>(`/subscriptions/${id}/cancel`, { immediate }).then(r => r.data),
};

// ==================== Invoices API ====================

export const invoicesApi = {
    list: () => api.get<{ data: Invoice[] }>('/invoices').then(r => r.data.data || []),
    get: (id: string) => api.get<Invoice>(`/invoices/${id}`).then(r => r.data),
};

// ==================== Stats API ====================

export const statsApi = {
    overview: () => api.get<StatsOverview>('/stats/overview').then(r => r.data),
};

// ==================== Helpers ====================

export function formatCurrency(amount: number, currency = 'TWD') {
    return `NT$ ${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function billingIntervalLabel(interval: string, count = 1) {
    if (!interval) return '一次性';
    if (interval === 'month') return count === 1 ? '月繳' : `每 ${count} 月`;
    if (interval === 'year') return count === 1 ? '年繳' : `每 ${count} 年`;
    return interval;
}

export function subscriptionStatusLabel(status: string, cancelAtEnd: number) {
    if (cancelAtEnd === 1 && status === 'active') return '即將取消';
    switch (status) {
        case 'active': return '使用中';
        case 'canceled': return '已取消';
        case 'past_due': return '逾期';
        default: return status;
    }
}
