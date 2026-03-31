import { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  // Generate cart storage key based on user ID
  const getCartKey = (userId) => {
    return userId ? `cartItems_${userId}` : 'cartItems_guest'
  }

  // Load cart from localStorage when user changes
  useEffect(() => {
    const cartKey = getCartKey(user?.id)
    const saved = localStorage.getItem(cartKey)
    
    console.log(`[Cart] Loading cart for user: ${user?.id || 'guest'}`, {
      cartKey,
      itemsCount: saved ? JSON.parse(saved).length : 0
    })
    
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (err) {
        console.error('Error parsing cart:', err)
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [user?.id])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    const cartKey = getCartKey(user?.id)
    console.log(`[Cart] Saving cart for user: ${user?.id || 'guest'}`, {
      cartKey,
      itemsCount: items.length
    })
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items, user?.id])

  const addToCart = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
