import React, {useState, createContext } from "react";
export const WishlistContext = createContext();
const WishlishProvider = ({children}) =>{
    const wishList = JSON.parse(localStorage.getItem("Wishlist")) || [];
    const [wishlistCount, setWishlistCount] = useState(wishList.length);

    return (
        <WishlistContext.Provider 
        value={{wishlistCount,setWishlistCount}}>
            {children}
        </WishlistContext.Provider>
    );
};
export default WishlishProvider