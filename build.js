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
    // Create dist directory
    await fs.emptyDir('dist');
    
    // Minify and copy JS
    await minifyJS('script.js', 'dist/script.js');
    
    // Minify and copy CSS
    await minifyCSS('styles.css', 'dist/styles.css');
    
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
    
    console.log('Build completed successfully!');
}

build().catch(console.error); 