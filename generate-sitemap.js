const fs = require('fs-extra');
const path = require('path');

const SITE_URL = 'https://roopeshchinnakampalli.com';

async function generateSitemap() {
    console.log('Generating sitemap...');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // 1. Homepage
    sitemap += `
    <url>
        <loc>${SITE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // 2. Articles
    const articlesDir = path.join(__dirname, 'articles');
    if (await fs.exists(articlesDir)) {
        const articleDirs = await fs.readdir(articlesDir);
        for (const dir of articleDirs) {
            const dirPath = path.join(articlesDir, dir);
            const stat = await fs.stat(dirPath);
            if (stat.isDirectory()) {
                const metadataPath = path.join(dirPath, 'metadata.json');
                if (await fs.exists(metadataPath)) {
                    const metadata = await fs.readJson(metadataPath);
                    // Use modifiedDate if available, else publishedDate
                    const lastMod = metadata.modifiedDate || metadata.publishedDate;

                    // Format date to YYYY-MM-DD if valid, else ignore lastmod
                    let dateStr = '';
                    if (lastMod) {
                         try {
                             dateStr = new Date(lastMod).toISOString().split('T')[0];
                         } catch (e) {
                             console.warn(`Invalid date for article ${metadata.title}: ${lastMod}`);
                         }
                    }

                    sitemap += `
    <url>
        <loc>${SITE_URL}/articles/${metadata.slug}/</loc>`;
                    if (dateStr) {
                        sitemap += `
        <lastmod>${dateStr}</lastmod>`;
                    }
                    sitemap += `
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
                }
            }
        }
    }

    // 3. Tags
    const tagsDir = path.join(__dirname, 'tags');
    if (await fs.exists(tagsDir)) {
        const tagFiles = await fs.readdir(tagsDir);
        for (const file of tagFiles) {
            if (file.endsWith('.html')) {
                sitemap += `
    <url>
        <loc>${SITE_URL}/tags/${file}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`;
            }
        }
    }

    sitemap += `
</urlset>`;

    await fs.writeFile('sitemap.xml', sitemap.trim());
    console.log('sitemap.xml generated successfully.');
}

generateSitemap().catch(console.error);
