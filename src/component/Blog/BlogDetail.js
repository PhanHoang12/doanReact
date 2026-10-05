import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../api/API';
const BlogDetail = () => {
	const[data,setData] = useState({});
	const params = useParams();
	useEffect(()=>{
		API.get("/blog/detail/"+params.id).then(res=>{
			console.log(res.data);
			setData(res.data.data)
		}).catch(error=>{
			console.log("Lỗi gọi API", error)
		});
	},[params.id]);
  return (
    <div className="col-sm-9">
					<div className="blog-post-area">
						<h2 className="title text-center">Latest From our Blog</h2>
						<div className="single-blog-post">
							<h3>{data.title}</h3>
							<div className="post-meta">
								<ul>
									<li><i className="fa fa-user"></i> {data.id_auth}</li>
									<li><i className="fa fa-clock-o"></i> {data.created_at
																			? new Date(data.created_at).toLocaleTimeString('vi-VN', {
																				hour: '2-digit',
																				minute: '2-digit'}): ''}</li>
									<li> <i className="fa fa-calendar"></i>
										{data.created_at? new Date(data.created_at).toLocaleDateString('vi-VN'): ''} </li>
								</ul>
							 <span>
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star"></i>
									<i className="fa fa-star-half-o"></i>
								</span>
							</div>
							<a href="">
								<img src={data.image? `http://localhost/laravel8/public/upload/Blog/image/${data.image}`:''} alt={data.title} />
							</a>
							<p>{data.description}</p> <br/>
							<div dangerouslySetInnerHTML={{__html: data.content}}/>
							
							<div className="pager-area">
								<ul className="pager pull-right">
									<li><a href="#">Pre</a></li>
									<li><a href="#">Next</a></li>
								</ul>
							</div>
						</div>
					</div>
					<div className="rating-area">
						<ul className="ratings">
							<li className="rate-this">Rate this item:</li>
							<li>
								<i className="fa fa-star color"></i>
								<i className="fa fa-star color"></i>
								<i className="fa fa-star color"></i>
								<i className="fa fa-star"></i>
								<i className="fa fa-star"></i>
							</li>
							<li className="color">(6 votes)</li>
						</ul>
						<ul className="tag">
							<li>TAG:</li>
							<li><a className="color" href="">Pink <span>/</span></a></li>
							<li><a className="color" href="">T-Shirt <span>/</span></a></li>
							<li><a className="color" href="">Girls</a></li>
						</ul>
					</div>
				</div>	
  )
}

export default BlogDetail
