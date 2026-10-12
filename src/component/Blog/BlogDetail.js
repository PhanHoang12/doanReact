import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/API';
import CommentSection from './CommentSection';
import Rate from './Rate';

const BlogDetail = () => {
    const [data, setData] = useState({});
    const params = useParams();
    const[countRate, setCountRate] = useState(0);

    useEffect(() => {
        API.get("/blog/detail/" + params.id)
            .then(res => {
                setData(res.data.data);
            })
            .catch(error => {
                console.log("Lỗi gọi API", error);
            });
    }, [params.id]);

    return (
        <div className="col-sm-9">

            <div className="blog-post-area">
                <h2 className="title text-center">
                    Latest From our Blog
                </h2>

                <div className="single-blog-post">
                    <h3>{data.title}</h3>

                    <div className="post-meta">
                        <ul>
                            <li>
                                <i className="fa fa-user"></i>
                                {data.id_auth}
                            </li>

                            <li>
                                <i className="fa fa-clock-o"></i>
                                {data.created_at
                                    ? new Date(data.created_at)
                                        .toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                    : ""}
                            </li>

                            <li>
                                <i className="fa fa-calendar"></i>
                                {data.created_at
                                    ? new Date(data.created_at)
                                        .toLocaleDateString("vi-VN")
                                    : ""}
                            </li>
                        </ul>
                    </div>

                    {data.image && (
                        <img
                            src={`http://localhost/laravel8/public/upload/Blog/image/${data.image}`}
                            alt={data.title}
                        />
                    )}

                    <p>{data.description}</p>

                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{
                            __html: data.content
                        }}
                    />
                </div>
            </div>
            <div className="rating-area">
						<ul className="ratings">
							<li className="rate-this">Rate this item:</li>
							<li>
								{/* <i className="fa fa-star color"></i>
								<i className="fa fa-star color"></i>
								<i className="fa fa-star color"></i>
								<i className="fa fa-star"></i>
								<i className="fa fa-star"></i> */}
                                <Rate setCountRate={setCountRate}/>
							</li>
							<li className="color">({countRate} votes)</li>
						</ul>
						<ul className="tag">
							<li>TAG:</li>
							<li><a className="color" href="">Pink <span>/</span></a></li>
							<li><a className="color" href="">T-Shirt <span>/</span></a></li>
							<li><a className="color" href="">Girls</a></li>
						</ul>
					</div>


            {/* em tách CommentSection để xử lí phần comment cho file dễ đọc  */}

            <CommentSection
                blogId={params.id}
                initialComments={data.comment || []}/>
        </div>
    );
};

export default BlogDetail;