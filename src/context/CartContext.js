import React, { createContext, useState } from "react";
export const CartContext = createContext();
const CartProvider = ({ children }) => {
    const cart = JSON.parse(localStorage.getItem("Cart")) || {};
    let total = 0;
    Object.values(cart).forEach((quantity) => {
        total = total + Number(quantity);
    });
    const [cartCount, setCartCount] = useState(total);
    return (
        <CartContext.Provider value={{ cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;