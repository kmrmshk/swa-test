const host = String(import.meta.env.vite_endpoint || '');
const data = [
	{
		"loc": "",
		"changefreq": "weekly"
	},
	{
		"loc": "/notifications",
		"changefreq": "daily"
	},
	{
		"loc": "/games",
		"changefreq": "weekly"
	},
	{
		"loc": "/search",
		"changefreq": "weekly"
	}
];

let urls = '';

data.forEach(item => {
	let content = '';
	Object.entries(item).forEach(p => {
		if(p[0].toLowerCase() === 'loc') {
			p[1] = host + p[1];
		}
		content += `<${ p[0] }>${ p[1] }</${ p[0] }>`;
	});
	urls += `<url>${ content }</url>\n`;
});

export async function GET() {
	return new Response(`\
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
	xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
${ urls }
</urlset>`,
	{
		headers: {
			"Cache-Control": "max-age=0, s-maxage=3600",
			"Content-Type": "application/xml"
		}
	});
}