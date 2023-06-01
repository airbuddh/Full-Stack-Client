import React from 'react'
import axios from "axios";
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {AuthContext} from "../helpers/AuthContext"

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const {authState} = useContext(AuthContext);
    let navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("accessToken")){
      navigate("/login");
    } else{

    
    axios.get("https://full-stack-client-eds.herokuapp.com/posts", {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
       setListOfPosts(response.data.listOfPosts);
       setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId;
       }));
      })}
  }, [])

  const likeAPost = (postId) => {
     axios.post("https://full-stack-client-eds.herokuapp.com/likes", { PostId: postId}, 
     {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
       setListOfPosts(listOfPosts.map((post) => {
        if (post.id  === postId){
          if(response.data.liked){
            return {...post, Likes: [...post.Likes, 0]}
          }
          else{
            const likesArray = post.Likes;
            likesArray.pop();
            return {...post, Likes: likesArray}
          }
        }
        else{
          return post
        }
       }))
       if(likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => {return id !== postId;}))
       }
       else{
          setLikedPosts([...likedPosts, postId])
       }
     })
  }

  return (
    <div>
         {listOfPosts.map((value, key) => {
          return ( 
          <div className="post">
                     <div className="title">{value.title}</div>
                        <div className="body" onClick={() => {navigate(`/post/${value.id}`)}}> {value.postText}</div>
                        <div className="footer"> <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                        <ThumbUpAltIcon onClick={() => {
                          likeAPost(value.id)
                          }} 
                          className ={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                          />
                          <label>{value.Likes.length}</label>
                        </div>

    </div>
      );
})}
    </div>
  );
}


export default Home;
