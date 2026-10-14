import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import Blog from './component/Blog/Blog';
import BlogDetail from './component/Blog/BlogDetail';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Member from './component/member';
import Home from './component/Home/Home';
import Account from './component/member/Account';
import MyProduct from './component/Product/MyProduct';
import AddProduct from './component/Product/AddProduct';
import EditProduct from './component/Product/EditProduct ';
import ProductDetail from './component/Product/ProductDetail';
import Cart from './component/Product/Cart';
import CartProvider from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <CartProvider>
      <App>
      <Routes>
        {/* <Route index path="/" element={<}/> */}
        <Route path='/' element={<Home/>}/>
        <Route path="/blog" element={<Blog />}/>
        <Route path="/blog/detail/:id" element={<BlogDetail />}/>
        <Route path="/member/login-register" element={<Member/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/my-product' element={<MyProduct/>}/>
        <Route path='/user/product/add' element={<AddProduct/>}/>
        <Route path='/user/product/edit/:id' element={<EditProduct/>}/>
        <Route path='/product/detail/:id' element={<ProductDetail/>}/>
        <Route path='/product/cart' element={<Cart/>}/>
      </Routes>
      </App>
      </CartProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();