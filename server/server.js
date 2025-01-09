// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT; // process.env.PORT||5000
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWD,
  port: process.env.DB_PORT,
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
//app.use(cors());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5001", // Access from only this domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow cookies
  })
);

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
app.get("/api/suggested/all", authenticateToken, async (req, res) => {
  const { id, nickname, role } = req.user;
  if (role !== "Admin") return res.status(403);

  try {
    const result = await pool.query("SELECT * FROM suggested_all"); // VIEW
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching suggested items:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.get("/api/articles/:id", authenticateToken, async (req, res) => {
  const { id, nickname, role } = req.user;
  if (role === "Banned") return res.status(403);

  const articleId = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `
          SELECT * FROM latest_article_versions WHERE article_id = $1
      `,
      [articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(result.rows[0]); // Возвращаем первую (и единственную) запись
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/articles/", authenticateToken, async (req, res) => {
  const { id, nickname, role } = req.user;

  if (role === "Banned") return res.status(403);
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

app.post("/api/actions/save/:type", authenticateToken, async (req, res) => {
  const { article_id, title, delta, annotation } = req.body;
  const user = req.user;

  let chooseTableToSave;
  let values;
  const { id, nickname, role } = user;
  //console.log(user);
  if (role === "Banned") return res.status(403);
  switch (req.params.type) {
    case "new":
      chooseTableToSave =
        "INSERT INTO suggested_new (user_id, title, delta, annotation) VALUES ($1, $2, $3, $4)";
      values = [id, title, delta, annotation];
      break;
    case "edit":
      chooseTableToSave =
        "INSERT INTO suggested_edit (article_id, user_id, title, delta, annotation) VALUES ($1, $2, $3, $4, $5)";
      values = [article_id, id, title, delta, annotation];
      break;
    case "delete":
      chooseTableToSave =
        "INSERT INTO suggested_deletion (article_id, user_id, annotation) VALUES ($1, $2, $3)";
      values = [article_id, id, annotation];
      break;
    default:
      break;
  }

  try {
    const result = await pool.query(chooseTableToSave, values);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error saving data to PostgreSQL:", error);
    res.status(500).json({ message: "Error saving data", error });
  }
});

app.post(
  "/api/actions/manageSuggested",
  authenticateToken,
  async (req, res) => {
    //console.log(req.body);
    const { id, nickname, role } = req.user;
    const { type, suggested_id, status } = req.body;
    if (role !== "Admin") return res.status(403);
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
        case "deletion":
          manageSuggestedQuery = `CALL process_suggested_deletion (\$1,\$2)`;
          break;
        default:
          break;
      }

      const result = await pool.query(manageSuggestedQuery, [
        suggested_id,
        status,
      ]);

      res.status(200).json({
        message: "Suggstion managed successfully.",
      });
    } catch (error) {
      console.error("Error saving data to PostgreSQL:", error);
      res.status(500).json({ message: "Error saving data", error });
    }
  }
);

app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;
  console.log(req.body);

  try {
    //trying to get user data
    const result = await pool.query(
      "SELECT * FROM get_user_by_credentials($1, $2)",
      [login, password]
    );
    const { o_id, o_nickname, o_role_name } = result.rows[0];
    // check if not null
    if (o_id && o_nickname && o_role_name) {
      const accessToken = generateAccessToken(o_id, o_nickname, o_role_name);
      const refreshToken = generateRefreshToken(o_id);

      // Set cookies with HTTP-only flags
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production", // Use secure in production
        sameSite: "Strict",
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production", // Use secure in production
        sameSite: "Strict",
        maxAge: 10 * 60 * 1000, //7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: `${o_nickname} logged in as ${o_role_name}`,
        //accessToken,
      });
    } else {
      res.status(401).json({ message: "invalid data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken; // Read token from cookies
  console.log(accessToken);

  if (!accessToken) return res.sendStatus(401); // Unauthorized

  jwt.verify(accessToken, JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    console.log(user);
    next();
  });
}

function generateAccessToken(id, nickname, role) {
  return jwt.sign({ id, nickname, role }, JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
}
function generateRefreshToken(id) {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: "10m" });
}

app.post("/api/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    const accessToken = generateAccessToken(user.id, user.nickname, user.role);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
    res.status(200).json({ accessToken });
  });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(204); // No Content
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
