import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const invokeUrl = "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl";
const API_KEY = process.env.API_KEY;

app.post('/generate-our-image-brotha', async (req, res) => {
    try {
        const response = await axios.post(invokeUrl, req.body, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        // Check if response data contains the artifacts
        if (response.data && response.data.artifacts && response.data.artifacts.length > 0) {
            res.json(response.data);
        } else {
            console.log('No images generated:', response.data);
            res.status(400).json({ message: "No images generated." });
        }
    } catch (error) {
        console.error('Error generating image:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: "API Request not successful" });
    }
});

const PORT = 1312;
app.listen(PORT, () => console.log("Server is running smarty..."));
