import React, { useContext } from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import Comment from '../Components/Comment'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from 'axios'
import { URL,IF } from '../url'
import { UserContext } from '../context/UserContext'
import { useEffect, useState} from 'react'
import Loader from '../Components/Loader'
import {FcManager} from 'react-icons/fc'




function PostDetails() {

  const PostID = useParams().id
  const [post, setpost] = useState({})
  const {user} = useContext(UserContext)
  const [comments, setComment] = useState("")
  const [loader, setloader] = useState(false) 
  const navigate = useNavigate()

  const fetchPost = async () => {
    try {
      const res = await axios.get("/api/post/" + PostID)
      setpost(res.data)

    }
    
    catch (err) {
      console.log(err);
      
    }
  }


  const handleDeletePost = async () => {
    try {
      const res = await axios.delete("/api/post/" + PostID,{withCredentials: true})
      console.log(res.data);
      navigate("/")

      
    } catch (err) {
      console.log(err);
      
    }
  }


  useEffect(() => {
    fetchPost()
  },[PostID])


  const fetchPostComments = async () => {
    setloader(true)

    try {
      const res = await axios.get(URL + "/api/comments/post/" + PostID)
      setComment(res.data)
      setloader(false)
      


    } 
    catch (err) {
      setloader(true)
      console.log(err);
      
    }
  }



  return (
    <div>
      Post
    </div>
  )
}

export default PostDetails