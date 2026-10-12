import {React, useState, useEffect} from 'react'
import { Rating } from 'react-simple-star-rating'
import { useNavigate,useParams } from 'react-router-dom'
import API from '../../api/API'
const Rate = ({setCountRate}) => {
    const[rating,setRating] = useState(0)
    const navigate = useNavigate()
    const params = useParams()
    

    
    const getRate = () =>{
         API.get("/blog/rate/" + params.id).then(res =>{
            console.log(res.data)
            const danhSach = Object.values(res.data.data)
            setCountRate(danhSach.length)
            if(danhSach.length > 0){
                const total = danhSach.reduce((sum,item) =>{
                    return sum + Number(item.rate);
                },0);
                const Trungbinh = total/danhSach.length
                console.log("Điểm trung bình:", Trungbinh)
                setRating(Trungbinh)
            }
        }).catch(error => {
            console.log("Lỗi lấy rate", error)
            if(error.response){
                console.log(error.response.data)
            }
        })
    }
    useEffect(()=>{
       getRate();
    },[params.id])
    const handleRating = (rate) =>{
        const token = localStorage.getItem("token");
        const auth = JSON.parse(localStorage.getItem("auth"));
        if(!token || !auth){
            alert("Vui lòng đăng nhập để đánh giá bài viết này!");
            navigate("/member/login-register/")
            return;
        }
        const data = {
            user_id: auth.id,
            blog_id: params.id,
            rate: rate
        }
        const config = {
            headers: {
                Authorization:"Bearer " + token,
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }

        }
        API.post("/blog/rate/" + params.id, data, config).then(res =>{
            console.log(res.data);
            getRate();  
            alert("Đánh giá thành công!")

        }).catch(error => {
            console.log("Lỗi rate không thể đánh giá ", error);
            if(error.response){
                console.log(error.response.data);
            }
        }) 
    }

  return (
    <div>
      <Rating 
      onClick={handleRating}
      initialValue={rating}
      size={35}
      transition
      fillColor='gold'
      emptyColor='gray'/>
    </div>
  )
}

export default Rate
