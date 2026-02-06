const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const marked = require('marked');
const minify = require('html-minifier').minify;
const { marked } = require('marked');

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
    preserveLineBreaks: false,
    keepClosingSlash: true,
    customAttrCollapse: /^(media|onload)$/,
    ignoreCustomComments: [/^!/]
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

// Function to generate HTML from metadata
function generateArticle(articleDir) {
    const metadataPath = path.join(articleDir, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Read content from content.html or content.md if it exists, otherwise fall back to metadata.content
    const contentHtmlPath = path.join(articleDir, 'content.html');
    const contentMdPath = path.join(articleDir, 'content.md');
    let articleContent = '';

    if (fs.existsSync(contentHtmlPath)) {
        articleContent = fs.readFileSync(contentHtmlPath, 'utf8');
    } else if (fs.existsSync(contentMdPath)) {
        const markdownContent = fs.readFileSync(contentMdPath, 'utf8');
        articleContent = marked.parse(markdownContent);
    } else if (metadata.content) {
        articleContent = metadata.content;
    } else {
        console.error(`Metadata keys found: ${Object.keys(metadata).join(', ')}`);
        throw new Error(`Content missing for article: ${metadata.title} in ${articleDir}. Checked content.html, content.md and metadata.content.`);
    }

    // Generate body content (the article itself)
    const tagsHTML = metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('\n');

    const bodyContent = `
        <article class="blog-post">
            <h2>${metadata.title}</h2>
            <p class="date">${metadata.date}</p>
            <div class="tags">
                ${tagsHTML}
            </div>
            <div class="content">
                ${articleContent}
            </div>
        </article>
    `;

    // Prepare context for layout
    const context = {
        pageTitle: `${metadata.title} - Roopesh Chinnakampalli`,
        description: metadata.description,
        keywords: metadata.tags.join(', '),
        isArticle: true,
        url: `https://roopeshchinnakampalli.com/articles/${metadata.slug}/`,
        relativePath: '../../', // Since articles are in articles/slug/index.html
        body: bodyContent,
        // Additional meta tags specific to articles can be injected via headContent helper if needed,
        // but for now we'll construct them here
        headContent: `
            <meta name="title" content="${metadata.title} - Roopesh Chinnakampalli">
            <meta name="robots" content="index, follow">
            <meta name="language" content="English">
            <meta name="revisit-after" content="7 days">
            <meta property="article:published_time" content="${metadata.publishedDate}">
            <meta property="article:modified_time" content="${metadata.modifiedDate}">
            <meta property="article:author" content="Roopesh Chinnakampalli">
            ${metadata.tags.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n')}
            <meta property="twitter:card" content="summary_large_image">
            <meta property="twitter:url" content="https://roopeshchinnakampalli.com/articles/${metadata.slug}/">
            <meta property="twitter:title" content="${metadata.title} - Roopesh Chinnakampalli">
            <meta property="twitter:description" content="${metadata.description}">
        `
    };

    // Generate full HTML
    const htmlContent = layoutTemplate(context);
    
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
        .filter(dir => dir !== 'template'); // skip template dir if it exists (though we're removing it)
    
    dirs.forEach(dir => {
        const articleDir = path.join(articlesDir, dir);
        generateArticle(articleDir);
    });
}

// Run the generator
processArticles();