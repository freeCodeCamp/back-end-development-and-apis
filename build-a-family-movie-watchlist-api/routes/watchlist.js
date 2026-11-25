
import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

const router = express.Router();

// Require authentication for all watchlist routes
router.use(authenticate);

// GET: Retrieve a user's watchlist
router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  return res.status(200).json(watchlist);
});

// POST: Add a movie
router.post(
  "/:userId/movies",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const { title, genre } = req.body;

    const movie = addMovie(userId, {
      title,
      genre
    });

    if (movie === null) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    return res.status(201).json(movie);
  }
);

// PUT: Update a movie
router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const updatedMovie = updateMovie(
      userId,
      movieId,
      req.body
    );

    if (updatedMovie === null) {
      return res.status(404).json({
        error: "Movie or user not found"
      });
    }

    return res.status(200).json(updatedMovie);
  }
);

// DELETE: Remove a movie
router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const deleted = deleteMovie(userId, movieId);

    if (!deleted) {
      return res.status(404).json({
        error: "Movie or user not found"
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully"
    });
  }
);

export default router;
