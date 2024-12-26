import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItenIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // 复制一份
    const updateItems = [...state.items];
    if (existingCartItenIndex > -1) {
      const existingItem = updateItems[existingCartItenIndex];
      const updateItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updateItems[existingCartItenIndex] = updateItem;
    } else {
      updateItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updateItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItenIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItenIndex];
    const updateItems = [...state.items];

    if (existingItem.quantity === 1) {
      updateItems.splice(existingCartItenIndex, 1);
    } else {
      const updateItem = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      updateItems[existingCartItenIndex] = updateItem;
    }

    return { ...state, items: updateItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
