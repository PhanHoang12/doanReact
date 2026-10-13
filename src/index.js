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

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
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
      </Routes>
      </App>
    </Router>
  </React.StrictMode>
);

reportWebVitals();