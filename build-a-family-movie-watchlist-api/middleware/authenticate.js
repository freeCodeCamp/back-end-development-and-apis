import jwt from "jsonwebtoken";

// Verifies the `Authorization: Bearer <token>` header on a request. On
// success, the decoded token payload (id, username, role) is attached to
// `req.user` so later middleware/routes can read who is making the request.
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
