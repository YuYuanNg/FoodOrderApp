const axios = require('axios');

module.exports = async function (context, req) {
    const orderData = req.body;

    // Define CORS headers to send back to the browser
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const logicAppUrl = "https://prod-78.southeastasia.logic.azure.com..."; // Ensure this is full
        
        await axios.post(logicAppUrl, orderData);

        context.res = {
            status: 200,
            headers: headers, // CRITICAL: Send headers back
            body: "Order received and notification sent!"
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: headers, // Even errors need CORS headers
            body: "Error processing order"
        };
    }
};
