export async function onRequestPost({ request, env }) {
  const { id, content } = await request.json();
  const path = `texts/${id}.txt`;

  const api = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${path}`;

  const getOld = await fetch(api, {
    headers: { Authorization: `Bearer ${env.GH_TOKEN}` }
  });

  let sha = null;
  if (getOld.ok) {
    const oldData = await getOld.json();
    sha = oldData.sha;
  }

  const res = await fetch(api, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "update text",
      content: btoa(unescape(encodeURIComponent(content))),
      sha
    })
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
