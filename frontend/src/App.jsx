import { Routes, Route } from "react-router-dom";

import TextEditor from "./components/TextEditor";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Article from "./components/Article";
import ArticleList from "./components/ArticleList";
import SuggestedList from "./components/SuggestedList";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 pl-calc-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<TextEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/articles/" element={<ArticleList />} />
          <Route path="/articles/:articleId" element={<Article />} />
          <Route path="/suggested/all" element={<SuggestedList />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
