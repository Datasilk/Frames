# Frames
Navigate through a wall of web pages within your favorite web browser.

### Requirements
* Visual Studio 2017

### Features
* View a horizontal list of web pages, each page shrunken down to a manageable size that would allow 4 web pages to be placed side-by-side within a single web browser window.
* Scroll horizontally through the list of web pages, then click one of the web pages to open it in a new browser tab
* Add new web pages to the list
* Rearrange web pages
* Save list into local storage to load again later
    * Select which list to load from local storage

### Under The Hood
Frames uses a headless Chrome window on the server in order to take a full-page screenshot of any URL you supply. Then, the screenshot is displayed as a frame within the horizontal list of web pages. If the live web page changes over time, you'll have to manually update the frame for that web page by clicking a refresh button at the bottom-right hand corner of the frame.