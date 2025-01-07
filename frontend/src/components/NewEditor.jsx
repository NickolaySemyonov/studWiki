import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Импорт стилей для Quill

export default ArticleViewer = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [articleContent, setArticleContent] = useState(
    "<p>Ваш текст статьи здесь...</p>"
  );

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div>
      <ReactQuill
        value={articleContent}
        onChange={setArticleContent}
        readOnly={!isEditable}
        theme="snow"
      />
      <button onClick={handleEditToggle}>
        {isEditable ? "Сохранить" : "Редактировать"}
      </button>
    </div>
  );
};
