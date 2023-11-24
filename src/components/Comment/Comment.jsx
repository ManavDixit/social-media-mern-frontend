import './Comment.css';
import React,{forwardRef,useState,useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import { likeComment } from '../../api/comments';
import { LikePost } from '../../Reducers/postInfo';
import { useDispatch } from 'react-redux';
const Comment = forwardRef(({userName,message,hasLiked,commentid,postid},ref) => {
  const dispatch=useDispatch();
  const [liked, setLiked] = useState(hasLiked);
  const handleLike=(e)=>{
    e.stopPropagation();
    setLiked(liked=>!liked)
    likeComment({postid,commentid})
  };
  return (
    <div ref={ref} className='comment'>
        <div className="userInfo">
        <div className="userPicName">{userName ? userName.charAt(0).toUpperCase() : ""}</div>
       <p>
        
        {userName}
        </p> 
      </div>
      <div className="message">{message}</div>

      <div className="buttons">
        <FontAwesomeIcon icon={faHeart} style={{color:liked?'red':'black'}} onClick={handleLike}/>
      </div>
    </div>
  )
})

export default Comment