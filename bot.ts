// @ts-nocheck
// Run: deno run --allow-net --allow-env bot.ts
import { Client } from "npm:discord.js-selfbot-v13";

const client = new Client({ checkUpdate: false });
const token = Deno.env.get("USER_TOKEN");
const API_URL = "http://localhost:3000/api/chat"; 

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}. We really out here.`);
});

client.on("messageCreate", async (msg) => {
  // 67 mango stuff - don't reply to bots or yourself
  if (msg.author.bot || msg.author.id === client.user?.id) return;

  // Only trigger if you're pinged
  if (!msg.mentions.has(client.user!)) return;

  const prompt = msg.content.replace(/<@!?\d+>/g, "").trim();
  if (!prompt) return;

  try {
    await msg.channel.sendTyping();

    // diddy blud functions - calling the Next.js API
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    await msg.reply(data.text);
  } catch (err) {
    console.error("Bot logic is cooked:", err);
  }
});

client.login(token);
