import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import your reducers
import userReducer from './redux/auth/userSlice';
import cartReducer from './redux/cart/cartSlice';
import productReducer from './redux/product/productSlice';
// Import other reducers as needed

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        user: userReducer,
        cart: cartReducer,
        product: productReducer,
        // Add other reducers
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Helper for rendering with router only
export function renderWithRouter(ui) {
  function Wrapper({ children }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }
  return render(ui, { wrapper: Wrapper });
}