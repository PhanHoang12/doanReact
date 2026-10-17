import { createSlice } from "@reduxjs/toolkit";
const cartLocal = JSON.parse(localStorage.getItem("ReduxCart")) || {};
let total = 0 ;
Object.values(cartLocal).forEach((quantity) =>{
     total = total + Number(quantity);
})
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: cartLocal,
        cartCount:total,
    },
    reducers:{
        addToCart(state, action) {
            const id = action.payload;
            if(state.items[id]){
                state.items[id] = state.items[id] + 1;
            } else {
                state.items[id] = 1;
            }
            state.cartCount = state.cartCount + 1 ;
            localStorage.setItem("ReduxCart", JSON.stringify(state.items))
        },
        cong(state,action){
            const id = action.payload;
            if(state.items[id]){
                state.items[id] = state.items[id] + 1;
                state.cartCount = state.cartCount + 1;
            }
            localStorage.setItem("ReduxCart", JSON.stringify(state.items));
        },
        tru(state,action){
            const id = action.payload;
            if(state.items[id]>1){
                state.items[id] = state.items[id] - 1;
                state.cartCount = state.cartCount - 1;
            }
            localStorage.setItem("ReduxCart", JSON.stringify(state.items));
        }
    }
})
export  const {addToCart,cong,tru} = cartSlice.actions;
export default cartSlice.reducer;