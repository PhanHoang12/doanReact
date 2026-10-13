import React,{useState,useEffect} from 'react'
import API from '../../api/API'
import MemberLeft from '../member/MemberLeft';
import { NavLink } from 'react-router-dom';
const MyProduct = () => {
    const[products, setProducts] = useState([]);
    const auth = JSON.parse(localStorage.getItem("auth"))
    useEffect(()=>{
      const token = localStorage.getItem("token")
        // console.log("User login is:",auth)
        const config = {
          headers:{
            Authorization: "Bearer " + token,
            Accept: "application/json"
          }
        };
        API.get("/user/my-product", config).then(res=>{
          console.log("Sản phẩm:" ,res.data);
          setProducts(Object.values(res.data.data))
        }).catch(error =>{
          console.log("Lỗi lấy product:", error)
          if(error.response){
            console.log(error.response.data)
          }
        })
    },[])
  return (
    <>
    <MemberLeft/>
    <div className='col-sm-9'>
      <h2>My Product</h2>
       <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((item) => {
                    const images = JSON.parse(item.image);
                    const firstImage = images[0];
                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>
                                  <img src={`http://localhost/laravel8/public/upload/product/${auth.id}/${firstImage}`}
                                      alt={item.name}
                                      width="80"/>
                                </td>
                                <td>{item.price}</td>
                                <td>
                                  <a href="#" className="btn btn-link">
                                      <i className="fa fa-edit"></i>
                                  </a>
                                  <a href="#" className="btn btn-link">
                                      <i className="fa fa-times"></i>
                                  </a>
                              </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="text-right">
              <NavLink
                  to="/user/product/add"
                  className="btn btn-primary">
                  Add New
              </NavLink>
          </div>
    </div>
    </>
  )
}

export default MyProduct
