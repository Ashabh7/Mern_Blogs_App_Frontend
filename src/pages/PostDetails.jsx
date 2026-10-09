import { useContext, useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";

import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/PostDetails.css";

function PostDetails() {
  const { id: postId } = useParams();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [postError, setPostError] = useState("");
  const [commentError, setCommentError] = useState("");

  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setPostLoading(true);
      setPostError("");

      try {
        const response = await api.get(`/api/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPostError("Unable to load this post.");
      } finally {
        setPostLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  useEffect(() => {
    async function fetchComments() {
      setCommentsLoading(true);
      setCommentError("");

      try {
        const response = await api.get(
          `/api/comments/post/${postId}`
        );

        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setCommentError("Unable to load comments.");
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  async function handleDeletePost() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingPost(true);

    try {
      await api.delete(`/api/posts/${postId}`);

      navigate("/");
    } catch (error) {
      console.error("Failed to delete post:", error);
      setPostError("Unable to delete the post. Please try again.");
      setDeletingPost(false);
    }
  }

  async function handlePostComment(event) {
    event.preventDefault();

    setCommentError("");

    if (!user) {
      setCommentError("Please log in to comment.");
      return;
    }

    if (!comment.trim()) {
      setCommentError("Please write a comment.");
      return;
    }

    setCommentSubmitting(true);

    try {
      const response = await api.post("/api/comments/create", {
        comment: comment.trim(),
        author: user.username,
        postId,
        userId: user._id,
      });

      setComments((previous) => [...previous, response.data]);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      setCommentError("Unable to add your comment.");
    } finally {
      setCommentSubmitting(false);
    }
  }

  function handleCommentDelete(commentId) {
    setComments((previous) =>
      previous.filter((item) => item._id !== commentId)
    );
  }

  if (postLoading) {
    return (
      <>
        <Navbar />

        <main className="post-details__loading">
          <Loader />
        </main>

        <Footer />
      </>
    );
  }

  if (postError || !post) {
    return (
      <>
        <Navbar />

        <main className="post-details__message">
          <h1>Post unavailable</h1>
          <p>{postError || "This post could not be found."}</p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </main>

        <Footer />
      </>
    );
  }

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  const imageUrl = post.photo?.startsWith("http")
    ? post.photo
    : `${API_URL}/images/${post.photo}`;

  const isOwner = user?._id === post.userId;

  return (
    <>
      <Navbar />

      <main className="post-details">
        <article className="post-details__article">
          <header className="post-details__header">
            <div className="post-details__title-row">
              <h1>{post.title}</h1>

              {isOwner && (
                <div className="post-details__actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/edit/${postId}`)}
                    aria-label="Edit post"
                    title="Edit post"
                  >
                    <BiEdit />
                  </button>

                  <button
                    type="button"
                    onClick={handleDeletePost}
                    disabled={deletingPost}
                    aria-label="Delete post"
                    title="Delete post"
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>

            <div className="post-details__meta">
              <span>
                <FcManager />
                By {post.username}
              </span>

              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </time>
            </div>
          </header>

          {post.photo && (
            <div className="post-details__image-wrapper">
              <img
                src={imageUrl}
                alt={post.title}
                className="post-details__image"
              />
            </div>
          )}

          <div className="post-details__body">
            <p>{post.desc}</p>
          </div>

          {post.categories?.length > 0 && (
            <div className="post-details__categories">
              <span className="post-details__categories-label">
                Categories
              </span>

              <div className="post-details__category-list">
                {post.categories.map((category) => (
                  <span
                    className="post-details__category"
                    key={category}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <section className="post-details__comments">
            <div className="post-details__comments-header">
              <h2>Comments</h2>
              <span>{comments.length}</span>
            </div>

            {commentsLoading ? (
              <div className="post-details__comments-loading">
                <Loader />
              </div>
            ) : commentError && comments.length === 0 ? (
              <p className="post-details__comments-error">
                {commentError}
              </p>
            ) : comments.length === 0 ? (
              <p className="post-details__no-comments">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="post-details__comment-list">
                {comments.map((item) => (
                  <Comment
                    key={item._id}
                    comment={item}
                    onDelete={handleCommentDelete}
                  />
                ))}
              </div>
            )}

            {user ? (
              <form
                className="post-details__comment-form"
                onSubmit={handlePostComment}
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  placeholder="Write a comment..."
                  aria-label="Write a comment"
                />

                <button
                  type="submit"
                  disabled={commentSubmitting}
                >
                  {commentSubmitting
                    ? "Adding..."
                    : "Add comment"}
                </button>
              </form>
            ) : (
              <p className="post-details__login-message">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>{" "}
                to join the conversation.
              </p>
            )}

            {commentError && comments.length > 0 && (
              <p className="post-details__form-error">
                {commentError}
              </p>
            )}
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}

export default PostDetails;