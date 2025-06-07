const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const marked = require('marked');
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
    minifyJS: true,
    // Preserve these attributes for performance optimization
    preserveLineBreaks: false,
    keepClosingSlash: true,
    customAttrCollapse: /^(media|onload)$/,
    ignoreCustomComments: [/^!/]
};

// Read the template
const templatePath = path.join(__dirname, 'articles', 'template.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateContent);

// Function to generate HTML from metadata
function generateArticle(articleDir) {
    const metadataPath = path.join(articleDir, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    const markdownPath = path.join(articleDir, 'article.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');

    // Calculate reading time
    const textContent = markdownContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/---(.*?)---/s, ''); // Strip HTML/MD tags and front matter
    const words = textContent.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const wpm = 225; // Average words per minute
    const minutes = Math.max(1, Math.round(wordCount / wpm)); // Ensure at least 1 min
    const readingTimeText = minutes + " min read";

    const htmlFromMarkdown = marked.parse(markdownContent);

    // Generate HTML content
    const articleData = { ...metadata, content: htmlFromMarkdown, readingTime: readingTimeText };
    const htmlContent = template(articleData);
    
    // Minify the HTML content
    const minifiedHTML = minify(htmlContent, minificationOptions);
    
    // Write the HTML file
    const htmlPath = path.join(articleDir, 'index.html');
    fs.writeFileSync(htmlPath, minifiedHTML);
    
    console.log(`Generated and minified: ${htmlPath}`);
}

// Function to process all articles
function processArticles() {
    const articlesDir = path.join(__dirname, 'articles');
    const dirs = fs.readdirSync(articlesDir)
        .filter(item => fs.statSync(path.join(articlesDir, item)).isDirectory())
        .filter(dir => dir !== 'template');
    
    dirs.forEach(dir => {
        const articleDir = path.join(articlesDir, dir);
        generateArticle(articleDir);
    });
}

// Run the generator
processArticles(); 