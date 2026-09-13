import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Do not change code below this line

// Express 5 (path-to-regexp v7+) dropped the `:date?` optional-param syntax,
// so the empty case (`/api`) and the with-date case (`/api/:date`) are
// registered as two routes sharing the same handler.
function handleDate(req, res) {
  const { date } = req.params;

  // Case 1: no date param at all -> use the current time
  // Case 2: date is all digits (e.g. "1451001600000") -> treat as a unix timestamp (ms)
  // Case 3: any other string (e.g. "2016-12-25" or "05 October 2011") -> parse it,
  //   forcing UTC so the result doesn't shift with the server's local timezone
  //   (non-ISO formats like "05 October 2011" are otherwise parsed as local time)
  const dateObj = !date
    ? new Date()
    : /^\d+$/.test(date)
      ? new Date(Number(date))
      : new Date(`${date} UTC`);

  if (isNaN(dateObj.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() });
}

app.get("/api", handleDate);
app.get("/api/:date", handleDate);

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
