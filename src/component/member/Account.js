import React, {useState, useEffect} from 'react'
import {  useNavigate } from 'react-router-dom'
import API from '../../api/API'
import MemberLeft from './MemberLeft'
const Account = () => {
    const auth = JSON.parse(localStorage.getItem("auth"))
    // console.log("auth:", auth)
    const[formData, setFormData] = useState({
        name:auth?.name || "",
        email: auth?.email ||"",
        password: "",
        phone: auth?.phone || "",
        address: auth?.address || "",
        avatar: auth?.avatar || ""
    });
    const[avatar, setAvatar] = useState("");
    const [file, setFile] = useState(null);
    const[error, setError] =  useState("");
    const handleFile = (e) =>{
        const allowType = ["png", "jpg", "jpeg"]
        const fileUpload = e.target.files[0];
        if(fileUpload){
            const a = fileUpload.name.split(".").pop().toLowerCase();
            if(!allowType.includes(a)){
                setError("Chỉ được chọn file png, jpg, jpeg");
                return;
            }
            if(fileUpload.size > 1024 * 1024){
                setError("Dung lượng ảnh phải nhỏ hơn 1MB");
                return;
            }
            setError("")
            setFile(fileUpload);
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("Base64:", e.target.result);
                setAvatar(e.target.result);
            };
            reader.readAsDataURL(fileUpload)
        }
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const data = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            avatar: avatar? avatar: formData.avatar
        };
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        console.log("Dữ liệu cập nhật:", data)
        API.post("/user/update/"+auth.id, data,config).then(res =>{
            console.log("Cập nhật thành công:", res.data);
            localStorage.setItem("auth",JSON.stringify(res.data.Auth));
            if(res.data.token){
                localStorage.setItem("token", res.data.token);
            }
            alert("Cập nhật dữ liệu thành công!")
        }).catch(error=>{
            console.log("Cập nhật lỗi!", error);
            if(error.response){
                console.log(error.response.data);
            }
        })
    }
  return (
    <>
    <MemberLeft/>
    <div className='col-sm-9'>
        <h2 className='title text-center'>Update Users</h2>
      <div className='signup-form'>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
        />

        <input
            type="email"
            name="email"
            value={formData.email}
            // onChange={handleChange}
            readOnly
        />

        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
        />

        <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
        />

        <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
        />
        <input
        type='file' 
        name='avatar'
        onChange={handleFile}
        />
        <p>{error}</p>
        <button type='submit' className='btn btn-default'>Update</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default Account
