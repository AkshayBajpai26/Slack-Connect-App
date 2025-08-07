import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
console.log("✅ ENV LOADED:", process.env.SLACK_CLIENT_ID);

const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SLACK_REDIRECT_URI!;
const TOKEN_FILE = "slack_token.json";
const SCHEDULED_FILE = "scheduled.json";

let GLOBAL_ACCESS_TOKEN = "";

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load access token
if (fs.existsSync(TOKEN_FILE)) {
  const data = fs.readFileSync(TOKEN_FILE, "utf-8");
  const parsed = JSON.parse(data);
  GLOBAL_ACCESS_TOKEN = parsed.access_token;
  console.log("🔑 Access token loaded from file");
}

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Slack OAuth Start
app.get("/auth/slack", (req, res) => {
  const url = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=chat:write,channels:read,channels:join&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

// Slack OAuth Callback
app.get("/auth/slack/callback", async (req, res) => {
  const code = req.query.code as string;

  try {
    const result = await axios.post("https://slack.com/api/oauth.v2.access", null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
    });

    const { access_token, team, authed_user } = result.data;

    console.log("✅ ACCESS TOKEN:", access_token);
    console.log("👥 TEAM:", team?.name);
    console.log("👤 USER:", authed_user?.id);

    GLOBAL_ACCESS_TOKEN = access_token;
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ access_token }, null, 2));
    console.log("💾 Access token saved to file");

    res.send("✅ Slack Connected Successfully! Now go to / to send message.");
  } catch (err) {
    console.error("❌ OAuth Error:", err);
    res.status(500).send("OAuth failed");
  }
});

// Send message immediately
app.post("/send-message", async (req, res) => {
  const { message, channel } = req.body;

  if (!GLOBAL_ACCESS_TOKEN) {
    return res.status(400).send("❌ Access token not found. Please authorize first.");
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channel || "#social",
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${GLOBAL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", response.data);
    res.send("✅ Message sent to Slack!");
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    res.status(500).send("Failed to send message");
  }
});

// Schedule message
app.post("/schedule-message", (req, res) => {
  const { channel, message, scheduledTime } = req.body;
  console.log("🛠 Incoming scheduledTime:", scheduledTime);

  const newMessage = {
    id: uuidv4(),
    channel,
    message,
    scheduledTime,
  };

  let existing = [];
  if (fs.existsSync(SCHEDULED_FILE)) {
    existing = JSON.parse(fs.readFileSync(SCHEDULED_FILE, "utf-8"));
  }

  existing.push(newMessage);
  fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(existing, null, 2));

  console.log("⏳ Message scheduled:", newMessage);
  res.send("✅ Message scheduled successfully.");
});

// Background task to send scheduled messages
setInterval(async () => {
  if (!fs.existsSync(SCHEDULED_FILE)) return;

  const messages = JSON.parse(fs.readFileSync(SCHEDULED_FILE, "utf-8"));
  const now = new Date();
  const remaining: any[] = [];

  for (const msg of messages) {
    const scheduled = new Date(msg.scheduledTime);
    if (scheduled <= now) {
      try {
        const response = await axios.post(
          "https://slack.com/api/chat.postMessage",
          {
            channel: msg.channel,
            text: msg.message,
          },
          {
            headers: {
              Authorization: `Bearer ${GLOBAL_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Scheduled message sent:", response.data);
      } catch (err) {
        console.error("❌ Failed to send scheduled message:", err);
      }
    } else {
      remaining.push(msg);
    }
  }

  fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(remaining, null, 2));
}, 60 * 1000); // Every 1 minute

// View all scheduled messages
app.get("/scheduled-messages", (req, res) => {
  if (!fs.existsSync(SCHEDULED_FILE)) return res.json([]);
  const data = fs.readFileSync(SCHEDULED_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// Cancel a scheduled message
app.post("/cancel-scheduled-message", (req, res) => {
  const { id } = req.body;

  if (!fs.existsSync(SCHEDULED_FILE)) return res.status(404).send("❌ Not found");

  const existing = JSON.parse(fs.readFileSync(SCHEDULED_FILE, "utf-8"));
  const updated = existing.filter((msg: any) => msg.id !== id);

  fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(updated, null, 2));
  res.send("✅ Scheduled message canceled.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔗 Go to http://localhost:${PORT}/auth/slack to authorize the app.`);
});
