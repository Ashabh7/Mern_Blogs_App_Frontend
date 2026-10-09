import { Link } from "react-router-dom";

import "../css/HomePosts.css";

function HomePosts({ post }) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  const imageUrl = post.photo?.startsWith("http")
    ? post.photo
    : `${API_URL}/images/${post.photo}`;

  return (
    <article className="home-post">
      <Link to={`/posts/post/${post._id}`} className="home-post__image-link">
        <img
          src={imageUrl}
          alt={post.title}
          className="home-post__image"
        />
      </Link>

      <div className="home-post__content">
        <div className="home-post__meta">
          <span>By {post.username}</span>

          <time dateTime={post.updatedAt}>
            {new Date(post.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>

        <h2 className="home-post__title">
          <Link to={`/posts/post/${post._id}`}>{post.title}</Link>
        </h2>

        <p className="home-post__description">
          {post.desc.length > 150
            ? `${post.desc.slice(0, 150)}...`
            : post.desc}
        </p>

        <Link to={`/posts/post/${post._id}`} className="home-post__read-more">
          Read article →
        </Link>
      </div>
    </article>
  );
}

export default HomePosts;