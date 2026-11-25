
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "family-movie-watchlist-secret";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check whether a Bearer token was provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded user information to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token."
    });
  }
}
