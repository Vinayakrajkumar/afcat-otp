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
const API_KEY = process.env.API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTcxNjE0OGQyZDk2MGQzZmVhZjNmMSIsIm5hbWUiOiJCWFEgPD4gTWlnaHR5IEh1bmRyZWQgVGVjaG5vbG9naWVzIFB2dCBMdGQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjkxNzE2MTQ4ZDJkOTYwZDNmZWFmM2VhIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NjMxMjA2NjB9.8jOtIkz5c455LWioAa7WNzvjXlqCN564TzM12yQQ5Cw";

// PUT YOUR ACTUAL NEODOVE INCOMING WEBHOOK LINK HERE
const NEODOVE_WEBHOOK_URL = process.env.NEODOVE_WEBHOOK_URL || "YOUR_NEODOVE_WEBHOOK_URL_HERE";

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
    res.send("AFCAT OTP Server Running Successfully");
});

// ==========================================
// ROUTE 1: SEND OTP VIA WHATSAPP
// ==========================================

app.post("/send-otp", async (req, res) => {
    try {
        const { phoneNumber, userName, otpCode } = req.body;

        if (!phoneNumber || !otpCode) {
            return res.status(400).json({ success: false, message: "phoneNumber and otpCode required" });
        }

        console.log(`Sending OTP ${otpCode} to ${phoneNumber}`);

        const payload = {
            apiKey: API_KEY,
            campaignName: "OTP5",
            destination: phoneNumber,
            userName: userName || "Valued User",
            templateParams: [otpCode],
            source: "AFCAT 2026 Website",
            media: {},
            buttons: [
                { type: "button", sub_type: "url", index: 0, parameters: [{ type: "text", text: otpCode }] }
            ],
            carouselCards: [], location: {}, attributes: {},
            paramsFallbackValue: { FirstName: "user" }
        };

        const response = await axios.post(API_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        return res.status(200).json({ success: true, message: "OTP Sent", data: response.data });

    } catch (error) {
        console.error("Error Sending OTP:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: "Failed To Send OTP" });
    }
});

// ==========================================
// ROUTE 2: SUBMIT LEAD TO NEODOVE
// ==========================================

app.post("/submit-lead", async (req, res) => {
    try {
        // Receive all the fields from your HTML form
        const { name, qualification, city, school, course, phone } = req.body;

        console.log(`Pushing lead to NeoDove for: ${name}`);

        // Send the data to your NeoDove Webhook
        const response = await axios.post(NEODOVE_WEBHOOK_URL, {
            name: name,
            mobile: phone,
            qualification: qualification,
            city: city,
            school: school,
            course: course,
            source: "AFCAT Admission Landing Page"
        });

        return res.status(200).json({ success: true, message: "Lead saved successfully" });

    } catch (error) {
        console.error("Error saving to NeoDove:", error.message);
        return res.status(500).json({ success: false, message: "Failed to save lead" });
    }
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
