const fs = require('fs-extra');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function minifyJS(inputPath, outputPath) {
    const code = await fs.readFile(inputPath, 'utf8');
    const result = await minify(code, {
        compress: true,
        mangle: true,
        format: {
            comments: false
        }
    });
    await fs.outputFile(outputPath, result.code);
}

async function minifyCSS(inputPath, outputPath) {
    const code = await fs.readFile(inputPath, 'utf8');
    const result = new CleanCSS({
        level: 2,
        format: 'keep-breaks'
    }).minify(code);
    await fs.outputFile(outputPath, result.styles);
}

async function build() {
    // Ensure dist directory exists
    const distDir = path.resolve(__dirname, 'dist');
    await fs.ensureDir(distDir);
    console.log(`Ensured 'dist' directory exists at: ${distDir}`);
    await fs.emptyDir(distDir); // Still empty it to ensure clean build
    console.log(`Emptied 'dist' directory at: ${distDir}`);
    
    // Minify and copy JS
    await minifyJS('script.js', 'dist/script.js');
    
    // Minify and copy CSS
    await minifyCSS('styles.css', 'dist/styles.css');
    
    // Copy favicon
    await fs.copy('favicon.ico', 'dist/favicon.ico');
    
    // Copy HTML files
    await fs.copy('index.html', 'dist/index.html');
    await fs.copy('articles', 'dist/articles', {
        filter: (src) => {
            return !src.includes('node_modules') && 
                   !src.includes('.git') && 
                   !src.includes('metadata.json') &&
                   !src.includes('template.html');
        }
    });
    
    // Copy tag pages
    if (await fs.exists('tags')) {
        await fs.copy('tags', 'dist/tags');
    }

    // Copy RSS feed
    if (await fs.exists('rss.xml')) {
        await fs.copy('rss.xml', path.join(distDir, 'rss.xml'));
    }

    // Copy sitemap
    if (await fs.exists('sitemap.xml')) {
        await fs.copy('sitemap.xml', path.join(distDir, 'sitemap.xml'));
    }

    // Copy robots.txt
    if (await fs.exists('robots.txt')) {
        await fs.copy('robots.txt', path.join(distDir, 'robots.txt'));
    }

    console.log('Build completed successfully!');

    // Verify crucial files
    const indexHtmlExists = await fs.pathExists(path.join(distDir, 'index.html'));
    console.log(`Verification: dist/index.html exists? ${indexHtmlExists}`);
    const tagPageExists = await fs.pathExists(path.join(distDir, 'tags', 'introduction.html'));
    console.log(`Verification: dist/tags/introduction.html exists? ${tagPageExists}`);
    const rssXmlExists = await fs.pathExists(path.join(distDir, 'rss.xml'));
    console.log(`Verification: dist/rss.xml exists? ${rssXmlExists}`);
    const sitemapXmlExists = await fs.pathExists(path.join(distDir, 'sitemap.xml'));
    console.log(`Verification: dist/sitemap.xml exists? ${sitemapXmlExists}`);
    const robotsTxtExists = await fs.pathExists(path.join(distDir, 'robots.txt'));
    console.log(`Verification: dist/robots.txt exists? ${robotsTxtExists}`);

}

build().catch(console.error); 