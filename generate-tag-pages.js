const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const articlesDir = path.join(__dirname, 'articles');
const tagTemplatePath = path.join(__dirname, 'tag-page-template.html');
const outputDir = path.join(__dirname, 'tags');

async function generateTagPages() {
    try {
        // Read and compile the tag page template
        const templateContent = await fs.readFile(tagTemplatePath, 'utf8');
        const template = Handlebars.compile(templateContent);

        // Object to hold tags and their articles
        const tagsMap = {};

        // Read all article directories
        const articleFolders = await fs.readdir(articlesDir);

        for (const folder of articleFolders) {
            const articlePath = path.join(articlesDir, folder);
            const stat = await fs.stat(articlePath);

            // Process only directories, skip template.html and any other files
            if (stat.isDirectory()) {
                const metadataPath = path.join(articlePath, 'metadata.json');
                if (await fs.exists(metadataPath)) {
                    const metadata = await fs.readJson(metadataPath);
                    if (metadata.tags && metadata.tags.length > 0) {
                        metadata.tags.forEach(tag => {
                            if (!tagsMap[tag]) {
                                tagsMap[tag] = [];
                            }
                            tagsMap[tag].push({
                                title: metadata.title,
                                date: metadata.date,
                                shortDescription: metadata.shortDescription,
                                // Path relative to the root, for linking from tags/tag-name.html
                                path: path.join('articles', folder, 'index.html').replace(/\\/g, '/'),
                                slug: metadata.slug
                            });
                        });
                    }
                }
            }
        }

        // Ensure output directory exists
        await fs.ensureDir(outputDir);

        // Generate a page for each tag
        for (const tag in tagsMap) {
            const articles = tagsMap[tag];
            // Sort articles by date if needed, assuming 'publishedDate' or 'date'
            // For simplicity, using 'date' string as is for now. Proper date sorting would require parsing.
            articles.sort((a, b) => new Date(b.publishedDate || b.date) - new Date(a.publishedDate || a.date));


            const htmlContent = template({ tag, articles });
            // Sanitize tag name for URL: lowercase, replace spaces with hyphens (though current tags are simple)
            const safeTagName = tag.toLowerCase().replace(/\s+/g, '-');
            const outputFilePath = path.join(outputDir, `${safeTagName}.html`);
            await fs.writeFile(outputFilePath, htmlContent);
            console.log(`Generated tag page: ${outputFilePath}`);
        }

    } catch (error) {
        console.error('Error generating tag pages:', error);
    }
}

generateTagPages();
