import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../api/API';
import { cong,tru } from '../../redux/cartSlice';

const Checkout = () => {

    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    const reduxCart = useSelector(
        (state) => state.cart.items
    );

    useEffect(() => {

        API.post("/product/cart", reduxCart)
            .then(res => {
                console.log("Checkout API:", res.data);

                setProducts(res.data.data);
            })
            .catch(error => {
                console.log("Lỗi checkout:", error);

                if (error.response) {
                    console.log(error.response.data);
                }
            });

    }, [reduxCart]);
    let tongCuoi = 0 ;
    products.forEach((item) =>{
        const quantity = reduxCart[item.id] || 0;
        tongCuoi = tongCuoi + (item.price * quantity);
    })

    return (
        <div className="col-sm-12">
            <div className="breadcrumbs">
                <ol className="breadcrumb">
                    <li>
                        <a href="/">Home</a>
                    </li>

                    <li className="active">
                        Check out
                    </li>
                </ol>
            </div>
            <div className="step-one">
				<h2 className="heading">Step1</h2>
			</div>
            <div className="checkout-options">
				<h3>New User</h3>
				<p>Checkout options</p>
				<ul className="nav">
					<li>
						<label><input type="checkbox"/> Register Account</label>
					</li>
					<li>
						<label><input type="checkbox"/> Guest Checkout</label>
					</li>
					<li>
						<a href=""><i className="fa fa-times"></i>Cancel</a>
					</li>
				</ul>
			</div>
            <div className="register-req">
				<p>Please use Register And Checkout to easily get access to your order history, or use Checkout as Guest</p>
			</div>
            <div className="shopper-informations">
				<div className="row">
					<div className="col-sm-3">
						<div className="shopper-info">
							<p>Shopper Information</p>
							<form>
								<input type="text" placeholder="Display Name"/>
								<input type="text" placeholder="User Name"/>
								<input type="password" placeholder="Password"/>
								<input type="password" placeholder="Confirm password"/>
							</form>
							<a className="btn btn-primary" href="">Get Quotes</a>
							<a className="btn btn-primary" href="">Continue</a>
						</div>
					</div>
					<div className="col-sm-5 clearfix">
						<div className="bill-to">
							<p>Bill To</p>
							<div className="form-one">
								<form>
									<input type="text" placeholder="Company Name"/>
									<input type="text" placeholder="Email*"/>
									<input type="text" placeholder="Title"/>
									<input type="text" placeholder="First Name *"/>
									<input type="text" placeholder="Middle Name"/>
									<input type="text" placeholder="Last Name *"/>
									<input type="text" placeholder="Address 1 *"/>
									<input type="text" placeholder="Address 2"/>
								</form>
							</div>
							<div className="form-two">
								<form>
									<input type="text" placeholder="Zip / Postal Code *"/>
									<select>
										<option>-- Country --</option>
										<option>United States</option>
										<option>Bangladesh</option>
										<option>UK</option>
										<option>India</option>
										<option>Pakistan</option>
										<option>Ucrane</option>
										<option>Canada</option>
										<option>Dubai</option>
									</select>
									<select>
										<option>-- State / Province / Region --</option>
										<option>United States</option>
										<option>Bangladesh</option>
										<option>UK</option>
										<option>India</option>
										<option>Pakistan</option>
										<option>Ucrane</option>
										<option>Canada</option>
										<option>Dubai</option>
									</select>
									<input type="password" placeholder="Confirm password"/>
									<input type="text" placeholder="Phone *"/>
									<input type="text" placeholder="Mobile Phone"/>
									<input type="text" placeholder="Fax"/>
								</form>
							</div>
						</div>
					</div>
					<div className="col-sm-4">
						<div className="order-message">
							<p>Shipping Order</p>
							<textarea name="message"  placeholder="Notes about your order, Special Notes for Delivery" rows="16"></textarea>
							<label><input type="checkbox"/> Shipping to bill address</label>
						</div>	
					</div>					
				</div>
			</div>

            <div className="review-payment">
                <h2>Review & Payment</h2>
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
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => {
                            const quantity =
                                reduxCart[item.id] || 0;
                            const images =
                                Array.isArray(item.image)
                                    ? item.image
                                    : JSON.parse(item.image);
                            const firstImage = images[0];
                            return (
                                <tr key={item.id}>
                                    <td className="cart_product">
                                        <img
                                            src={`http://localhost/laravel8/public/upload/product/${item.id_user}/${firstImage}`}
                                            alt={item.name}
                                            width="100"
                                        />
                                    </td>
                                    <td className="cart_description">
                                        <h4>{item.name}</h4>
                                        <p>
                                            Web ID: {item.web_id}
                                        </p>
                                    </td>
                                    <td className="cart_price">
                                        <p>${item.price}</p>
                                    </td>
                                    <td className="cart_quantity">
                                        <div className="cart_quantity_button">
                                            <a
                                                className="cart_quantity_up"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    dispatch(cong(item.id));
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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    dispatch(tru(item.id));
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
                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan="4">&nbsp;</td>
                             <td colSpan="2">
                                <table className="table table-condensed total-result">
                                    <tbody>
                                         <tr>
                                            <td>Cart Sub Total</td>
                                            <td>${tongCuoi}</td>
                                        </tr>

                                        <tr>
                                            <td>Exo Tax</td>
                                            <td>$2</td>
                                        </tr>

                                        <tr className="shipping-cost">
                                            <td>Shipping Cost</td>
                                            <td>Free</td>
                                        </tr>

                                        <tr>
                                            <td>Total</td>
                                            <td>
                                                <span>${tongCuoi + 2}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                             </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="payment-options">
					<span>
						<label><input type="checkbox"/> Direct Bank Transfer</label>
					</span>
					<span>
						<label><input type="checkbox"/> Check Payment</label>
					</span>
					<span>
						<label><input type="checkbox"/> Paypal</label>
					</span>
				</div>
        </div>
    );
};
export default Checkout;