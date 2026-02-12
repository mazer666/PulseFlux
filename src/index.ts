export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/health") {
      return new Response("ok", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    return new Response(
      "SwapPuzzle deployment is online. Configure a Next.js-compatible Cloudflare build step to serve the full app.",
      {
        headers: { "content-type": "text/plain; charset=utf-8" },
      },
    );
  },
};
