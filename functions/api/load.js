export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const api = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/texts/${id}.txt`;

  const res = await fetch(api, {
    headers: { Authorization: `Bearer ${env.GH_TOKEN}` }
  });

  const data = await res.json();
  const text = decodeURIComponent(escape(atob(data.content)));

  return new Response(text);
}
