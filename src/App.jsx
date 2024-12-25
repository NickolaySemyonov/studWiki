import { Routes, Route } from "react-router-dom";

import TextEditor from "./components/TextEditor";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Article from "./components/Article";
import Hello from "./components/Hello";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<TextEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/article" element={<Article />} />
          <Route path="/api/hello" element={<Hello />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
