import { useContext } from "react";
import { MdDelete } from "react-icons/md";

import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/Comment.css";

function Comment({ comment, onDelete }) {
  const { user } = useContext(UserContext);

  async function handleDelete() {
    try {
      await api.delete(`/api/comments/${comment._id}`);

      if (onDelete) {
        onDelete(comment._id);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  }

  const isOwner = user?._id === comment.userId;

  return (
    <article className="comment">
      <div className="comment__header">
        <div>
          <h3 className="comment__author">
            @{comment.author}
          </h3>

          <time
            className="comment__date"
            dateTime={comment.updatedAt}
          >
            {new Date(comment.updatedAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </time>
        </div>

        {isOwner && (
          <button
            type="button"
            className="comment__delete"
            onClick={handleDelete}
            aria-label="Delete comment"
            title="Delete comment"
          >
            <MdDelete />
          </button>
        )}
      </div>

      <p className="comment__text">{comment.comment}</p>
    </article>
  );
}

export default Comment;