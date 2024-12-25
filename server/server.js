// server/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
//app.use(bodyParser.json());

// Increase the limit for JSON and URL-encoded payloads
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Sample route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the Node.js server!" });
});

app.post("/api/save", (req, res) => {
  const { title, content, comment } = req.body;
  // Log the data to the console (or you can save it to a database)
  console.log("Received data:", { title, content, comment });
  // Send a response back
  res.status(200).json({ message: "Data received successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
