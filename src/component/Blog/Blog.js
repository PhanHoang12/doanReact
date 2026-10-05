import React from 'react'
import { useState,useEffect } from 'react';
import API from '../../api/API';
import { NavLink } from 'react-router-dom';

const Blog = () => {
	const[blogs,setBlogs] = useState([]);
	useEffect(() =>{
		API.get("/blog").then(res =>{
			console.log(res.data);
			setBlogs(res.data.blog.data);
		}).catch(error =>{
			console.log("Lỗi API", error)
		});
	},[]);
  return (
	<section>
	<div className="container">
				<div className="row">
					<div className="col-sm-9">
						<div className="blog-post-area">
							<h2 className="title text-center">
								Latest From our Blog
							</h2>
							{blogs.map((item) => {
								const date = new Date(item.created_at);
								return (
								<div className="single-blog-post" key={item.id}>
									<h3>{item.title}</h3>
									<div className="post-meta">
										<ul>
											<li>
												<i className="fa fa-user"></i>
												{item.id_auth}
											</li>
											<li>
												<i className="fa fa-clock-o"></i>
												{date.toLocaleTimeString('vi-VN',{
													hour:"2-digit",
													minute:"2-digit"
												})}
											</li>
											<li>
												<i className="fa fa-calendar"></i>
												{date.toLocaleDateString("vi-VN")}
											</li>
										</ul>
										<span>
											<i className="fa fa-star"></i>
											<i className="fa fa-star"></i>
											<i className="fa fa-star"></i>
											<i className="fa fa-star"></i>
											<i className="fa fa-star-half-o"></i>
										</span>
									</div>
									<a href="/">
										<img
											src={`http://localhost/laravel8/public/upload/Blog/image/${item.image}`}
											alt={item.title}
										/>
									</a>
									<p>{item.description}</p>
									<NavLink
										className="btn btn-primary"
										to={`/blog/detail/${item.id}`}>
										Read More
									</NavLink>
								</div>
								);
								})}
							<div className="pagination-area">
								<ul className="pagination">
									<li>
										<a href="/" className="active">1</a>
									</li>
									<li>
										<a href="/">2</a>
									</li>
									<li>
										<a href="/">3</a>
									</li>
									<li>
										<a href="/">
											<i className="fa fa-angle-double-right"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
  );
}
export default Blog
