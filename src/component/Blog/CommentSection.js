import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/API';
import CommentItem from './CommentItem';

const CommentSection = ({ blogId, initialComments }) => {
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [errorCmt, setErrorCmt] = useState('');
    const [idComment, setIdComment] = useState(0);

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const handleChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleReply = (id) => {
        setIdComment(id);
        setComment('');
        setErrorCmt('');
    };

    const handleComment = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const auth = JSON.parse(localStorage.getItem("auth"));

        if (!token || !auth) {
            alert("Vui lòng đăng nhập để comment!");
            navigate("/member/login-register");
            return;
        }

        if (comment.trim() === "") {
            setErrorCmt("Vui lòng nhập comment!");
            return;
        }

        setErrorCmt("");

        const data = {
            id_blog: blogId,
            id_user: auth.id,
            name_user: auth.name,
            id_comment: idComment,
            comment: comment,
            image_user: auth.avatar
        };

        const config = {
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        API.post("/blog/comment/" + blogId, data, config)
            .then(res => {
                setComments(prev => [
                    ...prev,
                    res.data.data
                ]);

                setComment('');
                setIdComment(0);

                alert("Bình luận thành công!");
            })
            .catch(error => {
                console.log("Lỗi comment", error);

                if (error.response) {
                    console.log(error.response.data);
                }
            });
    };

    const parentComments = comments.filter(
        item => Number(item.id_comment) === 0
    );

    const getReplies = (parentId) => {
        return comments.filter(
            item =>
                Number(item.id_comment) === Number(parentId)
        );
    };

    return (
        <>
            <div className="response-area">
                <h2>{comments.length} RESPONSES</h2>

                <ul className="media-list">
                    {parentComments.map(item => (
                        <CommentItem
                            key={item.id}
                            item={item}
                            replies={getReplies(item.id)}
                            idComment={idComment}
                            comment={comment}
                            errorCmt={errorCmt}
                            handleReply={handleReply}
                            handleChangeComment={handleChangeComment}
                            handleComment={handleComment}
                        />
                    ))}
                </ul>
            </div>

            <div className="replay-box">
                <div className="row">
                    <div className="col-sm-12">
                        <h2>Leave a reply</h2>

                        <form onSubmit={handleComment}>
                            <div className="text-area">

                                <textarea
                                    name="comment"
                                    rows="11"
                                    value={comment}
                                    onFocus={() => setIdComment(0)}
                                    onChange={handleChangeComment}/>

                                <p>{errorCmt}</p>

                                <button
                                    type="submit"
                                    className="btn btn-primary">
                                    Post Comment
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommentSection;