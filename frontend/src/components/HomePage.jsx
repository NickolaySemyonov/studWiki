// HomePage.jsx
import React from "react";
import ContentWrapper from "./ContentWrapper";

export default function HomePage() {
  return (
    <ContentWrapper>
      <h1 className="text-4xl font-bold text-center mb-6">
        Добро пожаловать!
      </h1>
      <p className="text-lg text-gray-700 mb-4">
      Добро пожаловать на главную страницу нашей студенческой вики! 
      Здесь вы найдете полезную информацию, ресурсы и ссылки, которые помогут вам в учебе.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Описание системы
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li className="text-gray-800">
            <strong>Дружественный интерфейс</strong> Приложение разработано согласно пользовательским потребностям.
          </li>
          <li className="text-gray-800">
            <strong>Адаптивный дизайн:</strong> Приложение работает на всех типах устройств.
          </li>
          <li className="text-gray-800">
            <strong>Возможности влиять на контент:</strong> Пользователь имеет право отправлять в предложку запросы на создание, редактирование и удаление статей.
          </li>
        </ul>
      </section>

      <footer className="mt-10 border-t pt-4 text-center">
        <p className="text-gray-600">
          Спасибо!.
        </p>
      </footer>
    </ContentWrapper>
  );
}
