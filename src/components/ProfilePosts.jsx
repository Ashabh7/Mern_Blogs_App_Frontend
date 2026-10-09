import { Link } from "react-router-dom";

import "../css/ProfilePosts.css";

function ProfilePosts({ post }) {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

  const imageUrl = post.photo?.startsWith("http")
    ? post.photo
    : post.photo
      ? `${API_URL}/images/${post.photo}`
      : "";

  return (
    <article className="profile-post">
      <Link
        to={`/posts/post/${post._id}`}
        className="profile-post__image-link"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="profile-post__image"
          />
        ) : (
          <div className="profile-post__no-image">
            No image
          </div>
        )}
      </Link>

      <div className="profile-post__content">
        <h2 className="profile-post__title">
          <Link to={`/posts/post/${post._id}`}>
            {post.title}
          </Link>
        </h2>

        <div className="profile-post__meta">
          <span>@{post.username}</span>

          <time dateTime={post.updatedAt}>
            {new Date(post.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>

        <p className="profile-post__description">
          {post.desc.length > 200
            ? `${post.desc.slice(0, 200)}...`
            : post.desc}
        </p>

        <Link
          to={`/posts/post/${post._id}`}
          className="profile-post__read-more"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}

export default ProfilePosts;