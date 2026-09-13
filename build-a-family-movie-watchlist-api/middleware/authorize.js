// Guards routes that modify a watchlist (add/update/delete a movie).
// A "parent" may modify any user's watchlist. A "child" may only modify
// their own (req.params.userId must match the id from their own token).
// Must run after `authenticate`, since it relies on `req.user`.
export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const { userId } = req.params;

  const isParent = role === "parent";
  const isOwnWatchlist = role === "child" && String(userId) === String(id);

  if (!isParent && !isOwnWatchlist) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}
