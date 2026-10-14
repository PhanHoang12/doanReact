import React,{useState, useEffect} from 'react'
import API from '../../api/API'
import { useNavigate, NavLink } from 'react-router-dom';
const Home = () => {
  const[products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() =>{
    API.get("/product").then(res=>{
      console.log('All product: ', res.data);
      const danhSach = Array.isArray(res.data.data) ? res.data.data:Object.values(res.data.data || {});
      setProducts(danhSach);
    }).catch(error =>{
      console.log("Lỗi lấy sản phẩm: ", error);
      if(error.response){
        console.log(error.response.data);
      }
    })
  },[])
  return (
    <div className='col-sm-9 padding-right'>
        <div className='features_item'>
          <h2 className='title text-center'>
            Features item
          </h2>
          {products.map((item) =>{
            const images = Array.isArray(item.image) ? item.image:JSON.parse(item.image)
            const firstImgae = images[0];
            return (
              <div className="col-sm-4" key={item.id}>
                <div className="product-image-wrapper">
                  <div className="single-products">
                    <div className="productinfo text-center">
                      <img src={`http://localhost/laravel8/public/upload/product/${item.id_user}/${firstImgae}`} alt={item.name}/>
                      <h2>${item.price}</h2>
                       <p>{item.name}</p>
                      <a href='#' className="btn btn-default add-to-cart"> <i className="fa fa-shopping-cart"></i>Add to cart</a>
                      {/* <a href="#" className="btn btn-default add-to-cart"  style={{ marginLeft: "5px" }}><i className="fa fa-eye"></i>
												More
											</a> */}
                    </div>
                  <div className="product-overlay">
                    <div className="overlay-content">
                      <h2>${item.price}</h2>
                      <p>{item.name}</p>
                      <a href="#" className="btn btn-default add-to-cart">
                        <i className="fa fa-shopping-cart"></i>
                        Add to cart
                      </a>
                      <NavLink to={`/product/detail/${item.id}`} className="btn btn-default add-to-cart"  style={{ marginLeft: "5px" }}><i className="fa fa-eye"></i>
                        More
                      </NavLink>
                    </div>
                  </div>
                </div>
                   <div className="choose">
                     <ul className="nav nav-pills nav-justified">
                     <li>
                      <a href="#">
                        <i className="fa fa-plus-square"></i>
                        Add to wishlist
                      </a>
                    </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-plus-square"></i>
                                Add to compare
                        </a>
                      </li>
                     </ul>
                   </div>
                  </div>
                </div>
            );
          })}
        </div>
    </div>
  )
}

export default Home
