import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext.js";
import api from "../services/api";
import "../css/Home.css";

function Home() {
  const { search } = useLocation();
  const { loading: userLoading } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/posts/${search}`);

        const fetchedPosts = response.data;

        setPosts(fetchedPosts);
        setFilterData(fetchedPosts);
        setNoResults(fetchedPosts.length === 0);

        const uniqueCategories = [
          ...new Set(
            fetchedPosts.flatMap((post) => post.categories || [])
          ),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch posts:", error);

        setPosts([]);
        setFilterData([]);
        setCategories([]);
        setNoResults(false);
        setError("Unable to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [search]);

  function handleCategoryFilter(category) {
    setActiveCategory(category);

    if (category === "All") {
      setFilterData(posts);
      return;
    }

    const filteredPosts = posts.filter((post) =>
      post.categories?.includes(category)
    );

    setFilterData(filteredPosts);
  }

  return (
    <>
      <Navbar />

      <main className="home">
        <section className="home__hero">
          <div className="home__container">
            <p className="home__eyebrow">BlogoSphere</p>

            <h1 className="home__title">
              Stories worth
              <span> reading.</span>
            </h1>

            <p className="home__subtitle">
              Discover ideas, experiences, and perspectives
              from writers around the world.
            </p>
          </div>
        </section>

        <section className="home__container home__content">
          {!userLoading && (
            <div className="home__categories">
              <button
                type="button"
                className={
                  activeCategory === "All"
                    ? "category-button category-button--active"
                    : "category-button"
                }
                onClick={() => handleCategoryFilter("All")}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  className={
                    activeCategory === category
                      ? "category-button category-button--active"
                      : "category-button"
                  }
                  onClick={() => handleCategoryFilter(category)}
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="home__message home__message--error">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          ) : noResults ? (
            <div className="home__message">
              <h2>No posts found</h2>
              <p>
                Try searching for something else or check back
                later.
              </p>
            </div>
          ) : filterData.length === 0 ? (
            <div className="home__message">
              <h2>No posts in this category</h2>
              <p>Try selecting another category.</p>
            </div>
          ) : (
            <div className="home__posts">
              {filterData.map((post) => (
                <HomePosts key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;