import React,{useEffect, useState} from 'react'
import MemberLeft from '../member/MemberLeft';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const[inputs, setInputs] = useState({
        name:"",
        price:"",
        category:"",
        brand:"",
        status:1,
        sale:0,
        company:"",
        detail:""
    });
    const navigate = useNavigate();
    const[images, setImages] = useState([]);
    const[errors, setErrors] = useState({});
    const[categories, setCategories] = useState([]);
    const[brands, setBrands] = useState([]);
    useEffect(()=>{
        API.get("/category-brand").then(res=>{
            console.log("Catagory brand:",res.data)
            setCategories(res.data.category)
            setBrands(res.data.brand)
        }).catch(error=>{
            console.log("Lỗi lấy category và brand!", error);
            if(error.response){
                console.log(error.response.data);
            }
        })
    },[])
    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "status") {
            if(value === "1"){
                setInputs({
                    ...inputs,
                    status: value,
                    sale:0
                });
            } else {
                setInputs({
                    ...inputs, 
                    status:value,
                    sale:""
                })
            }
        } else {
            setInputs({
                ...inputs,
                [name]: value
            });
        }
    };
    const handleImage = (e) => {
        const files = Array.from(e.target.files);
        const allowType = ["png", "jpg", "jpeg"];
        if(files.length > 3){
            setErrors({
                ...errors,
                images: "Chỉ được chọn tối đa 3 ảnh!"
            })
            return;
        }
        for(let i=0; i< files.length; i++){
            const fileType = files[i].name.split(".").pop().toLowerCase();
            if(!allowType.includes(fileType)){
                setErrors({
                    ...errors, images: "Hình chỉ được có các định dạng jpg, jpeg, png"
                });
                return;
            }
            if(files[i].size > 1024*1024){
                setErrors({
                    ...errors, images:"Mỗi hình ảnh phải nhỏ hơn 1MB!"
                });
                return;
            }
        }
        setErrors({...errors, images:""})
        setImages(files)
        console.log("Danh sách hình:", files)
    }
    function renderError(){
        if(Object.keys(errors).length >0 ){
            return Object.keys(errors).map((key,index)=>(
                <li key={index}>{errors[key]}</li>
            ))
        }
    }
    const handleSubmit = (e) =>{
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

        if (images.length === 0) {
            errorSubmit.images = "Vui lòng chọn hình ảnh!";
            flag = false;
        }

        if (inputs.detail === "") {
            errorSubmit.detail = "Vui lòng nhập detail!";
            flag = false;
        }

        if (Number(inputs.status) === 0 && inputs.sale === "") {
            errorSubmit.sale = "Vui lòng nhập % sale!";
            flag = false;
        }

        if (!flag) {
            setErrors(errorSubmit);
            return;
        }
        setErrors({});
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("name", inputs.name);
        formData.append("price", inputs.price);
        formData.append("category", inputs.category);
        formData.append("brand", inputs.brand);
        formData.append("status", inputs.status);
        formData.append("sale", inputs.sale);
        formData.append("company", inputs.company);
        formData.append("detail", inputs.detail);

        images.forEach((item) => {
            formData.append("file[]", item);
        });
        const config = {
        headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json"
            }
        };
        API.post("/user/product/add", formData, config).then(res =>{
            console.log("Add product thành công:", res.data);
            if(res.data.errors){
                setErrors(res.data.errors);
            } else {
                setErrors({});
                alert("Thêm sản phẩm thành công!");
                navigate("/my-product")

            }
        }).catch(error =>{
            console.log("Lỗi thêm sản phẩm:", error)
            if (error.response) {
                console.log(error.response.data);
            }
        })
    }
    

  return (
    <>
      <MemberLeft/>
      <div className='col-sm-9'>
        <div className='signup-form'>
            <h2>Create Product</h2>
            <form onSubmit={handleSubmit}>
                <ul>
                    {renderError()}
                </ul>
                <input type='text' name='name' placeholder='Tên sản phẩm' value={inputs.name} onChange={handleInput}/>
                <input type='text' name='price' placeholder='Giá' value={inputs.price} onChange={handleInput}/>
                <input type='text' name='company' placeholder='Công ty' value={inputs.company} onChange={handleInput}/>
                <select name='category' value={inputs.category} onChange={handleInput}>
                    <option value="">chọn category!</option>
                    {categories.map(item =>(
                        <option key={item.id} value={item.id}>{item.category}</option>
                    ))}
                </select>
                <select name='brand' value={inputs.brand} onChange={handleInput}>
                    <option value="">chọn một brand!</option>
                    {brands.map(item =>(
                        <option key={item.id} value={item.id}>{item.brand}</option>
                    ))}
                </select>
                <select name='status' value={inputs.status} onChange={handleInput}>
                    <option value="1">New</option>
                    <option value="0">Sale</option>
                </select>
                {Number(inputs.status) === 0 &&(
                    <input type='text' name='sale' placeholder='Sale %' value={inputs.sale} onChange={handleInput}/>
                )}
                <input type='file' name='image' multiple onChange={handleImage}/>
                {errors.images && <p>{errors.images}</p>}
                <textarea name='detail' placeholder='Detail' value={inputs.detail} onChange={handleInput}/>
                <button type='submit'>Add Product</button>
            </form>
        </div>
      </div>
    </>
  )
}

export default AddProduct
