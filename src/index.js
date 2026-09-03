export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const data = await request.json();
        
        await env.DB.prepare(
          `INSERT INTO surveys (id, time, building, floor, room, category, rating, notes, syncStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.uuid,
          data.time,
          data.building,
          data.floor,
          data.room,
          data.category,
          data.rating,
          data.notes,
          data.syncStatus
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    return new Response("VKU Survey D1 Worker is running!", { status: 200 });
  },
};