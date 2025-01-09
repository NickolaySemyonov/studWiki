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

  // const fetchSuggestedItems = async () => {
  //   try {
  //     const apiUrl = import.meta.env.VITE_API_BASE_URL;
  //     const response = await fetch(`${apiUrl}/api/suggested/all`, {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setSuggestedItems(data);
  //     } else if (response.status === 401) {
  //       try {
  //         const response = await fetch(`${apiUrl}/api/token`, {
  //           method: "POST",
  //           credentials: "include", // Включает куки в запрос
  //         });
  //         if (response.ok)
  //           await fetch(`${apiUrl}/api/suggested/all`, {
  //             method: "GET",
  //             credentials: "include",
  //           });
  //         else if (response.status === 401) {
  //           setError("Log in as Admin to view this page");
  //         }
  //       } catch (error) {
  //         setError(error.message);
  //       }
  //     } else {
  //       throw new Error("Network response was not ok");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchSuggestedItems();
  // }, []);

  const fetchSuggestedItems = async () => {
    setLoading(true); // Start loading

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetchSuggestedItemsFromApi(apiUrl);

      if (response.ok) {
        const data = await response.json();
        setSuggestedItems(data);
      } else if (response.status === 401) {
        await handleUnauthorized(apiUrl);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchSuggestedItemsFromApi = async (apiUrl) => {
    return await fetch(`${apiUrl}/api/suggested/all`, {
      method: "GET",
      credentials: "include",
    });
  };

  const handleUnauthorized = async (apiUrl) => {
    try {
      const tokenResponse = await refreshAuthToken(apiUrl);

      if (tokenResponse.ok) {
        const retryResponse = await fetchSuggestedItemsFromApi(apiUrl);
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          setSuggestedItems(data);
        } else if (retryResponse.status === 401) {
          setError("Log in as Admin to view this page");
        }
      } else {
        setError("Failed to refresh token");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const refreshAuthToken = async (apiUrl) => {
    return await fetch(`${apiUrl}/api/token`, {
      method: "POST",
      credentials: "include",
    });
  };

  useEffect(() => {
    fetchSuggestedItems();
  }, []);

  const manageSuggested = async (data) => {
    console.log(data);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/actions/manageSuggested`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data sent successfully");
        //alert(`Article has been ${data.status}`);
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
              <strong>Type:</strong> {item.type}
              <br />
              <strong>User:</strong> {item.user_nickname} <br />
              <strong>Date:</strong> {formatDate(item.date)} <br />
              <strong>Annotation: </strong>
              <br />
              <span className="break-normal mt-2">{item.annotation}</span>
            </div>

            <div className="flex space-x-4 ">
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
                className=" bg-rose-700 text-white font-semibold py-2 rounded-md hover:bg-rose-900 transition duration-200"
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
