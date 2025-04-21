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

// Read the template
const templatePath = path.join(__dirname, 'articles', 'template.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateContent);

// Function to generate HTML from metadata
function generateArticle(articleDir) {
    const metadataPath = path.join(articleDir, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Generate HTML content
    const htmlContent = template(metadata);
    
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