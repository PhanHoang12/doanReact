import React, {useEffect,useState,useContext} from 'react'
import API from '../../api/API'
import { WishlistContext } from '../../context/WishlistContext'
const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const{setWishlistCount} = useContext(WishlistContext)
    useEffect(() =>{
        API.get("/product").then(res =>{
            const danhSach = Array.isArray(res.data.data) ? res.data.data : Object.values(res.data.data || {});
            const wishlist = JSON.parse(localStorage.getItem("Wishlist")) ||[];
            const productWishlist = danhSach.filter((item) =>{
                return wishlist.includes(item.id);
            });
            setProducts(productWishlist);
        }).catch(error =>{
            console.log("Lỗi lấy wishList:", error);
            if(error.response){
                return (error.response.data);
            }
        })
    },[]);
    const handleDeleteWishlist = (id) =>{
        const wishlist = JSON.parse(localStorage.getItem("Wishlist")) || [];
        const newWishlist = wishlist.filter((item) =>{
            return item !== id;
        })
        localStorage.setItem("Wishlist", JSON.stringify(newWishlist));
        setProducts( products.filter((item) => item.id !== id))
        setWishlistCount(newWishlist.length);

    };
  return (
    <div className="col-sm-9 padding-right">
        <div className="features_items">
            <h2 className="title text-center">Wishlist</h2>
              {products.map((item) => {
                const images = Array.isArray(item.image) ?item.image: JSON.parse(item.image);
                const firstImage = images[0];
                return (
                      <div className="col-sm-4" key={item.id}>
                        <div className="product-image-wrapper">
                             <div className="single-products">
                                <div className="productinfo text-center">
                                    <img src={`http://localhost/laravel8/public/upload/product/${item.id_user}/${firstImage}`}
                                    alt={item.name}/>
                                    <h2>${item.price}</h2>
                                    <p>{item.name}</p>
                                     <button
                                            type="button"
                                            className="btn btn-default add-to-cart"
                                            onClick={() => handleDeleteWishlist(item.id)}> <i className="fa fa-times"></i>
                                            Delete Wishlist</button>

                                </div>
                             </div>
                        </div>
                      </div>
                );

              })}
        </div>
    </div>
  )
}

export default Wishlist
