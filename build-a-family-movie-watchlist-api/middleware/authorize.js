export function authorizeModification(req, res, next) {
  const { id, role } = req.user;

  if (
    role !== "parent" &&
    !(role === "child" && String(id) === String(req.params.userId))
  ) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  next();
}