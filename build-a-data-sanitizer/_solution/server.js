const express = require("express");
const { inputCleaner, inputValidator } = require("./middleware");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use("/form", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/form");
});

app.post("/submit", inputCleaner, inputValidator, (req, res) => {
  const { username, comment } = req.body;
  res.send(`
    <h1>Submission Successful</h1>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Comment:</strong> ${comment}</p>
    <a href="/form">Submit another</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}/form`);
});
