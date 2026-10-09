import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/MyBlogs.css";

function MyBlogs() {
  const { id: userId } = useParams();
  const { user, loading: userLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnBlogs = user?._id === userId;

  useEffect(() => {
    async function fetchPosts() {
      if (!userId) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/api/posts/user/${userId}`
        );

        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        setError("Unable to load these blogs.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [userId]);

  if (userLoading) {
    return (
      <>
        <Navbar />

        <main className="my-blogs__loading">
          <Loader />
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="my-blogs__message">
          <h1>Login required</h1>
          <p>You need to log in to view your blogs.</p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="my-blogs">
        <div className="my-blogs__container">
          <header className="my-blogs__header">
            <div>
              <p className="my-blogs__eyebrow">
                {isOwnBlogs ? "Your writing" : "BlogoSphere"}
              </p>

              <h1>
                {isOwnBlogs ? "My Blogs" : "Blogs"}
              </h1>

              <p>
                {isOwnBlogs
                  ? "Manage and revisit everything you've published."
                  : "Explore this writer's published stories."}
              </p>
            </div>

            <div className="my-blogs__count">
              <strong>{posts.length}</strong>
              <span>
                {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>
          </header>

          {loading ? (
            <div className="my-blogs__posts-loading">
              <Loader />
            </div>
          ) : error ? (
            <div className="my-blogs__empty">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="my-blogs__empty">
              <h2>No posts yet</h2>

              <p>
                {isOwnBlogs
                  ? "You haven't published anything yet. Start writing your first story."
                  : "This writer hasn't published any posts yet."}
              </p>

              {isOwnBlogs && (
                <button
                  type="button"
                  onClick={() => navigate("/write")}
                >
                  Write your first post
                </button>
              )}
            </div>
          ) : (
            <div className="my-blogs__posts">
              {posts.map((post) => (
                <HomePosts
                  key={post._id}
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MyBlogs;