
export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const { userId } = req.params;

  // Parents can modify any user's watchlist.
  // Children can only modify their own watchlist.
  if (
    role !== "parent" &&
    (role !== "child" || String(userId) !== String(id))
  ) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  next();
}
