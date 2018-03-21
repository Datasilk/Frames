// source code taken from https://gist.github.com/schnerd/b5f9b248d84ce147d43ca292de30ada1#file-index-js

// Used to generate full-page screenshots of web pages using headless Chrome
// in command-prompt:
// nodejs chrome.js --url= "http://www.markentingh.com" --full

// make sure you are running headless chrome on port 9222
// in command-prompt:
//chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu

const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const file = require('fs');

// CLI Args
console.log(argv.url);
const url = argv.url || 'https://www.google.com';
const format = argv.format || 'png';
const filename = argv.filename || 'output.' + format;
const viewportWidth = argv.viewportWidth || 1920;
const viewportHeight = argv.viewportHeight || 1080;
const delay = argv.delay || 100;
const userAgent = argv.userAgent;
const fullPage = argv.full;

// Start the Chrome Debugging Protocol
CDP(async function (client) {
    // Extract used DevTools domains.
    const { DOM, Emulation, Network, Page, Runtime } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();

    // If user agent override was specified, pass to Network domain
    if (userAgent) {
        await Network.setUserAgentOverride({ userAgent });
    }

    // Set up viewport resolution, etc.
    const deviceMetrics = {
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 0,
        mobile: false,
        fitWindow: false,
    };
    await Emulation.setDeviceMetricsOverride(deviceMetrics);
    await Emulation.setVisibleSize({ width: viewportWidth, height: viewportHeight });

    // Navigate to target page
    await Page.navigate({ url });

    // Wait for page load event to take screenshot
    Page.loadEventFired(async () => {
        // If the `full` CLI option was passed, we need to measure the height of
        // the rendered page and use Emulation.setVisibleSize
        if (fullPage) {
            const { root: { nodeId: documentNodeId } } = await DOM.getDocument();
            const { nodeId: bodyNodeId } = await DOM.querySelector({
                selector: 'body',
                nodeId: documentNodeId,
            });
            const { model: { height } } = await DOM.getBoxModel({ nodeId: bodyNodeId });
            console.log(height);
            await Emulation.setDeviceMetricsOverride({
                width: viewportWidth,
                height: height,
                deviceScaleFactor: 0,
                mobile: false,
                fitWindow: false,
            });
            await Emulation.setVisibleSize({ width: viewportWidth, height: height });
            // This forceViewport call ensures that content outside the viewport is
            // rendered, otherwise it shows up as grey. Possibly a bug?
            //await Emulation.forceViewport({ x: 0, y: 0, scale: 1 });
        }

        setTimeout(async function () {
            const ext  = format == 'jpg' ? 'jpg' : format;
            const screenshot = await Page.captureScreenshot({ ext });
            const buffer = new Buffer(screenshot.data, 'base64');
            file.writeFile(filename, buffer, 'base64', function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Screenshot saved');
                }
                client.close();
            });
        }, delay);
    });
}).on('error', err => {
    console.error('Cannot connect to browser:', err);
});