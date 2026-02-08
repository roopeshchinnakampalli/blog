const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const minify = require('html-minifier').minify;

// Minification options
const minificationOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
};

// Register partials
const headerPartial = fs.readFileSync(path.join(__dirname, 'templates', 'partials', 'header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(__dirname, 'templates', 'partials', 'footer.html'), 'utf8');
Handlebars.registerPartial('header', headerPartial);
Handlebars.registerPartial('footer', footerPartial);

// Read and compile layout
const layoutPath = path.join(__dirname, 'templates', 'layout.html');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const layoutTemplate = Handlebars.compile(layoutContent);

// Function to read metadata from a directory
function readMetadata(dir) {
    const metadataPath = path.join(dir, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return metadata;
    }
    return null;
}

// Function to generate the HTML for a single article list item
function generateArticleListItem(metadata) {
    // New simplified format: Title + Date only
    return `
            <article class="blog-post">
                <div class="post-header">
                    <h2><a href="articles/${metadata.slug}/index.html">${metadata.title}</a></h2>
                    <div class="meta">
                        <span class="date">${metadata.date}</span>
                        <span class="reading-time">${metadata.readingTime}</span>
                    </div>
                </div>
                <p>${metadata.shortDescription || metadata.description}</p>
            </article>`;
}

// Main function to generate the index
function generateIndex() {
    const articlesDir = path.join(__dirname, 'articles');
    const articles = [];

    // Read all directories in the articles folder
    const dirs = fs.readdirSync(articlesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Read metadata from each article directory
    for (const dir of dirs) {
        const articleDirPath = path.join(articlesDir, dir);
        const metadata = readMetadata(articleDirPath);
        if (metadata) {
            // Calculate reading time
            let markdownPath = path.join(articleDirPath, 'article.md');
            if (!fs.existsSync(markdownPath)) {
                markdownPath = path.join(articleDirPath, 'content.md');
            }

            if (fs.existsSync(markdownPath)) {
                const markdownContent = fs.readFileSync(markdownPath, 'utf8');
                const textContent = markdownContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/---(.*?)---/s, ''); // Strip HTML/MD tags and front matter
                const words = textContent.split(/\s+/).filter(Boolean);
                const wordCount = words.length;
                const wpm = 225; // Average words per minute
                const minutes = Math.max(1, Math.round(wordCount / wpm)); // Ensure at least 1 min
                metadata.readingTime = minutes + " min read";
            } else {
                metadata.readingTime = ""; // Or some default if article.md is missing
            }
            articles.push(metadata);
        }
    }

    // Sort articles by date (newest first)
    articles.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    // Generate articles list HTML
    const articlesHTML = articles.map(generateArticleListItem).join('\n');

    // Wrap in section
    const bodyContent = `
        <section class="blog-posts">
            ${articlesHTML}
        </section>
    `;

    // Prepare JSON-LD
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://roopeshchinnakampalli.com/",
        "name": "Roopesh Chinnakampalli",
        "author": {
            "@type": "Person",
            "name": "Roopesh Chinnakampalli"
        },
        "description": "Personal website of Roopesh Chinnakampalli"
    };

    const jsonLd = `<script type="application/ld+json">
${JSON.stringify(jsonLdData, null, 4)}
</script>`;

    // Prepare context for layout
    const context = {
        pageTitle: 'Roopesh Chinnakampalli',
        description: 'Personal website of Roopesh Chinnakampalli',
        keywords: 'blog, robotics, technology, developer, ai, autonomous vehicles, ev, apps, innovation, entrepreneurship, startups, research, education, technology, robotics, autonomous vehicles, electric vehicles, apps, innovation, entrepreneurship, startups, research',
        isArticle: false,
        url: 'https://roopeshchinnakampalli.com',
        relativePath: '',
        body: bodyContent,
        jsonLd: jsonLd
    };

    // Generate full HTML
    const fullHTML = layoutTemplate(context);
    const minifiedHTML = minify(fullHTML, minificationOptions);
    fs.writeFileSync('index.html', minifiedHTML, 'utf8');

    console.log('index.html has been generated and minified successfully!');
}

// Run the generator
generateIndex();