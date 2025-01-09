import React, { useState } from "react";
import ContentWrapper from "./ContentWrapper";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function DeletionForm() {
  // Пример использования

  const { articleId } = useParams();
  const [annotation, setAnnotation] = useState("");

  const handleInputChange = (e) => {
    setAnnotation(e.target.value);
  };

  const handleSubmit = async () => {
    setAnnotation(""); // Очистка текстового поля после отправки
    const data = { article_id: articleId, user_id: 4, annotation };
    try {
      const response = await fetch(`${apiUrl}/api/actions/save/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-xs">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="inputField"
          >
            Введите комментарий, почему вы хотите удалить эту статью:
          </label>
          <input
            id="inputField"
            type="text"
            value={annotation}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ваш текст..."
          />
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Отправить
          </button>
        </div>
      </div>
    </ContentWrapper>
  );
}
