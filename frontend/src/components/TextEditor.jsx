import React, { useRef, useState } from "react";
import Editor from "./Editor";
import Quill from "quill";
import ContentWrapper from "./ContentWrapper";

const Delta = Quill.import("delta");

const getStringifiedDelta = (quillReference) => {
  // Get editor contents converted to Delta object
  var delta = quillReference.current?.getContents();
  console.log(delta);
  // Convert Delta to JSON string
  var jsonDelta = JSON.stringify(delta);
  console.log(jsonDelta);
  return jsonDelta;
};

const setDeltaFromJSON = (quillReference, jsonDelta) => {
  // Convert JSON string to Delta object
  var parsedDelta = JSON.parse(jsonDelta);
  // Set the Delta object into the Quill editor
  quillReference.current?.setContents(parsedDelta);
};

export default function MyEditor() {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const delta = getStringifiedDelta(quillRef);
    const data = {
      user_id: 4,
      title,
      delta,
      comment,
    };

    try {
      const response = await fetch("http://localhost:5000/api/actions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        alert(jsonResponse.message);
      } else {
        console.error("Failed to send data");
        alert("Возникла ошибка! Статья НЕ была отправлена в предложку");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ContentWrapper>
      <h1 className="text-2xl font-bold mb-4 text-center">Editor</h1>
      <hr className="h-px my-8 bg-gray-200 border-0" />
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Article Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter your article title here..."
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Editor
          ref={quillRef}
          readOnly={readOnly}
          defaultValue={new Delta()
            .insert("Hello")
            .insert("\n", { header: 1 })
            .insert("Some ")
            .insert("initial", { bold: true })
            .insert(" ")
            .insert("content", { underline: true })
            .insert("\n")}
        />

        <br />
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Comment:
        </label>
        <input
          type="text"
          id="comment"
          name="comment"
          placeholder="Please, leave a comment..."
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </ContentWrapper>
  );
}
