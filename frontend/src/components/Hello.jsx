// src/App.jsx
import { useEffect, useState } from "react";

export default function Hello() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch("http://localhost:5000/api/hello");
      const data = await response.json();
      setMessage(data.message);
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Vite React App</h1>
      <p>{message}</p>
    </div>
  );
}
