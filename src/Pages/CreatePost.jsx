import React from 'react'
import Footer from '../Components/Footer'
import {Imcross} from 'react-icons/im'
import { useState, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const {user} = useContext(UserContext)



function CreatePost() {

  const [title,setTitle] = useState("") 
  const [desc,setdesc] =  useState("")
  const [file,setfile] = useState(null)
  const [cat,setCat] = useState("a")
  const [cats,setCats] = useState([])

  const navigate = useNavigate()

  const addCategory = () => {
    let updatedcats = [...cats]
    updatedcats.push(cat)
    setCat("")
    setCats(updatedcats)
  }

  const deleteCategory = (i) => {
    let updatedcats = [...cats]
    updatedcats.splice(i)
    setCats(updatedcats)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const post ={
      title,desc,
      username: user.username,
      userId: user._Id,
      categories: cats 
    }
  }




  return (
    <div>
      
    </div>
  )
}

export default CreatePost