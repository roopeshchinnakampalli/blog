# Roopesh Chinnakampalli

A blogging platform designed to share thoughts, ideas, and insights in a clean and distraction-free environment. Built with simplicity in mind, using only vanilla HTML, CSS, and JavaScript.

## Features

- Clean, minimal design
- Light and dark mode support
- Responsive layout
- No graphics or unnecessary elements
- System theme preference detection
- Theme preference persistence

## How to Use

1. Clone this repository
2. Open `index.html` in your web browser
3. Click the "Dark Mode" button in the top-right corner to toggle between light and dark themes

## Adding New Blog Posts

To add a new blog post, follow these steps:

1. Create a new directory inside the `articles` folder. The directory name will be used as the slug for the article URL.
2. Inside the new directory, create a `metadata.json` file with the following structure:
   ```json
   {
       "title": "Your Post Title",
       "slug": "your-post-slug",
       "publishedDate": "YYYY-MM-DD",
       "modifiedDate": "YYYY-MM-DD",
       "tags": ["tag1", "tag2"]
   }
   ```
3. Add the content of your article in an `index.html` file inside the same directory. Use the `template.html` file in the `articles` folder as a reference for the structure.
4. Run the script `generate-articles.js` to generate the article's HTML file.
5. Run the script `generate-index.js` to update the main index page with the new article.

## Customization

You can customize the colors and styling by modifying the CSS variables in `styles.css`. The theme colors are defined in the `:root` and `[data-theme="dark"]` selectors.

## Browser Support

This site works in all modern browsers that support CSS variables and JavaScript ES6+ features.