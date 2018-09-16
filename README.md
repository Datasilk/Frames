# Frames
Navigate through a wall of web pages within your favorite web browser.

### Requirements
* Visual Studio 2017
* Headless Chrome server
* Node.js
* Environment variable PATH for `node` and `chrome`

### Installation
* Clone repository `git clone https://github.com/Datasilk/Frames`
* Run command `npm install`
* Make sure to add Google Chrome to your PATH Environment variable (C:\Program Files (x86)\Google\Chrome\Application\)
* Click play in Visual Studio!

![Frames List](http://www.markentingh.com/projects/frames/frames.png)

A list of web page screenshots. Notice that each screenshot shrinks based on the total height of the screenshot.

---

### Features
* View a horizontal list of web pages, each page shrunken down to a manageable size that would allow 4 or 5 web pages to be placed side-by-side within a single web browser window.
* Scroll horizontally through the list of web pages, then click one of the web pages to open it in a new browser tab
* Add new web pages to the list
* Save list into local storage to load again later
    * Select which list to load from local storage

### Future Development
* Create new lists & navigate through each list
  *  popup menu of lists
* Delete frames from a list
* Delete entire lists
* Set initial list
* Export lists to json
* Import lists to local storage from json
* Rearrange web pages

### Under The Hood
Frames uses a headless Chrome window on the server in order to take a full-page screenshot of any URL you supply. Then, the screenshot is displayed as a frame within the horizontal list of web pages. If the live web page changes over time, you'll have to manually update the frame for that web page by clicking a refresh button at the bottom-right hand corner of the frame you wish to update.

#### Disclaimer
This project is meant to be ran in a localized web hosting environment (localhost) due to the fact that the application does not contain any form of user authentication.