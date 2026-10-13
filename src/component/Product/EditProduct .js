import React, {useState, useEffect} from 'react'
import { useParams,useNavigate  } from 'react-router-dom'
import MemberLeft from '../member/MemberLeft';
import API from '../../api/API';
const EditProduct  = () => {
    const params = useParams();
    const navigate = useNavigate();
    const auth = JSON.parse(localStorage.getItem("auth"))
    // console.log("ID product cần edit là:", params.id);
    // const[product, setProduct] = useState({});
    const[inputs, setInputs] = useState({
        name: "",
        price: "",
        category: "",
        brand: "",
        status: 1,
        sale: 0,
        company: "",
        detail: ""
    });
    const[oldImages,setOldImages] = useState([]);
    const[categories, setCategories] = useState([]);
    const[brands, setBrands] = useState([]);
    const[avatarCheckbox, setAvatarCheckbox] = useState([]);
    const[newImages, setNewImages] = useState([]);
    const[errors, setErrors] = useState({});
    useEffect(()=>{
        const token = localStorage.getItem("token")
        const config = {
            headers:{
                Authorization: "Bearer "+token,
                Accept: "application/json",
            }
        }
        API.get("/user/product/" + params.id, config).then(res=>{
            console.log("Product edit: ", res.data);
            // setProduct(res.data.data)
            const product = res.data.data;
            setInputs({
                name: product.name,
                price: product.price,
                category: product.id_category,
                brand: product.id_brand,
                status: product.status,
                sale: product.sale,
                company: product.company_profile,
                detail: product.detail
            });
            setOldImages(product.image);
        }).catch(error =>{
            console.log("Lỗi lấy sản phẩm edit:", error);
            if(error.response){
                console.log(error.response.data);
            }
        })
        API.get("/category-brand").then(res=>{
            setCategories(res.data.category);
            setBrands(res.data.brand);
        }).catch(error =>{
            console.log("lỗi không lấy được category và brand", error)
        })
    },[params.id]);
//     useEffect(() => {
//     console.log("Ảnh chọn xóa:", avatarCheckbox);
// }, [avatarCheckbox]);
    function renderError() {
        if (Object.keys(errors).length > 0) {
            return Object.keys(errors).map((key, index) => {
                return (
                    <li key={index}>
                        {errors[key]}
                    </li>
                );
            });
        }
    }
    const handleInput = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        if(name ==="status"){
            if(value==="1"){
                setInputs({...inputs,status:value,sale:0})
            } else{
                setInputs({...inputs,status:value,sale:""})
            }
        } else {
        setInputs({...inputs, [name]: value});
        };
    };
    const handleCheckImage = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setAvatarCheckbox([...avatarCheckbox, value]);
        } else {
            setAvatarCheckbox(avatarCheckbox.filter(item => item!==value));
        }
    }
    const handleImage = (e) =>{
        const files = Array.from(e.target.files);
        const allowType = ["png", "jpg", "jpeg"];
        for(let i=0; i<files.length; i++){
            const fileType = files[i].name.split(".").pop().toLowerCase()
            if(!allowType.includes(fileType)){
                setErrors({...errors,images:"Hình chỉ được có định dạng png, jpg,jpeg"});
                return;
            }
            if(files[i].size >1024*1024){
                setErrors({...errors, images:"Hình phải có dung lượng nhỏ hơn 1MB"});
                return;
            }
        }
        const soAnhConLai = oldImages.length - avatarCheckbox.length;
        const tongAnh = soAnhConLai+files.length;
        if(tongAnh>3){
            setErrors({...errors, images:"Chỉ được up tối đa 3 ảnh!"})
            return;
        }
        setErrors({...errors, images:""})
        setNewImages(files);
        console.log("ảnh mới:", files);
        console.log("Ảnh cũ còn lại: ", soAnhConLai);
        console.log("Tổng ảnh", tongAnh)
    }
   const handleSubmit = (e) => {
        e.preventDefault();
        let flag = true;
        let errorSubmit = {};
        if (inputs.name === "") {
            errorSubmit.name = "Vui lòng nhập tên sản phẩm!";
            flag = false;
        }
        if (inputs.price === "") {
            errorSubmit.price = "Vui lòng nhập giá!";
            flag = false;
        }
        if (inputs.category === "") {
            errorSubmit.category = "Vui lòng chọn category!";
            flag = false;
        }
        if (inputs.brand === "") {
            errorSubmit.brand = "Vui lòng chọn brand!";
            flag = false;
        }
        if (inputs.company === "") {
            errorSubmit.company = "Vui lòng nhập company!";
            flag = false;
        }
        if (inputs.detail === "") {
            errorSubmit.detail = "Vui lòng nhập detail!";
            flag = false;
        }
        // Edit bắt buộc phải upload ảnh mới
        if (newImages.length === 0) {
            errorSubmit.images = "Vui lòng chọn hình ảnh upload!";
            flag = false;
        }
        // kiểm tra tổng ảnh cuối cùng
        const soAnhConLai = oldImages.length - avatarCheckbox.length;
        const tongAnh = soAnhConLai + newImages.length;
        if (tongAnh > 3) {
            errorSubmit.images = "Tổng hình ảnh sau khi update không được quá 3!";
            flag = false;
        }
        if (!flag) {
            setErrors(errorSubmit);
            return;
        }
        setErrors({});
        const formData = new FormData();
        formData.append("name", inputs.name);
        formData.append("price", inputs.price);
        formData.append("category", inputs.category);
        formData.append("brand", inputs.brand);
        formData.append("status", inputs.status);
        formData.append("sale", inputs.sale);
        formData.append("company", inputs.company);
        formData.append("detail", inputs.detail);

        avatarCheckbox.forEach((item) => {
            formData.append("avatarCheckBox[]", item);
        });

        newImages.forEach((item) => {
            formData.append("file[]", item);
        });
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            }
        };
        API.post("/user/product/update/" + params.id, formData, config)
            .then(res => {
                console.log("Update product:", res.data);

                if (res.data.errors) {
                    setErrors(res.data.errors);
                } else {
                    setErrors({});
                    alert("Cập nhật sản phẩm thành công!");
                    navigate("/my-product");
                }
            })
            .catch(error => {
                console.log("Lỗi update product:", error);
                if (error.response) {
                    console.log(error.response.data);

                    if (error.response.data.errors) {
                        setErrors(error.response.data.errors);
                    }
                }
            });
    };
  return (
    <>
    <MemberLeft/>
    <div className='col-sm-9'>
        <h2 className='title text-center'>Edit Product</h2>
        <div className='signup-form'>
        <form onSubmit={handleSubmit}>
            <ul>
                {renderError()}
            </ul>
            <input
                type="text"
                name="name"
                value={inputs.name}
                onChange={handleInput}/>
            <input
                type="text"
                name="price"
                value={inputs.price}
                onChange={handleInput}/>
            <select name='category' value={inputs.category} onChange={handleInput}>
                <option value="">Chọn Category</option>
                {categories.map(item =>(
                    <option key={item.id} value={item.id}>{item.category}</option>
                ))}
            </select>
            <select name='brand' value={inputs.brand} onChange={handleInput}>
                <option value="">Chọn Brand</option>
                {brands.map(item =>(
                    <option key={item.id} value={item.id}>{item.brand}</option>
                ))}
            </select>
            <input
                type="text"
                name="company"
                value={inputs.company}
                onChange={handleInput}/>
            <select 
                name='status'
                value={inputs.status}
                onChange={handleInput}>
                    <option value="1">New</option>
                    <option value="0">Sale</option>
            </select>
            {Number(inputs.status) === 0 && (
            <input
                type="text"
                name="sale"
                value={inputs.sale}
                onChange={handleInput}
                placeholder="Sale %"
            />
            )}
            <input
                type="file"
                name="image"
                multiple
                onChange={handleImage}/>
            <div>
                {oldImages.map((item, index) => (
                    <div key={index} style={{ display: "inline-block", marginRight: "15px" }}>
                        <img
                            src={`http://localhost/laravel8/public/upload/product/${auth.id}/${item}`}
                            alt=""
                            width="80"
                            height="80"/>

                        <br />
                        <input
                            type="checkbox"
                            value={item}
                            onChange={handleCheckImage}/>
                    </div>
                ))}
            </div>
            <textarea
                name="detail"
                value={inputs.detail}
                onChange={handleInput}/>
            <button type="submit"  className='btn btn-default'>Update Product</button>
        </form>
        </div>
    </div>
    </>
  )
}

export default EditProduct 
