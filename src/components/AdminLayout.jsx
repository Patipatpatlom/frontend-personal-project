import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: 20 }}>🔥 ADMIN</h2>

        <Link to="/admin" style={styles.link}>Dashboard</Link>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/shop" style={styles.link}>Shop</Link>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {children}
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: "220px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  link: {
    display: "block",
    color: "white",
    marginBottom: "10px",
    textDecoration: "none",
    padding: "8px",
    borderRadius: "8px",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "#f8fafc",
  },
};