import {React, useState} from 'react'
import API from '../../api/API'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate();
    const[inputs, setInputs] = useState({
        email:"",
        password:"",
    });
    const[errors, setErrors] = useState({});
    const handleInput = (e) =>{
        const nameInput = e.target.name;
        const value = e.target.value;
        setInputs({...inputs,[nameInput]:value})
    }
    function renderError(){
        if(Object.keys(errors).length >0){
            return (Object.keys(errors).map((key,index) => {
                return(
                    <li key={index}>{errors[key]}</li>
                )
            }))
        }
    }
    function handleSubmit(e){
        e.preventDefault();
        let flag = true;
        let errorSubmit = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(inputs.email ===""){
            errorSubmit.email = "Vui long nhap email!";
            flag = false
        } else if (!emailRegex.test(inputs.email)){
            errorSubmit.email = "Vui long nhap dung dinh dang email";
            flag = false;
        }
        if(inputs.password === ""){
            errorSubmit.password = "Vui long nhap pass!";
            flag = false;
        }
        if(!flag){
            setErrors(errorSubmit);
        } else {
            setErrors({});
            const data = {
                email: inputs.email,
                password: inputs.password,
                level: 0,
            };
            API.post("/login",data).then(res =>{
                console.log(res.data);
                if(res.data.error){
                    setErrors(res.data.error)

                } else if(res.data.success){
                    setErrors({});
                    localStorage.setItem("auth", JSON.stringify(res.data.Auth));
                    localStorage.setItem("token", res.data.token);
                    navigate("/")
                }
            }).catch(error =>{
                console.log("lỗi login" , error);
                if(error.response){
                    console.log(error.response.data);
                }
            })
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <ul>{renderError()}</ul>
        <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleInput}/> <br></br>
        <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleInput}/> <br></br>
        <button type='submit'>Login</button>
    </form>
  )
}

export default Login
