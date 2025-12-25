const https = require('https'); // Built-in, no install needed!

module.exports = async function (context, req) {
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    const postData = JSON.stringify(req.body);
    const logicAppUrl = new URL("https://prod-78.southeastasia.logic.azure.com:443/workflows/6d34ef779936468f90ff472306864ac5/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=efKzolsIgaNXSivfnGl9ibNMfROiSeW3P764_RhfqYg");

    const options = {
        hostname: logicAppUrl.hostname,
        path: logicAppUrl.pathname + logicAppUrl.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    try {
        await new Promise((resolve, reject) => {
            const request = https.request(options, (res) => resolve());
            request.on('error', (err) => reject(err));
            request.write(postData);
            request.end();
        });

        context.res = { status: 200, headers: headers, body: "Order Success!" };
    } catch (error) {
        context.res = { status: 500, headers: headers, body: error.message };
    }
};
