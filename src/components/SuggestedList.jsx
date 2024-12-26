import React, { useEffect, useState } from "react";
import ContentWrapper from "./ContentWrapper";

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function SuggestedList() {
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suggested/all");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSuggestedItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestedItems();
  }, []);

  const manageSuggested = async (data) => {
    console.log(data);
    try {
      const response = await fetch(
        "http://localhost:5000/api/actions/manageSuggested",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log("Data sent successfully");
        alert(`Article has been ${data.status}`);
        setSuggestedItems((prevItems) =>
          prevItems.filter((item) => item.suggested_id !== data.suggested_id)
        );
      } else {
        console.error("Failed to send data");
        alert("Server did not response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <ContentWrapper>Loading...</ContentWrapper>;
  if (error) return <ContentWrapper>Error: {error}</ContentWrapper>;
  if (suggestedItems.length === 0)
    return (
      <ContentWrapper>
        No suggested articles, edits or deletions yet.
      </ContentWrapper>
    );

  return (
    <ContentWrapper>
      <h1 className="text-2xl font-bold mb-4 text-center">Suggested Items</h1>
      <hr className="h-px my-8 bg-gray-200 border-0" />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {suggestedItems.map((item) => (
          <li
            className="flex justify-between items-center p-5 border-solid"
            key={item.suggested_id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <div>
              <strong>User ID:</strong> {item.user_id} <br />
              <strong>Date:</strong> {formatDate(item.date)} <br />
              <strong>Type:</strong> {item.type}
            </div>

            <div className="space-x-4">
              <button
                className="px-2 bg-emerald-600 text-white font-semibold py-2 rounded-md hover:bg-emerald-800 transition duration-200"
                onClick={() =>
                  manageSuggested({
                    type: item.type,
                    suggested_id: item.suggested_id,
                    status: "accepted",
                  })
                }
              >
                Принять
              </button>
              <button
                className="px-2 bg-rose-700 text-white font-semibold py-2 rounded-md hover:bg-rose-900 transition duration-200"
                onClick={() =>
                  manageSuggested({
                    type: item.type,
                    suggested_id: item.suggested_id,
                    status: "declined",
                  })
                }
              >
                Отклонить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </ContentWrapper>
  );
}
