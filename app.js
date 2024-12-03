const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mysql = require("mysql");
const hbs = require("express-hbs");

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Database configuration
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bibliotheque",
});
connection.connect(function (err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the database.");
  });

// Handlebars configuration
app.engine(
  "hbs",
  hbs.express4({
    partialsDir: path.join(__dirname, "/views/partials"),
    layoutsDir: path.join(__dirname, "/views/layouts"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// Routes
app.get("/", function (req, res) {
    res.redirect("/books"); // Redirect to the books list
  });
  
// Route: Display all books
app.get("/books", function (req, res) {
  const sql = "SELECT * FROM livres";
  connection.query(sql, function (error, results) {
    if (error) throw error;
    res.render("books", {
      layout: "main",
      books: results,
    });
  });
});

// Route: Add a new book (form page)
app.get("/add-book", function (req, res) {
  res.render("add-book", {
    layout: "main",
  });
});

// Route: Handle form submission
app.post("/add-book", function (req, res) {
  const { titre, auteur, categorie, pages, photo } = req.body;
  const sql = "INSERT INTO livres (titre, auteur, categorie, pages, photo) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql, [titre, auteur, categorie, pages, photo || null], function (error) {
    if (error) throw error;
    res.redirect("/books");
  });
});

app.post("/delete-book", function (req, res) {
    console.log("Delete request received:", req.body);  // Log the request body
    const bookTitre = req.body.titre;
    const sql = "DELETE FROM livres WHERE titre = ?";
    
    connection.query(sql, [bookTitre], function (error) {
      if (error) {
        console.error("Error deleting book:", error);
        res.status(500).send("Error deleting book");
        return;
      }
      res.redirect("/books");
    });
  });
  
  
  
app._router.stack.forEach(function (middleware) {
    if (middleware.route) {
      console.log(middleware.route);
    }
  });
// Start the server
app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port}`);
});


app.use(express.static(path.join(__dirname, "public")));
