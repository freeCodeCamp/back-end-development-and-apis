import fs from "fs";
import path from "path";

const DB_PATH = path.join(import.meta.dirname, "../data/users.json");

export function readUsers() {
  const data = fs.readFileSync(DB_PATH, "utf-8").trim();
  if (!data) return [];
  return JSON.parse(data);
}

export function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function findByEmail(email) {
  return readUsers().find((u) => u.email === email) || null;
}

export function findById(id) {
  return readUsers().find((u) => u.id === id) || null;
}
