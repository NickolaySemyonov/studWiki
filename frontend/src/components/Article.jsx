import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import DOMPurify from "dompurify";
import ContentWrapper from "./ContentWrapper";

export default function Article() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { articleId } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/articles/${articleId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();

        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) return <ContentWrapper>Loading...</ContentWrapper>;
  if (error) return <ContentWrapper>Error: {error}</ContentWrapper>;
  if (!article) return <ContentWrapper>No article found</ContentWrapper>;

  let safeHtml;
  try {
    const parsedDelta = JSON.parse(article.delta); // Предполагая, что контент хранится в формате Delta
    const converter = new QuillDeltaToHtmlConverter(parsedDelta.ops, {});
    const html = converter.convert();
    safeHtml = DOMPurify.sanitize(html);
  } catch (error) {
    safeHtml = <div>Corrupted data (Not Delta format) </div>;
  }

  return (
    <ContentWrapper>
      <h1 className="text-2xl font-bold mb-4 text-center">{article.title}</h1>
      <hr className="h-px my-8 bg-gray-200 border-0" />
      <div>
        <strong>Author: </strong> {article.author}
      </div>
      <div>
        <strong>Last Editor: </strong> {article.editor}
      </div>
      <div>
        <Link to={`/editor/${articleId}`}>
          <button className="w-20 bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition duration-200">
            Edit article
          </button>
        </Link>{" "}
        <Link to={`/delete/${articleId}`}>
          <button className="w-40 bg-red-900  text-white font-semibold py-2 rounded-md hover:bg-red-950 transition duration-200">
            Request to delete
          </button>
        </Link>
      </div>
      <br />
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      ></div>
    </ContentWrapper>
  );
}
