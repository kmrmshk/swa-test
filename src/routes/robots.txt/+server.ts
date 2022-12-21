export async function GET({ url }) {
  return new Response(`\
User-agent: *
Allow: /
Sitemap: https://${ url.host }/sitemap.xml`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}