const fs = require('fs-extra');
const path = require('path');

const siteBaseUrl = 'https://roopeshchinnakampalli.com';
const articlesDir = path.join(__dirname, 'articles');
const rssOutputFile = path.join(__dirname, 'rss.xml');

// Function to escape XML special characters
function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

async function generateRssFeed() {
    try {
        const articlesData = [];
        const articleFolders = await fs.readdir(articlesDir);

        for (const folder of articleFolders) {
            const articlePath = path.join(articlesDir, folder);
            const stat = await fs.stat(articlePath);

            if (stat.isDirectory()) {
                const metadataPath = path.join(articlePath, 'metadata.json');
                if (await fs.exists(metadataPath)) {
                    const metadata = await fs.readJson(metadataPath);
                    // Ensure all necessary fields are present
                    if (metadata.title && metadata.slug && metadata.description && metadata.publishedDate) {
                        articlesData.push({
                            title: metadata.title,
                            slug: metadata.slug,
                            description: metadata.description, // Using shortDescription or description
                            publishedDate: metadata.publishedDate, // Expecting ISO 8601 format
                            link: `${siteBaseUrl}/articles/${metadata.slug}/`
                        });
                    } else {
                        console.warn(`Skipping article in ${folder} due to missing metadata fields.`);
                    }
                }
            }
        }

        // Sort articles by publishedDate, newest first
        articlesData.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

        const now = new Date();
        const channelLastBuildDate = now.toUTCString();

        let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Roopesh Chinnakampalli Blog</title>
    <link>${siteBaseUrl}</link>
    <description>Exploring the Future: Insights and Ideas on AI, Technology, Robotics, and Autonomous Vehicles.</description>
    <language>en-us</language>
    <lastBuildDate>${channelLastBuildDate}</lastBuildDate>
    <atom:link href="${siteBaseUrl}/rss.xml" rel="self" type="application/rss+xml" />
`;

        for (const article of articlesData) {
            const articlePubDate = new Date(article.publishedDate).toUTCString();
            rssXml += `
    <item>
        <title>${escapeXml(article.title)}</title>
        <link>${escapeXml(article.link)}</link>
        <guid isPermaLink="true">${escapeXml(article.link)}</guid>
        <pubDate>${articlePubDate}</pubDate>
        <description>${escapeXml(article.description)}</description>
    </item>
`;
        }

        rssXml += `
</channel>
</rss>`;

        await fs.writeFile(rssOutputFile, rssXml.trim());
        console.log(`RSS feed generated: ${rssOutputFile}`);

    } catch (error) {
        console.error('Error generating RSS feed:', error);
    }
}

generateRssFeed();
