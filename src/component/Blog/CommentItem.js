import React from 'react';

const CommentItem = ({
    item,
    replies,
    idComment,
    comment,
    errorCmt,
    handleReply,
    handleChangeComment,
    handleComment
}) => {
    const date = item.created_at ? new Date(item.created_at): null;

    return (
        <li className="media">
            <a className="pull-left" href="#">
                <img
                    className="media-object"
                    src={`http://localhost/laravel8/public/upload/user/avatar/${item.image_user}`}
                    alt=""/>
            </a>
            <div className="media-body">
                <ul className="sinlge-post-meta">
                    <li>
                        <i className="fa fa-user"></i>
                        {item.name_user}
                    </li>

                    <li>
                        <i className="fa fa-clock-o"></i>
                        {date.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </li>

                    <li>
                        <i className="fa fa-calendar"></i>
                        {date.toLocaleDateString("vi-VN")}
                    </li>
                </ul>

                <p>{item.comment}</p>

                <a
                    className="btn btn-primary"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleReply(item.id);
                    }}>
                    <i className="fa fa-reply"></i>
                    Reply
                </a>

                {idComment === item.id && (
                    <form onSubmit={handleComment}>
                        <textarea
                            rows="5"
                            value={comment}
                            onChange={handleChangeComment}
                            placeholder={`Reply ${item.name_user}`}/>
                        <p>{errorCmt}</p>
                        <button
                            type="submit"
                            className="btn btn-primary">
                            Post Reply
                        </button>
                    </form>
                )}
                {replies.map(reply => {
                    const replyDate =
                        new Date(reply.created_at);
                    return (
                        <div
                            key={reply.id}
                            className="media second-media">
                            <a
                                className="pull-left">
                                <img
                                    className="media-object"
                                    src={`http://localhost/laravel8/public/upload/user/avatar/${reply.image_user}`}
                                    alt=""/>
                            </a>
                            <div className="media-body">
                                <ul className="sinlge-post-meta">
                                    <li>
                                        <i className="fa fa-user"></i>
                                        {reply.name_user}
                                    </li>
                                    <li>
                                        <i className="fa fa-clock-o"></i>
                                        {replyDate.toLocaleTimeString(
                                            "vi-VN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }
                                        )}
                                    </li>
                                    <li>
                                        <i className="fa fa-calendar"></i>
                                        {replyDate.toLocaleDateString(
                                            "vi-VN")}
                                    </li>
                                </ul>
                                <p>{reply.comment}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </li>
    );
};
export default CommentItem;