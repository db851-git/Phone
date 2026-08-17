"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "phonepro-cart-v1";

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case "remove":
      return state.filter((i) => i.id !== action.id);
    case "setQty":
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i))
        .filter((i) => i.qty > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {}
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      add: (product) => dispatch({ type: "add", product }),
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
