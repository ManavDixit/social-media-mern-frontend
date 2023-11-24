import React, { useCallback, useEffect, useState } from "react";
import "./Comments.css";
import Comment from "../Comment/Comment";
import { handleInputChange } from "../../extraFunctions/common";
import { addComment } from "../../api/comments";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../../api/comments";
import { useRef } from "react";
import spinner from "../../assets/spinner.svg";
const Comments = ({ getCommentsData }) => {
  const [data, setData] = useState({ message: "" });
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { postInfo } = useSelector((state) => state);
  const comments = postInfo.comments.comments ? postInfo.comments.comments : [];
  const isNextAvailable = postInfo.comments.isNextAvailable;
  const isPrevAvialble = postInfo.comments.isPrevAvialble;
  const postid = postInfo._id;
  //pagination
  const observer = useRef();
  const lastelement = useCallback(
    (element) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((elements) => {
     
        if (
          elements[0].isIntersecting &&
          !postInfo.loading &&
          isNextAvailable
        ) {
         
          getCommentsData(page + 1);
          setPage((page) => page + 1);
        }
      });
      if (element) observer.current.observe(element);
    },
    [comments, page]
  );

  const postComment = async () => {
    await addComment({ post_id: postid, message: data.message, dispatch });
    setData({ message: "" });
    //getting comments
    setPage(1);
    if (observer.current) observer.current.disconnect();
    getCommentsData(1);
  };

  return (
    <div className="comments">
      <div className="addCommentBox">
        <input
          value={data.message}
          type="text"
          placeholder="Add Comment"
          name="message"
          onChange={(e) => {
            handleInputChange(e, data, setData);
          }}
        />
        <button onClick={postComment}>Post</button>
      </div>

      {comments.length
        ? comments.map((comment, index) => {
            if (index >= comments.length - 1) {
              return (
                <Comment
                  ref={lastelement}
                  key={comment._id}
                  userName={comment.user}
                  message={comment.message}
                  hasLiked={comment.hasLiked}
                  postid={postid}
                  commentid={comment._id}
                />
              );
            } else {
              return (
                <Comment
                  key={comment._id}
                  userName={comment.user}
                  message={comment.message}
                  hasLiked={comment.hasLiked}
                  postid={postid}
                  commentid={comment._id}
                />
              );
            }
          })
        : null}
      {postInfo.loading && (
        <img className="spinner" src={spinner} alt="Loading...." />
      )}
    </div>
  );
};

export default Comments;
