import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import cookieParser from "cookie-parser";

const db = new Database("fitness.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    req.userId = userId;
    next();
  };

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
    
    if (!user) {
      const result = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, password);
      user = { id: result.lastInsertRowid, username };
    } else if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.cookie("userId", user.id, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ id: user.id, username: user.username });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("userId");
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const userId = req.cookies.userId;
    if (!userId) return res.json(null);
    const user = db.prepare("SELECT id, username FROM users WHERE id = ?").get(userId);
    res.json(user);
  });

  app.post("/api/history", authenticate, (req: any, res) => {
    const { plan } = req.body;
    db.prepare("INSERT INTO history (user_id, plan_json) VALUES (?, ?)").run(req.userId, JSON.stringify(plan));
    res.json({ success: true });
  });

  app.get("/api/history", authenticate, (req: any, res) => {
    const history = db.prepare("SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC").all(req.userId);
    res.json(history.map((h: any) => ({
      ...h,
      plan: JSON.parse(h.plan_json)
    })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
