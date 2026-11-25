
import express from "express";

const app = express();
const port = 3000;

// Homepage
app.get("/", (req, res) => {
  res.send("Welcome to Camper Bot's homepage!");
});

// Hobbies
app.get("/hobbies", (req, res) => {
  res.send("I cycle, go boating, and play guitar.");
});

// Skills
app.get("/skills", (req, res) => {
  res.send("JavaScript, Node.js, and Express.js!");
});

// Profile API
app.get("/api/profile", (req, res) => {
  res.json({
    name: "Camper Bot",
    hobbies: ["cycling", "boating", "guitar"],
    skills: ["JavaScript", "Node.js", "Express.js"]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
