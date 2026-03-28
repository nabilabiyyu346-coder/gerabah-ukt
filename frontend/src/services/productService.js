import apiClient from './api'

// Products API Service
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products')
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error)
      throw error
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      console.error(`Error updating product ${id}:`, error)
      throw error
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error)
      throw error
    }
  }
}

export default productService
