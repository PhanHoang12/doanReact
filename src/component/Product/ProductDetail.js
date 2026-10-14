import React, { useEffect, useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/API';
import { CartContext } from '../../context/CartContext';
const ProductDetail = () => {
    const params = useParams();
    const[product, setProduct] = useState({});
    const[images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const[quantity, setQuantity] = useState(1);

    const { setCartCount } = useContext(CartContext);
    useEffect(() =>{
        API.get("/product/detail/" + params.id).then(res=>{
            console.log("Chi tiết sản phẩm: ",res.data)
            const data = res.data.data;
            setProduct(data);
            const imageList = Array.isArray(data.image) ? data.image : JSON.parse(data.image)
            setImages(imageList)
            if(imageList.length>0){
                setMainImage(imageList[0]);
            }
        }).catch(error =>{
            console.log("Lỗi lấy sản phẩm chi tiết: ", error)
            if(error.response){
                console.log(error.response.data);
            }
        })
    },[params.id])
    const handleCart = () =>{
        const cart = JSON.parse(localStorage.getItem("Cart")) || {};
        if(cart[product.id]){
            cart[product.id] = cart[product.id]+quantity;
        } else {
            cart[product.id] = quantity;
        }
        localStorage.setItem("Cart", JSON.stringify(cart))
        let total = 0;
        Object.values(cart).forEach((quantity) => {
        total = total + Number(quantity);
        });
        setCartCount(total);

        //  console.log("Cart sau khi lưu:", cart);
        alert("Thêm thành công vào giỏ hàng!")
    } 

    // console.log("ID product:", params.id);

    return (
        <div className="col-sm-9 padding-right">
            <div className="product-details">
                <div className="col-sm-5">
                    <div className="view-product">
                        {mainImage && (
                            <img
                                src={`http://localhost/laravel8/public/upload/product/${product.id_user}/${mainImage}`}
                                alt={product.name}/>
                        )}
                    </div>
                    <div id="similar-product">
                        {images.map((item, index) => (
                            <img
                                key={index}
                                src={`http://localhost/laravel8/public/upload/product/${product.id_user}/${item}`}
                                alt=""
                                width="80"
                                onClick={() =>setMainImage(item)}
                                style={{ marginRight: "10px", cursor:"pointer" }}/>
                        ))}
                    </div>
                </div>
                <div className="col-sm-7">
                    <div className="product-information">
                        <h2>{product.name}</h2>
                        <p>Web ID: {product.web_id}</p>
                        <span>
                            <span>US ${product.price}</span>
                            <label>Quantity:</label>
                            <input
                                type="text"
                                value={quantity}
                                min='1'
                                onChange={(e) => setQuantity(Number(e.target.value))}/>
                            <button
                                type="button"
                                className="btn btn-fefault cart"
                                onClick={handleCart}>
                                <i className="fa fa-shopping-cart"></i>
                                Add to cart
                            </button>
                        </span>
                        <p>
                            <b>Availability:</b> In Stock
                        </p>
                        <p>
                            <b>Condition:</b>{" "}
                            {Number(product.status) === 1 ? "New" : "Sale"}
                        </p>
                        <p>
                            <b>Brand:</b> {product.id_brand}
                        </p>
                        <p>
                            <b>Company:</b> {product.company_profile}
                        </p>
                        <p>
                            <b>Detail:</b> {product.detail}
                        </p>
                        <a href="#">
                            <img
                                src="/images/product-details/share.png"
                                className="share img-responsive"
                                alt=""
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;