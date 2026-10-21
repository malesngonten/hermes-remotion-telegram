export async function GET() {
  return new Response(
    JSON.stringify({ status: "ok", service: "hermes-remotion-telegram-webapp" }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
