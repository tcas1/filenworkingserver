const { FilenSDK } = require("@filen/sdk");
const path = require("path");
const os = require("os");
const { WebDAVServer } = require("@filen/webdav");
const readline = require("readline");

// Initialize a SDK instance
const filen = new FilenSDK({
    metadataCache: true,
    connectToSocket: true,
    tmpPath: path.join(os.tmpdir(), "filen-sdk"),
});

// Create an interface for reading input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to prompt for input
const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Wrap the code in an async function
(async () => {
    const email = "dontspamme.data219@passinbox.com"; // You can modify this as needed
    const password = await askQuestion("Enter your password: ");
    const twoFactorCode = await askQuestion("Enter your 2FA code: ");

    await filen.login({
        email: email,
        password: password,
        twoFactorCode: twoFactorCode,
    });

    const hostname = "0.0.0.0";
    const port = process.env.PORT || 80;
    const https = false; // Use 'true' instead of 'True'

    // Initialize the WebDAV server
    console.log("Initialize the WebDAV server");
    const server = new WebDAVServer({
        hostname,
        port,
        https,
        user: {
            username: "Educated4464",
            password: "CYQT8CsFWg1kfe", // You can change this
            sdk: filen,
        },
        authMode: "basic",
        root: "joplinnotes",
    });

    try {
        await server.start();
        console.log("WebDAV server started successfully.");
    } catch (error) {
        console.error("Failed to start the WebDAV server:", error);
        return; // Exit if the server fails to start
    }

    console.log(
        `WebDAV server started successfully on ${https ? "https" : "http"}://${hostname}:${port}`
    );

    // Close the readline interface
    rl.close();
})();
