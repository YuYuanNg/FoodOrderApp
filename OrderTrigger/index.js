const axios = require('axios');

module.exports = async function (context, req) {
    // These headers act as the "permission slip" for your GitHub site
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const orderData = req.body;
        // Make sure this full URL is pasted here correctly
        const logicAppUrl = "https://prod-78.southeastasia.logic.azure.com..."; 
        
        await axios.post(logicAppUrl, orderData);

        context.res = {
            status: 200,
            headers: headers, // Send headers back so the browser sees success
            body: "Order received!"
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: headers,
            body: "Backend error"
        };
    }
};
