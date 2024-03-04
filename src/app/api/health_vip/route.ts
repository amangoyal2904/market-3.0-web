export async function GET(request: Request) {
  const url = request.url; // Get the full URL
  const res = JSON.stringify({ url: url }); // Create a JSON object with the URL
  return new Response(res, {
    status: 200,
  });
}
