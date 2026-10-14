import React,{useState,useEffect,useContext} from 'react'
import API from '../../api/API'
import { CartContext } from '../../context/CartContext';
const Cart = () => {
    const { setCartCount } = useContext(CartContext);
    const[products,setProducts] = useState([]);
    useEffect(() =>{
        const cart = JSON.parse(localStorage.getItem("Cart")) || {};
        console.log("Cart:", cart)
        API.post("/product/cart",cart).then(res=>{
            console.log("Cart API:", res.data);
            setProducts(res.data.data);
        }).catch(error =>{
            console.log("Lỗi lấy cart!",error);
            if(error.response){
                console.log(error.response.data);
            }
        });
    },[]);
    const handleQuantity = (id,type) =>{
        const cart = JSON.parse(localStorage.getItem("Cart")) || {};
        if(type === "cong"){
            cart[id] = cart[id] +1
        } 
        if(type ==="tru"){
            if(cart[id] > 1){
                cart[id] = cart[id] -1;
            }
        }
        if(type==="xoa"){
            const xn = window.confirm("bạn có chắc muốn xóa sản phẩm này không?");
            if(!xn){
                return;
            }

            delete cart[id];
            // dùng lọc để lọc bỏ id bấm xóa ra khỏi bảng ví dụ xóa id =2; thì 2!==1 true giữ lại, 2!==2 sai nên bỏ đi..
            setProducts(products.filter((item) => item.id !== id))
        } else {
            setProducts([...products]);
        }

        localStorage.setItem("Cart", JSON.stringify(cart));


        let totalQuantity = 0;
        Object.values(cart).forEach((quantity) => {
        totalQuantity = totalQuantity + Number(quantity);
        
    });
        setCartCount(totalQuantity);

    }
    let tongCuoi = 0;
    products.forEach((item) =>{
        const cart = JSON.parse(localStorage.getItem("Cart"))||{};
        const quantity = cart[item.id] || 0;
        tongCuoi = tongCuoi + (item.price * quantity);
    })
    return (
           <section id="cart_items">
            <div className="container">
                <div className="breadcrumbs">
                    <ol className="breadcrumb">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li className="active">
                            Shopping Cart
                        </li>
                    </ol>
                </div>
                <div className="table-responsive cart_info">
                    <table className="table table-condensed">
                        <thead>
                            <tr className="cart_menu">
                                <td className="image">Item</td>
                                <td className="description"></td>
                                <td className="price">Price</td>
                                <td className="quantity">Quantity</td>
                                <td className="total">Total</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => {
                                const cart = JSON.parse(localStorage.getItem("Cart")) || {};
                                const quantity = cart[item.id] || 0;
                                const images = Array.isArray(item.image)
                                    ? item.image
                                    : JSON.parse(item.image);
                                const firstImage = images[0];
                                return (
                                    <tr key={item.id}>
                                        <td className="cart_product">
                                            <a href="#">
                                                <img
                                                    src={`http://localhost/laravel8/public/upload/product/${item.id_user}/${firstImage}`}
                                                    alt={item.name}
                                                    width="100"/>
                                            </a>
                                        </td>
                                        <td className="cart_description">
                                            <h4>
                                                <a href="#">
                                                    {item.name}
                                                </a>
                                            </h4>
                                            <p>
                                                Web ID: {item.web_id}
                                            </p>
                                        </td>
                                        <td className="cart_price">
                                            <p>
                                                ${item.price}
                                            </p>
                                        </td>
                                        <td className="cart_quantity">
                                            <div className="cart_quantity_button">
                                                <a
                                                    className="cart_quantity_up"
                                                    href="#"
                                                    onClick={(e) =>{
                                                        e.preventDefault();
                                                        handleQuantity(item.id, "cong")
                                                    }}>
                                                    +
                                                </a>
                                                <input
                                                    className="cart_quantity_input"
                                                    type="text"
                                                    value={quantity}
                                                    readOnly
                                                    size="2"/>
                                                <a
                                                    className="cart_quantity_down"
                                                    href="#"
                                                     onClick={(e) =>{
                                                        e.preventDefault();
                                                        handleQuantity(item.id, "tru")
                                                    }}>
                                                    -
                                                </a>
                                            </div>
                                        </td>
                                        <td className="cart_total">
                                            <p className="cart_total_price">
                                                ${item.price * quantity}
                                            </p>
                                        </td>
                                        <td className="cart_delete">
                                            <a
                                                className="cart_quantity_delete"
                                                href="#"
                                                onClick={(e) =>{
                                                    e.preventDefault();
                                                    handleQuantity(item.id,"xoa")
                                                }}>
                                                <i className="fa fa-times"></i>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                    <section id='do_action'>
                        <div className='container'>
                            <div className='row'>
                                <div className="col-sm-6 col-sm-offset-6">
                                    <div className="total_area">
                                        <ul>
                                            <li>Cart sub total <span>${tongCuoi}</span></li>
                                            <li>Eco Tax <span>$2</span></li>
                                            <li>Shipping Cost <span>Free</span></li>
                                            <li>Total <span>{tongCuoi}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            </div>
        </section>
        );
    };

export default Cart
