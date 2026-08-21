const blacklist = new Set();

export function blacklistToken(token) {
  blacklist.add(token);
}

export function isBlacklisted(token) {
  return blacklist.has(token);
}
