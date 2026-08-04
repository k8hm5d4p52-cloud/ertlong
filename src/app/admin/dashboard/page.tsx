"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SUPABASE_URL = "https://uwmvkdxkpmwimsmtpttn.supabase.co";
const SUPABASE_ANON_KEY = proces…_KEY || "";

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("ertlong_admin");
    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }
    setLoggedIn(true);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ertlong_admin");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the ERTlong Admin Panel!</p>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Orders</h3>
          <p>Manage customer orders</p>
          <button style={styles.button}>View Orders</button>
        </div>
        <div style={styles.card}>
          <h3>Products</h3>
          <p>Manage product inventory</p>
          <button style={styles.button}>Manage Products</button>
        </div>
        <div style={styles.card}>
          <h3>Users</h3>
          <p>Manage registered users</p>
          <button style={styles.button}>View Users</button>
        </div>
        <div style={styles.card}>
          <h3>Settings</h3>
          <p>Configure system settings</p>
          <button style={styles.button}>Settings</button>
        </div>
      </div>
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  logoutBtn: {
    marginTop: "30px",
    padding: "10px 30px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
