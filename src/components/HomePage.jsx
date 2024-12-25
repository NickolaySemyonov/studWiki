// HomePage.jsx
import React from "react";
import ContentWrapper from "./ContentWrapper";

export default function HomePage() {
  return (
    <ContentWrapper>
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to the Home Page!
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        This is the default home page of your React application. Here, you can
        find some basic information and links to other sections of the site.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li className="text-gray-800">
            <strong>User-Friendly Interface:</strong> Our application is
            designed with the user in mind.
          </li>
          <li className="text-gray-800">
            <strong>Responsive Design:</strong> Works seamlessly on both desktop
            and mobile devices.
          </li>
          <li className="text-gray-800">
            <strong>Dynamic Content:</strong> Enjoy a smooth experience with
            dynamic content loading.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
        <p className="text-gray-700">
          To get started, check out our documentation or reach out to our
          support team.
        </p>
      </section>

      <footer className="mt-10 border-t pt-4 text-center">
        <p className="text-gray-600">
          Thank you for visiting our home page! We hope you find what you're
          looking for.
        </p>
      </footer>
    </ContentWrapper>
  );
}
