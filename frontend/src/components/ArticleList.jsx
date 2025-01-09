import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContentWrapper from "./ContentWrapper";

export default function ArticleList() {
  const [articleList, setArticleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleList = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/articles/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticleList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleList();
  }, []);

  if (loading) return <ContentWrapper>Loading...</ContentWrapper>;
  if (error) return <ContentWrapper>Error: {error}</ContentWrapper>;
  if (articleList.length === 0)
    return <ContentWrapper>No articles</ContentWrapper>;

  return (
    <ContentWrapper>
      <h1 className="text-2xl font-bold mb-4 text-center">All Articles</h1>
      <hr className="h-px my-8 bg-gray-200 border-0" />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {articleList.map((item) => (
          <Link
            key={item.article_id}
            to={`/articles/${item.article_id}`}
            className=" text-lg hover:underline"
          >
            <li
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <strong>{item.title}</strong>
              <div>Author: {item.author}</div>
            </li>
          </Link>
        ))}
      </ul>
    </ContentWrapper>
  );
}
