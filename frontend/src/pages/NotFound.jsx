import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container flex-center" style={{ minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ fontSize: "6rem", color: "var(--primary)" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Go Back Home</Link>
    </div>
  );
};

export default NotFound;
