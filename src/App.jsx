import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Profile from "./pages/Profile.jsx";
import MyBlogs from "./pages/MyBlogs.jsx";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/write" element={<CreatePost />} />
        <Route path="/posts/post/:id" element={<PostDetails />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/myblogs/:id" element={<MyBlogs />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
