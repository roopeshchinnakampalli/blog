const fs = require('fs');
const path = require('path');
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

// Function to read metadata from a directory
function readMetadata(dir) {
    const metadataPath = path.join(dir, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return metadata;
    }
    return null;
}

// Function to generate the HTML for a single article
function generateArticleHTML(metadata) {
    const tagsHTML = metadata.tags.map(tag => {
        const safeTagName = tag.toLowerCase().replace(/\s+/g, '-');
        return `<a href="tags/${safeTagName}.html" class="tag">${tag}</a>`;
    }).join('\n');

    return `
            <article class="blog-post">
                <div class="post-header">
                    <h2><a href="articles/${metadata.slug}/index.html">${metadata.title}</a></h2>
                    <p class="date">${metadata.date}</p>
                    <p class="reading-time">${metadata.readingTime}</p>
                </div>
                <div class="tags">
                    ${tagsHTML}
                </div>
                <p class="description">${metadata.shortDescription}</p>
            </article>`;
}

// Function to generate the complete index.html
function generateIndexHTML(articles) {
    const articlesHTML = articles.map(generateArticleHTML).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="styles.css" as="style">
    <link rel="preload" href="script.js" as="script">
    
    <meta name="description" content="Personal website of Roopesh Chinnakampalli">
    <meta name="keywords" content="blog, robotics, technology, developer, ai, autonomous vehicles, ev, apps, innovation, entrepreneurship, startups, research, education, technology, robotics, autonomous vehicles, electric vehicles, apps, innovation, entrepreneurship, startups, research">
    <meta name="author" content="Roopesh Chinnakampalli">
    <meta property="og:title" content="Roopesh Chinnakampalli">
    <meta property="og:description" content="Personal website of Roopesh Chinnakampalli">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://roopeshchinnakampalli.com">
    <link rel="alternate" type="application/rss+xml" title="Roopesh Chinnakampalli Blog RSS Feed" href="/rss.xml">
    <title>Roopesh Chinnakampalli</title>
    
    <!-- Critical CSS -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Font Awesome CSS -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" as="style">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"></noscript>
</head>
<body>
    <header>
        <nav>
            <h1>Roopesh Chinnakampalli</h1>
            <button id="theme-toggle" aria-label="Toggle dark mode">
                <i class="fas fa-sun"></i>
            </button>
        </nav>
    </header>

    <main>
        <section class="blog-posts">
            ${articlesHTML}
        </section>
    </main>

    <footer>
        <div class="social-links">
            <a href="https://github.com/roopeshchinnakampalli" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
            </a>
            <a href="https://x.com/roopesh_reddy" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-x-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/roopeshreddy/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://instagram.com/roopeshreddyc" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram"></i>
            </a>
        </div>
        <p>Made with ❤️ by <a href="https://github.com/roopeshchinnakampalli">roopesh</a></p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
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
            const markdownPath = path.join(articleDirPath, 'article.md');
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

    // Generate and write the index.html file
    const indexHTML = generateIndexHTML(articles);
    const minifiedHTML = minify(indexHTML, minificationOptions);
    fs.writeFileSync('index.html', minifiedHTML, 'utf8');

    console.log('index.html has been generated and minified successfully!');
}

// Run the generator
generateIndex(); 