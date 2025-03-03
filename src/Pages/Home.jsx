import React from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios'
import HomePost from '../Components/HomePost'
import Footer from '../Components/Footer'
import { URL } from '../url'
import { useEffect,useContext,useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import Loader from '../Components/Loader'
import { UserContext } from '../context/UserContext'

function Home() {

  const {search} = useLocation()
  const [posts,setPosts] = useState([])
  const [noResults,setNoResults] = useState(false)
  const [Loader,setLoader] = useState(false)
  const {user} = useContext(UserContext)
  const [cat,setCat] = useState([])
  const [filterData, setFilterData] = useState([])
  

  const fetchPosts = async () => {
    setLoader(true)
    try {
      const res = await axios.get(URL + "/api.posts/" + search)
      setPosts(res.data)
      setFilterData(res.data)
      let cata = res.data.map((item) => {return item.categories})     //Creating Category Filter
      let sets = new Set()
      cata.forEach((category) => {
        if(cata.length > 0) sets.add(catas)
      })
      

    } catch (err) {
      console.log(err);
      setLoader(true)
      
    }
  }


  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Home