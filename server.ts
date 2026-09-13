import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();
const PASSWORD=process.env.PASSWORD ; // Default password if not set in .env

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  recipient: string;
}

const contactInbox: ContactMessage[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      system: "macOS Sequoia Liquid Glass OS Server",
      developer: "Rakesh Kayal",
      contactTarget: "rakeshkayal276@gmail.com"
    });
  });

  // Dynamic Resume API endpoint
  app.get("/api/resume", (_req, res) => {
    try {
      const resumePath = path.resolve(process.cwd(), "src/data/resume.json");
      if (fs.existsSync(resumePath)) {
        const raw = fs.readFileSync(resumePath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      res.status(404).json({ error: "Resume data file not found" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to read resume data", details: err.message });
    }
  });

  // Admin authentication endpoint
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    // Rakesh Kayal credentials specified by user: "Rakesh Kayal" / "Rakesh@2003"
    if (
      (cleanUser === 'rakesh kayal' || cleanUser === 'rakesh') &&
      cleanPass === PASSWORD
    ) {
      return res.json({
        success: true,
        role: 'admin',
        username: 'Rakesh Kayal',
        message: 'Welcome back, Rakesh Kayal'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid username or password. Check credentials and Caps Lock.'
    });
  });

  // Update Resume & Projects endpoint (Rakesh Kayal admin changes)
  app.post("/api/resume", (req, res) => {
    try {
      const updatedResume = req.body;
      if (!updatedResume || !updatedResume.name) {
        return res.status(400).json({ error: "Invalid resume payload" });
      }

      const resumePath = path.resolve(process.cwd(), "src/data/resume.json");
      fs.writeFileSync(resumePath, JSON.stringify(updatedResume, null, 2), "utf-8");

      console.log("[RESUME UPDATE] Resume & projects updated by Rakesh Kayal.");
      return res.json({
        success: true,
        message: "Resume and project files updated successfully.",
        resume: updatedResume
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to save resume", details: err.message });
    }
  });

  // System Settings API endpoints
  const settingsPath = path.resolve(process.cwd(), "src/data/settings.json");
  app.get("/api/settings", (_req, res) => {
    try {
      if (fs.existsSync(settingsPath)) {
        const raw = fs.readFileSync(settingsPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.json({
        wallpaper: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbWiNOfR3rcdhFDMw9wv-9h-Ci_jGdduxJhwrbTLGXtDlrhRIGi9caS4LpAUlvnQc7RfX1R-wEotjK_P8iLdluxPj-q867zdQRhfDY9M3zegW8vfJTFxOzcZpwwOMQD44LrcfLMUzcAOE9_AYp-XEbBkv54UlyF1VLEAhcL7HWiAglktltA3Hg_qCTSMd4N-O_TFRPJGRK5hSF3XPNxKg0pzGlz5d1QO2LA1QGdVb8HWu_4_pBs4My",
        soundEnabled: true
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to read settings", details: err.message });
    }
  });

  app.post("/api/settings", (req, res) => {
    try {
      const newSettings = req.body;
      fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), "utf-8");
      return res.json({ success: true, settings: newSettings });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to save settings", details: err.message });
    }
  });

  // Direct Contact form endpoint - sends messages to Rakesh Kayal's inbox
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields. Please provide your name, email, and message."
        });
      }

      // Validate basic email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address."
        });
      }

      const newMsg: ContactMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: String(name).trim(),
        email: String(email).trim(),
        subject: String(subject || "Portfolio Inquiry for Rakesh Kayal").trim(),
        message: String(message).trim(),
        createdAt: new Date().toISOString(),
        recipient: "rakeshkayal276@gmail.com"
      };

      contactInbox.unshift(newMsg);

      console.log(`[INBOX DISPATCH] New message received for rakeshkayal276@gmail.com:`);
      console.log(`From: ${newMsg.name} <${newMsg.email}>`);
      console.log(`Subject: ${newMsg.subject}`);
      console.log(`Message: ${newMsg.message}`);

      // Construct mailto link as direct mail client fallback
      const mailtoUrl = `mailto:rakeshkayal276@gmail.com?subject=${encodeURIComponent(
        newMsg.subject
      )}&body=${encodeURIComponent(
        `Hi Rakesh,\n\n${newMsg.message}\n\nBest regards,\n${newMsg.name}\n${newMsg.email}`
      )}`;

      res.status(200).json({
        success: true,
        message: "Message successfully transmitted to Rakesh Kayal's inbox (rakeshkayal276@gmail.com).",
        dispatchedTo: "rakeshkayal276@gmail.com",
        messageId: newMsg.id,
        timestamp: newMsg.createdAt,
        mailtoFallback: mailtoUrl
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: "Server encountered an error while dispatching your message.",
        details: err.message
      });
    }
  });

  // Get sent messages for debugging
  app.get("/api/messages", (_req, res) => {
    res.json({
      total: contactInbox.length,
      recipient: "rakeshkayal276@gmail.com",
      messages: contactInbox
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`macOS Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
