export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const api = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/texts/${id}.txt`;

  const res = await fetch(api, {
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      "User-Agent": "cloudflare"
    }
  });

  if (!res.ok) {
    return new Response("未找到该文本", { status: 404 });
  }

  const data = await res.json();
  const text = Buffer.from(data.content, "base64").toString("utf-8");

  return new Response(text);
}
