import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

// Every watchlist route requires a valid, logged-in user.
router.use(authenticate);

// Any authenticated user can read any user's watchlist.
router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));
  if (!watchlist) {
    return res.status(404).json({ error: "User not found." });
  }
  res.status(200).json(watchlist);
});

// Adding/updating/deleting a movie is only allowed for a parent, or a
// child acting on their own watchlist - enforced by authorizeModification.
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(Number(req.params.userId), req.body);
  if (!movie) {
    return res.status(404).json({ error: "User not found." });
  }
  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body,
  );
  if (!movie) {
    return res.status(404).json({ error: "Movie not found." });
  }
  res.status(200).json(movie);
});

router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const deleted = deleteMovie(
      Number(req.params.userId),
      Number(req.params.movieId),
    );
    if (!deleted) {
      return res.status(404).json({ error: "Movie not found." });
    }
    res.status(200).json({ success: true });
  },
);

export default router;
