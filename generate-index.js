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
    const tagsHTML = metadata.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('\n');

    return `
            <article class="blog-post">
                <div class="post-header">
                    <h2><a href="articles/${metadata.slug}">${metadata.title}</a></h2>
                    <p class="date">${metadata.date}</p>
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
    <meta name="description" content="Personal website of Roopesh Chinnakampalli">
    <meta name="keywords" content="blog, robotics, technology, developer, ai, autonomous vehicles, ev, apps, innovation, entrepreneurship, startups, research, education, technology, robotics, autonomous vehicles, electric vehicles, apps, innovation, entrepreneurship, startups, research">
    <meta name="author" content="Roopesh Chinnakampalli">
    <meta property="og:title" content="Roopesh Chinnakampalli">
    <meta property="og:description" content="Personal website of Roopesh Chinnakampalli">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://roopeshchinnakampalli.com">
    <title>Roopesh Chinnakampalli</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
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
        const metadata = readMetadata(path.join(articlesDir, dir));
        if (metadata) {
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