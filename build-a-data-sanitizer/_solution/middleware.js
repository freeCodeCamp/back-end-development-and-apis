const inputCleaner = (req, res, next) => {
  if (req.body.username) {
    req.body.username = req.body.username.toLowerCase();
  }
  if (req.body.comment) {
    req.body.comment = req.body.comment.replace(/<[^>]*>/g, "");
  }
  next();
};

const inputValidator = (req, res, next) => {
  const { username } = req.body;
  if (!username || username.length < 3) {
    return res.redirect("/form?error=Username must be at least 3 characters.");
  }
  next();
};

module.exports = { inputCleaner, inputValidator };
