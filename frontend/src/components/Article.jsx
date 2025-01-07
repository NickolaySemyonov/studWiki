import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        const response = await fetch(
          `http://localhost:5000/api/articles/${articleId}`
        );
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
      <br />
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      ></div>
    </ContentWrapper>
  );
}
