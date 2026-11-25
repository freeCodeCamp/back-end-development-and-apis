import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Return current date and time when no date is provided
app.get("/api", (req, res) => {
  const date = new Date();

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Return date information when a date parameter is provided
app.get("/api/:date", (req, res) => {
  const dateParam = req.params.date;

  // Handle numeric Unix timestamps (milliseconds)
  const date = /^\d+$/.test(dateParam)
    ? new Date(Number(dateParam))
    : new Date(dateParam);

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return res.json({
      error: "Invalid Date"
    });
  }

  // Return valid date information
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
