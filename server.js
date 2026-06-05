const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ==========================================
// CONFIGURATION
// ==========================================

const API_URL = "https://backend.api-wa.co/campaign/neodove/api/v2";

// Replace with your API key OR use Render Environment Variables
const API_KEY = process.env.API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTcxNjE0OGQyZDk2MGQzZmVhZjNmMSIsIm5hbWUiOiJCWFEgPD4gTWlnaHR5IEh1bmRyZWQgVGVjaG5vbG9naWVzIFB2dCBMdGQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjkxNzE2MTQ4ZDJkOTYwZDNmZWFmM2VhIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NjMxMjA2NjB9.8jOtIkz5c455LWioAa7WNzvjXlqCN564TzM12yQQ5Cw";

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
res.send("AFCAT OTP Server Running Successfully");
});

// ==========================================
// SEND OTP
// ==========================================

app.post("/send-otp", async (req, res) => {
try {
const { phoneNumber, userName, otpCode } = req.body;

```
    if (!phoneNumber || !otpCode) {
        return res.status(400).json({
            success: false,
            message: "phoneNumber and otpCode are required"
        });
    }

    console.log(`Sending OTP ${otpCode} to ${phoneNumber}`);

    const payload = {
        apiKey: API_KEY,
        campaignName: "OTP5",
        destination: phoneNumber,
        userName: userName || "Valued User",

        templateParams: [
            otpCode
        ],

        source: "AFCAT 2026 Website",

        media: {},

        buttons: [
            {
                type: "button",
                sub_type: "url",
                index: 0,
                parameters: [
                    {
                        type: "text",
                        text: otpCode
                    }
                ]
            }
        ],

        carouselCards: [],
        location: {},
        attributes: {},

        paramsFallbackValue: {
            FirstName: "user"
        }
    };

    const response = await axios.post(
        API_URL,
        payload,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return res.status(200).json({
        success: true,
        message: "OTP Sent Successfully",
        data: response.data
    });

} catch (error) {

    console.error(
        "Error Sending OTP:",
        error.response?.data || error.message
    );

    return res.status(500).json({
        success: false,
        message: "Failed To Send OTP",
        error: error.response?.data || error.message
    });
}
```

});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
