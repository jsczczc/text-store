export async function onRequestPost({ request, env }) {
  try {
    const { id, content } = await request.json();
    const path = `texts/${id}.txt`;

    const api = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${path}`;

    const old = await fetch(api, {
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        "User-Agent": "cloudflare"
      }
    });

    let sha = null;
    if (old.ok) {
      const oldData = await old.json();
      sha = oldData.sha;
    }

    const res = await fetch(api, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "cloudflare"
      },
      body: JSON.stringify({
        message: "save text",
        content: Buffer.from(content).toString("base64"),
        sha
      })
    });

    const result = await res.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
}
