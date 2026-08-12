import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  selectedAddress: JSON.parse(localStorage.getItem('selectedAddress') || 'null'),
  deliveryMethod: localStorage.getItem('deliveryMethod') || 'STANDARD',

  addToCart: (product, quantity = 1) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item.product._id === product._id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: Math.min(product.stock, quantity) }];
    }

    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  removeFromCart: (productId) => {
    const cart = get().cart;
    const newCart = cart.filter(item => item.product._id !== productId);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  updateQuantity: (productId, quantity) => {
    const cart = get().cart;
    const newCart = cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('cart');
  },

  setSelectedAddress: (address) => {
    set({ selectedAddress: address });
    if (address) {
      localStorage.setItem('selectedAddress', JSON.stringify(address));
    } else {
      localStorage.removeItem('selectedAddress');
    }
  },

  setDeliveryMethod: (method) => {
    set({ deliveryMethod: method });
    localStorage.setItem('deliveryMethod', method);
  },

  getCartTotalWeight: () => {
    return get().cart.reduce((sum, item) => sum + (item.product.weight_kg * item.quantity), 0);
  },

  getCartSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + (item.product.price_coins * item.quantity), 0);
  }
}));
