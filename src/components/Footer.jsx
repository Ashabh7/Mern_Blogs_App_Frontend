import "../css/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2>BlogoSphere</h2>
          <p>
            A place to discover, write, and share stories.
          </p>
        </div>

        <div className="footer__links">
          <div>
            <h3>Explore</h3>
            <a href="/">Featured Blogs</a>
            <a href="/">Recent Posts</a>
            <a href="/">Most Viewed</a>
          </div>

          <div>
            <h3>Community</h3>
            <a href="/">Forum</a>
            <a href="/">Support</a>
            <a href="/">Readers Choice</a>
          </div>

          <div>
            <h3>Company</h3>
            <a href="/">About Us</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {currentYear} BlogoSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;