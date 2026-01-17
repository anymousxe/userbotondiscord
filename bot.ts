// Run: deno run --allow-net --allow-env bot.ts
import { Client } from "npm:discord.js-selfbot-v13";

const client = new Client({ checkUpdate: false });
const token = Deno.env.get("USER_TOKEN");
const API_URL = "http://localhost:3000/api/chat"; 

client.on("ready", () => {
  console.log(`✅ No cap, ${client.user?.tag} is now live and listening.`);
});

client.on("messageCreate", async (msg) => {
  // 67 mango stuff - ignore other bots and your own messages to prevent loops
  if (msg.author.bot || msg.author.id === client.user?.id) return;

  // Only trigger if you're actually pinged
  if (!msg.mentions.has(client.user!)) return;

  // Clean the ping out of the string
  const prompt = msg.content.replace(/<@!?\d+>/g, "").trim();
  if (!prompt) return;

  console.log(`Input received: ${prompt}`);

  try {
    // Show that "typing..." status so it looks like a real human
    await msg.channel.sendTyping();

    // Call your Next.js API route
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // diddy blud functions - reply to the ping with the AI text
    await msg.reply(data.text);
  } catch (err) {
    console.error("Bot is tweaking:", err);
  }
});

client.login(token);
