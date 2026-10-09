import "../css/Loader.css";

function Loader() {
  return (
    <div className="loader-wrapper" role="status" aria-label="Loading">
      <div className="loader" />
    </div>
  );
}

export default Loader;