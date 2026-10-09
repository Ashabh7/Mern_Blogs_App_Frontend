import { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/CreatePost.css";

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

function CreatePost() {
  const { user, loading: userLoading } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function addCategory() {
    if (!category) {
      return;
    }

    if (selectedCategories.includes(category)) {
      return;
    }

    setSelectedCategories((previous) => [...previous, category]);
    setCategory("");
  }

  function deleteCategory(index) {
    setSelectedCategories((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  async function handleCreate(event) {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    if (!title.trim() || !desc.trim()) {
      setError("Please enter a title and description.");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    setLoading(true);

    try {
      let photo = "";

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

      const response = await api.post("/api/posts/create", post);

      navigate(`/posts/post/${response.data._id}`);
    } catch (error) {
      console.error("Failed to create post:", error);

      setError(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : "Unable to create the post. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  if (userLoading) {
    return (
      <>
        <Navbar />

        <main className="create-post">
          <div className="create-post__message">
            <p>Loading...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="create-post">
          <div className="create-post__message">
            <h1>Login required</h1>
            <p>You need to log in before creating a post.</p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="create-post__message-button"
            >
              Go to Login
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="create-post">
        <div className="create-post__container">
          <div className="create-post__header">
            <p className="create-post__eyebrow">BlogoSphere</p>

            <h1>Create a post</h1>

            <p>
              Share an idea, experience, or story with the
              community.
            </p>
          </div>

          <form
            className="create-post__form"
            onSubmit={handleCreate}
          >
            <div className="create-post__field">
              <label htmlFor="title">Title</label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter your post title"
              />
            </div>

            <div className="create-post__field">
              <label htmlFor="image">Cover image</label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFile(event.target.files[0] || null)
                }
              />

              {file && (
                <p className="create-post__file-name">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="create-post__field">
              <label htmlFor="category">Categories</label>

              <div className="create-post__category-input">
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
                  className="create-post__add-category"
                >
                  Add
                </button>
              </div>

              {selectedCategories.length > 0 && (
                <div className="create-post__categories">
                  {selectedCategories.map((item, index) => (
                    <div
                      className="create-post__category"
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

            <div className="create-post__field">
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
              <p className="create-post__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="create-post__submit"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish post"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CreatePost;