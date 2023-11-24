import React,{useEffect,useState} from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Notifications from '../Notifications/Notifications';
import Post from '../Post/Post';
import './PostInfo.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPostInfo } from '../../api/posts';
import { useDispatch,useSelector } from 'react-redux';
import { setPostinfo,setComments, setLoading } from '../../Reducers/postInfo';
import Comments from '../Comments/Comments';
import { getComments } from '../../api/comments';
import spinner from '../../assets/spinner.svg'
const PostInfo = () => {
  const token=localStorage.getItem('token');
  let [searchParams, setSearchParams] = useSearchParams();
  const postid=searchParams.get('postid');
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const { postInfo } = useSelector((state) => state);


  const getCommentsData=async (page=1)=>{
    const {comments,isPrevAvialble,isNextAvailable}=await getComments({dispatch,post_id:postid,page});
   
    if(page>1){
      dispatch(setComments({isNextAvailable,isPrevAvialble,comments:[...(postInfo.comments.comments),...comments]}))
   
    }
    else{
      dispatch(setComments({isNextAvailable,isPrevAvialble,comments:[...comments]}))
      
    }
  }

  useEffect(()=>{
    const controller = new AbortController();
    const signal = controller.signal;
    if (!token) {

      navigate('/landing');
    }else{
     const setPostData=async()=>{
      dispatch(setLoading(true));
      const data=await getPostInfo({navigate,postid,dispatch,signal});
      dispatch(setPostinfo({...data,comments:{comments:[],isNextAvailable:false,isPrevAvialble:false}}));
      dispatch(setLoading(false));
     }
     setPostData();

     //getting comments 

      getCommentsData(1);
    
    }
    return ()=>{
      controller.abort();
    }
  },[]);
 console.log(postInfo.comments)
  return (
    <div id='postinfo'>
      {
        token && postInfo && !postInfo.loading ? (
          <>
          
          
          <div id='postbox'>

          <Post key={PostInfo._id}
            title={postInfo.title}
            description={postInfo.description}
            likeCount={5}
            postimg={postInfo.image}
            postvideo={postInfo.video}
            hasLiked={postInfo.hasLiked}
            postid={postInfo._id}
            userName={postInfo.user}
            email={postInfo.email}
            />

            <Comments getCommentsData={getCommentsData}/>
          </div>
          
          </>
        
  ) : <img className="spinner" src={spinner} alt="Loading...." />
      }
    </div>
  )
}

export default PostInfo;