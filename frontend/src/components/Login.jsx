import React, { useState } from "react";
import ContentWrapper from "./ContentWrapper";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validate
    if (!username || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    setLoading(true); // Устанавливаем состояние загрузки

    try {
      // Отправка данных на сервер
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: username, password: password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка входа. Проверьте свои учетные данные.");
      }

      const data = await response.json();
      console.log("Успешный вход:", data);

      // Здесь вы можете обработать успешный вход, например, сохранить токены

      // Очистка формы
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Сбрасываем состояние загрузки
    }
  };

  return (
    <ContentWrapper>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Вход в систему</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Имя пользователя:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Пароль:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Войти
          </button>
        </form>
      </div>
    </ContentWrapper>
  );
}
