// server/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "studWiki",
  password: "admin",
  port: 5433,
});
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
};
connectDB();

// Middleware
app.use(cors());
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
app.get("/api/suggested/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM suggested_all"); // Представление
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching suggested items:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  const articleId = parseInt(req.params.id);
  // console.log(articleId);
  try {
    const result = await pool.query(
      `
          SELECT * FROM latest_article_versions WHERE article_id = \$1
      `,
      [articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(result.rows[0]); // Возвращаем первую (и единственную) строку
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/articles/", async (req, res) => {
  try {
    const result = await pool.query(
      `
          SELECT article_id, title, author, editor FROM latest_article_versions
      `
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Articles not found" });
    }

    res.json(result.rows); // return ids and titles for articles list
  } catch (error) {
    console.error("Error fetching article list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/actions/save", async (req, res) => {
  const { user_id, title, delta, comment } = req.body;
  // Log the data to the console (or you can save it to a database)
  console.log("Received data:", { user_id, title, delta, comment });

  try {
    // Save the data to PostgreSQL
    const result = await pool.query(
      "INSERT INTO suggested_new (user_id, title, delta, annotation) VALUES ($1, $2, $3,$4) RETURNING *",
      [user_id, title, delta, comment]
    );

    // Send a response back
    res
      .status(200)
      .json({ message: "Data received successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error saving data to PostgreSQL:", error);
    res.status(500).json({ message: "Error saving data", error });
  }
});

app.post("/api/actions/manageSuggested", async (req, res) => {
  console.log(req.body);
  const { type, suggested_id, status } = req.body;

  try {
    // Save the data to PostgreSQL

    let manageSuggestedQuery;

    switch (type) {
      case "new":
        manageSuggestedQuery = `CALL process_suggested_new (\$1,\$2)`;
        break;
      case "edit":
        manageSuggestedQuery = `CALL process_suggested_edit (\$1,\$2)`;
        break;
      case "delete":
        manageSuggestedQuery = `CALL process_suggested_deletion (\$1,\$2)`;
        break;
      default:
        break;
    }

    const result = await pool.query(manageSuggestedQuery, [
      suggested_id,
      status,
    ]);

    // Send a response back
    res.status(200).json({
      message: "Suggstion managed successfully.",
    });
  } catch (error) {
    console.error("Error saving data to PostgreSQL:", error);
    res.status(500).json({ message: "Error saving data", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
