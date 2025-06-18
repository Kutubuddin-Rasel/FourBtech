import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Helper to get a cookie
const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

api.interceptors.request.use((config) => {
  const token = getCookie('token'); // Get token from cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  getStats: () => api.get('/admin/stats').then(res => res.data),
  getUsers: () => api.get('/users').then(res => res.data),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`).then(res => res.data),
};

export const sellerApi = {
  getStats: () => api.get('/seller/stats').then(res => res.data),
  getOrders: () => api.get('/seller/orders').then(res => res.data),
  getOrderDetails: (orderId: string) => api.get(`/seller/orders/${orderId}`).then(res => res.data),
};

export const customerApi = {
  getStats: () => api.get('/customer/stats').then(res => res.data),
  getRecentActivity: () => api.get('/customer/recent-activity').then(res => res.data),
  getOrders: () => api.get('/customer/orders').then(res => res.data),
  getWishlists: () => api.get('/customer/wishlists').then(res => res.data),
  // Cart methods
  getCart: () => api.get('/cart').then(res => res.data),
  addToCart: (productId: number, quantity: number) => api.post('/cart', { productId, quantity }).then(res => res.data),
  updateCartItem: (cartItemId: string, quantity: number) => api.patch(`/cart/${cartItemId}`, { quantity }).then(res => res.data),
  removeFromCart: (cartItemId: string) => api.delete(`/cart/${cartItemId}`).then(res => res.data),
  clearCart: () => api.delete('/cart').then(res => res.data),
  // Address methods (assuming RESTful endpoints)
  getAddresses: () => api.get('/customer/addresses').then(res => res.data),
  addAddress: (address: any) => api.post('/customer/addresses', address).then(res => res.data),
  updateAddress: (id: string, address: any) => api.patch(`/customer/addresses/${id}`, address).then(res => res.data),
  deleteAddress: (id: string) => api.delete(`/customer/addresses/${id}`).then(res => res.data),
  // Order methods
  placeOrder: (order: { shippingAddress: string, paymentMethod: string }) => api.post('/orders', order).then(res => res.data),
};

export default api; 