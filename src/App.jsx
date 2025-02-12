import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import CreatePost from './Pages/CreatePost'
import PostDetails from './Pages/PostDetails'
import EditPost from './Pages/EditPost'
import MyBlogs from './Pages/MyBlogs'
import Profile from './Pages/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>

      <Route exact path='/' element={Home} />
      <Route exact path='/login' element={Login} />
      <Route exact path='/register' element={Register} />
      <Route exact path='/write' element={CreatePost} />
      <Route exact path='/Post/post/:id' element={PostDetails} />
      <Route exact path='/edit/:id' element={EditPost} />
      <Route exact path='/myBlogs/:id' element={MyBlogs} />
      <Route exact path='/profile' element={Profile} />

      
     </Routes>
    </>
  )
}


export default App
