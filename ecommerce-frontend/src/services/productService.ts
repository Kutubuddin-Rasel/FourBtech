import api from './api';

export const productService = {
  createProduct: async (productData: any) => {
    try {
      const response = await api.post('/seller/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      const response = await api.get('/seller/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await api.get(`/seller/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      const response = await api.patch(`/seller/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/seller/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },
}; 