import { useContext, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/EditPost.css";

const categories = [
  "Artificial Intelligence",
  "Big Data",
  "Blockchain",
  "Business Management",
  "Cloud Computing",
  "Database",
  "Cyber Security",
  "DevOps",
  "Web Development",
  "Mobile Development",
  "Operating System",
  "Enterprise",
];

function EditPost() {
  const { id: postId } = useParams();
  const { user, loading: userLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [file, setFile] = useState(null);

  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/posts/${postId}`);
        const post = response.data;

        setTitle(post.title);
        setDesc(post.desc);
        setCurrentPhoto(post.photo || "");
        setSelectedCategories(post.categories || []);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  function addCategory() {
    const trimmedCategory = category.trim();

    if (!trimmedCategory) {
      return;
    }

    if (selectedCategories.includes(trimmedCategory)) {
      return;
    }

    setSelectedCategories((previous) => [
      ...previous,
      trimmedCategory,
    ]);

    setCategory("");
  }

  function deleteCategory(index) {
    setSelectedCategories((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  async function handleUpdate(event) {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("You must be logged in to edit a post.");
      return;
    }

    if (!title.trim() || !desc.trim()) {
      setError("Please enter a title and description.");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Please add at least one category.");
      return;
    }

    setUpdating(true);

    try {
      let photo = currentPhoto;

      // Upload a new image only if one was selected.
      if (file) {
        const formData = new FormData();

        formData.append("file", file);

        const uploadResponse = await api.post(
          "/api/upload",
          formData
        );

        photo = uploadResponse.data.url;
      }

      const post = {
        title: title.trim(),
        desc: desc.trim(),
        username: user.username,
        userId: user._id,
        categories: selectedCategories,
        photo,
      };

      const response = await api.put(
        `/api/posts/${postId}`,
        post
      );

      navigate(`/posts/post/${response.data._id}`);
    } catch (error) {
      console.error("Failed to update post:", error);

      setError(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : "Unable to update the post. Please try again.")
      );
    } finally {
      setUpdating(false);
    }
  }

  if (userLoading || loading) {
    return (
      <>
        <Navbar />

        <main className="edit-post__message">
          <p>Loading post...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="edit-post__message">
          <h1>Login required</h1>
          <p>You need to log in before editing a post.</p>

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

  if (error && !title && !desc) {
    return (
      <>
        <Navbar />

        <main className="edit-post__message">
          <h1>Post unavailable</h1>
          <p>{error}</p>

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

  const imageUrl = currentPhoto.startsWith("http")
    ? currentPhoto
    : currentPhoto
      ? `${API_URL}/images/${currentPhoto}`
      : "";

  return (
    <>
      <Navbar />

      <main className="edit-post">
        <div className="edit-post__container">
          <div className="edit-post__header">
            <p className="edit-post__eyebrow">BlogoSphere</p>

            <h1>Edit your post</h1>

            <p>Update your story and keep your readers engaged.</p>
          </div>

          <form
            className="edit-post__form"
            onSubmit={handleUpdate}
          >
            <div className="edit-post__field">
              <label htmlFor="title">Title</label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter your post title"
              />
            </div>

            <div className="edit-post__field">
              <label>Current cover image</label>

              {imageUrl ? (
                <div className="edit-post__current-image">
                  <img src={imageUrl} alt={title} />
                </div>
              ) : (
                <p className="edit-post__no-image">
                  No cover image
                </p>
              )}
            </div>

            <div className="edit-post__field">
              <label htmlFor="image">Replace cover image</label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFile(event.target.files[0] || null)
                }
              />

              {file && (
                <p className="edit-post__file-name">
                  New image: {file.name}
                </p>
              )}
            </div>

            <div className="edit-post__field">
              <label htmlFor="category">Categories</label>

              <div className="edit-post__category-input">
                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="">Select a category</option>

                  {categories.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={addCategory}
                  className="edit-post__add-category"
                >
                  Add
                </button>
              </div>

              {selectedCategories.length > 0 && (
                <div className="edit-post__categories">
                  {selectedCategories.map((item, index) => (
                    <div
                      className="edit-post__category"
                      key={item}
                    >
                      <span>{item}</span>

                      <button
                        type="button"
                        onClick={() => deleteCategory(index)}
                        aria-label={`Remove ${item}`}
                        title={`Remove ${item}`}
                      >
                        <ImCross />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="edit-post__field">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                rows="12"
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
                placeholder="Write your story..."
              />
            </div>

            {error && (
              <p className="edit-post__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="edit-post__submit"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update post"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default EditPost;