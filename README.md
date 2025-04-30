# Roopesh Chinnakampalli

A blogging platform designed to share thoughts, ideas, and insights in a clean and distraction-free environment. Built with simplicity in mind, using only vanilla HTML, CSS, and JavaScript.

## Features

- Clean, minimal design
- Light and dark mode support
- Responsive layout
- No graphics or unnecessary elements
- System theme preference detection
- Theme preference persistence
- HTML, CSS, and JavaScript minification for optimal performance
- Development server with live reload
- SEO-friendly meta tags and structure
- Production-ready build process

## Development Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run serve
   ```
4. Open http://localhost:3000 in your web browser

## Available Scripts

- `npm run serve` - Start the development server with live reload
- `npm run generate-articles` - Generate HTML files for all articles
- `npm run generate-index` - Generate the main index page
- `npm run generate-all` - Generate both articles and index page
- `npm run build` - Create a production-ready build in the `dist` folder
- `npm run clean` - Remove the `dist` folder

## Production Build

To create a production-ready build:

1. Run the build command:
   ```bash
   npm run build
   ```
2. The build process will:
   - Create a `dist` directory
   - Minify all JavaScript and CSS files
   - Copy all necessary files (HTML, favicon, etc.)
   - Exclude development files (metadata.json, template.html)
   - Optimize for production deployment

## Adding New Blog Posts

To add a new blog post, follow these steps:

1. Create a new directory inside the `articles` folder. The directory name will be used as the slug for the article URL.
2. Inside the new directory, create a `metadata.json` file with the following structure:
   ```json
   {
       "title": "Your Post Title",
       "slug": "your-post-slug",
       "date": "Month DD, YYYY",
       "publishedDate": "YYYY-MM-DD",
       "modifiedDate": "YYYY-MM-DD",
       "description": "Short description for meta tags",
       "shortDescription": "Short description for the main page",
       "tags": ["tag1", "tag2"],
       "content": "Your article content in HTML format"
   }
   ```
3. Run `npm run generate-all` to generate the article's HTML file and update the main index page.

## Technical Details

- **Minification**: All HTML, CSS, and JavaScript files are automatically minified to reduce file size and improve loading performance
- **Development Server**: Uses lite-server for local development with live reload
- **SEO Optimization**: Includes meta tags for search engines and social media sharing
- **Performance**: Optimized for fast loading with minified assets and efficient CSS
- **Build Process**: Production-ready build system that creates optimized files in the `dist` directory

## Customization

You can customize the colors and styling by modifying the CSS variables in `styles.css`. The theme colors are defined in the `:root` and `[data-theme="dark"]` selectors.

## Browser Support

This site works in all modern browsers that support CSS variables and JavaScript ES6+ features.