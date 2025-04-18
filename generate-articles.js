const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

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
    
    // Write the HTML file
    const htmlPath = path.join(articleDir, 'index.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log(`Generated: ${htmlPath}`);
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