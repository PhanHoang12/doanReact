import { React,useState } from "react";
import API from "../../api/API";


const Register = () => {
    const[inputs,setInputs] = useState({
        name:"",
        email:"",
        password:"",
        phone:"",
        address:"",
    })
    const [avatar,setAvatar] = useState('')
    const[file, setFile] = useState(null)
    const[errors,setErrors] = useState({})
    const handleInput = (e)=> {
        const nameInput = e.target.name;
        const value = e.target.value;
        setInputs({...inputs,[nameInput]: value})
    }
    const handleUserInputFile = (e) =>{
        const fileUpload = e.target.files[0];
        if(fileUpload){
            setFile(fileUpload);
            const reader = new FileReader();
            reader.onload = (e) =>{
                setAvatar(e.target.result);
            }
            reader.readAsDataURL(fileUpload);
        }
    }
    function renderError(){
        if(Object.keys(errors).length > 0){
            return Object.keys(errors).map((key,index) =>{
                return (
                    <li key={index}>{errors[key]}</li>
                )
            })
        }
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        let flag = true;
        let errorSubmit = {};
        const allowType = ["png", "jpg", "jpeg"];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inputs.name === ""){
            errorSubmit.name = "Vui lòng nhập name!";
            flag = false
        }
        if(inputs.email === ""){
            errorSubmit.email = "Vui lòng nhập email!";
            flag = false;
        } else if(!emailRegex.test(inputs.email)){
            errorSubmit.email = "Email khong dung dinh dang!";
            flag = false
        }
        if(inputs.password === ""){
            errorSubmit.password = "Vui lòng nhập mật khẩu!";
            flag = false;
        }
        if(inputs.phone === ""){
            errorSubmit.phone = "Vui lòng nhập số điện thoại!";
            flag = false;
        }
        if (inputs.address === ""){
            errorSubmit.address = "Vui lòng nhập địa chỉ!";
            flag = false;
        }
        if (!file){
            errorSubmit.avatar = "Vui lòng chọn avatar!";
            flag = false;
        } else {
            const fileType = file.name.split(".").pop().toLowerCase();
            if(!allowType.includes(fileType)){
                errorSubmit.avatar = "File phải có dạng hình ảnh!";
                flag = false;
            }
            if(file.size > 1024*1024){
                errorSubmit.avatar = "File phải nhỏ hơn 1MB!";
                flag = false;
            }
        }
        if(!flag){
            setErrors(errorSubmit);
        } else {
            setErrors({});
            const data = {
                name: inputs.name,
                email: inputs.email,
                password: inputs.password,
                phone: inputs.phone,
                address: inputs.address,
                avatar: avatar,
                level: 0
            };
            API.post("/register",data).then(res=>{
                console.log(res.data)
            }).catch(error =>{
                console.log("Lỗi gọi API", error);
                if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data lỗi:", error.response.data);
            }
            });

        }

    }
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
        <ul>{renderError()}</ul>
        <input type="text" name="name" placeholder="Name" value={inputs.name} onChange={handleInput}/> <br></br>
        <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleInput}/> <br></br>
        <input type="password" name="password" placeholder="Pass" value={inputs.password} onChange={handleInput}/><br></br>
        <input type="text" name="phone" placeholder="Phone" value={inputs.phone} onChange={handleInput}/><br></br>
        <input type="text" name="address" placeholder="Address" value={inputs.address} onChange={handleInput}/><br></br>
        <input type="file" name="avatar" placeholder="Avatar"  onChange={handleUserInputFile}/><br></br>
        <button type="submit">Sign up</button>


    </form> 
  )
}

export default Register
