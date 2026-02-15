from playwright.sync_api import sync_playwright

def verify_roadrash_update():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify the article page
        page.goto("file:///app/articles/building-roadrash-browser-ai/index.html")
        page.screenshot(path="verification/article_screenshot.png", full_page=True)
        print("Article screenshot taken.")

        # Verify the index page
        page.goto("file:///app/index.html")
        page.screenshot(path="verification/index_screenshot.png", full_page=True)
        print("Index screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_roadrash_update()
