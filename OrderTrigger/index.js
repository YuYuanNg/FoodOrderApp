const https = require('https'); 

module.exports = async function (context, req) {
    // Permission headers for your GitHub website
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle Preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers: headers };
        return;
    }

    try {
        const postData = JSON.stringify(req.body);
        const logicAppUrl = new URL("PASTE_YOUR_LOGIC_APP_URL_HERE");

        const options = {
            hostname: logicAppUrl.hostname,
            path: logicAppUrl.pathname + logicAppUrl.search,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        await new Promise((resolve, reject) => {
            const request = https.request(options, (res) => resolve());
            request.on('error', (err) => reject(err));
            request.write(postData);
            request.end();
        });

        context.res = {
            status: 200,
            headers: headers,
            body: "Order Success!"
        };
    } catch (error) {
        context.res = { status: 500, headers: headers, body: error.message };
    }
};
