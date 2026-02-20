import OpenAI from "openai";

/* ================================
   SIMPLE IN-MEMORY STORAGE
================================ */
if (!globalThis.userMemory) {
  globalThis.userMemory = {};
}

export async function handler(event) {

  try {

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ reply: "Method Not Allowed" })
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "AI not configured."
        })
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const body = JSON.parse(event.body || "{}");

    const userId = body.name || "anonymous";

    // Create memory for user if not exists
    if (!globalThis.userMemory[userId]) {
      globalThis.userMemory[userId] = {
        tasks: [],
        conversations: []
      };
    }

    const memory = globalThis.userMemory[userId];

    let systemPrompt = "";
    let userPrompt = "";

    /* =========================
       DAILY TASK WITH MEMORY
    ========================== */

    if (body.type === "daily") {

      const previousTasks = memory.tasks.slice(-3).join("\n");

      systemPrompt = `
You are an elite 100-day transformation coach.

Rules:
- Give ONLY 1 main task.
- Max 25 words.
- Increase difficulty gradually.
- If day divisible by 7 → Weekly Boss Challenge.
- Avoid repeating previous tasks.
- Tone must match personality.
`;

      userPrompt = `
User Goal: ${body.goal}
Personality: ${body.personality}
Day: ${body.day}

Recent Tasks:
${previousTasks}
`;

    }

    /* =========================
       ASSISTANT WITH MEMORY
    ========================== */

    if (body.type === "assistant") {

      const recentConversation = memory.conversations
        .slice(-4)
        .map(c => `${c.role}: ${c.content}`)
        .join("\n");

      systemPrompt = `
You are an intelligent elite AI coach.

Rules:
- Be structured and actionable.
- Under 120 words.
- Adapt tone to personality.
- Use previous conversation context if relevant.
`;

      userPrompt = `
User Goal: ${body.goal}
Personality: ${body.personality}

Recent Conversation:
${recentConversation}

New Question:
${body.question}
`;

    }

    if (!systemPrompt) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Invalid request type." })
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Stay consistent. 🔥";

    /* =========================
       SAVE MEMORY
    ========================== */

    if (body.type === "daily") {
      memory.tasks.push(reply);

      // Keep only last 10 tasks
      if (memory.tasks.length > 10) {
        memory.tasks.shift();
      }
    }

    if (body.type === "assistant") {
      memory.conversations.push(
        { role: "user", content: body.question },
        { role: "assistant", content: reply }
      );

      // Keep only last 10 messages
      if (memory.conversations.length > 10) {
        memory.conversations = memory.conversations.slice(-10);
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };

  } catch (error) {

    console.error("AI ERROR:", error);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: "Temporary AI issue. Stay disciplined. 🔥"
      })
    };
  }
}
