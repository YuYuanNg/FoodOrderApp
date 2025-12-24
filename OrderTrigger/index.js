const axios = require('axios');

module.exports = async function (context, req) {
    const orderData = req.body;

    try {
        // Replace this URL with your actual Logic App Trigger URL
        const logicAppUrl = "https://prod-XX.region.logic.azure.com...";
        
        await axios.post(logicAppUrl, orderData);

        context.res = {
            status: 200,
            body: "Order received and notification sent!"
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error processing order"
        };
    }
};
