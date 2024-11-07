import axios from 'axios';
import { useState } from 'react';
import './index.scss';
import { useUser } from '@clerk/clerk-react';

const Nvidia = () => {
    const [text, setText] = useState('');
    const [generating, setGenerating] = useState(false);
    const [image, setImage] = useState(null);

    const invokeUrl = 'http://localhost:1312/generate-our-image-brotha';

    const generateImage = async () => {
        const payload = {
            "text_prompts": [
                {
                    "text": text || "A default prompt for generation", // Fallback for empty input
                    "weight": 1
                }
            ],
            "cfg_scale": 5,
            "sampler": "K_EULER_ANCESTRAL",
            "seed": 0,
            "steps": 25
        };

        try {
            setGenerating(true);
            setImage(null);
            const res = await axios.post(invokeUrl, payload);

            if (res.data.artifacts && res.data.artifacts.length > 0) {
                const imageData = res.data.artifacts[0].base64;
                setImage(`data:image/jpeg;base64,${imageData}`);
            } else {
                console.log('No image data found in response:', res.data);
            }
        } catch (error) {
            console.log("Error generating image: ", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
    };

    const { user } = useUser(); // Access user data

    return (
        <div class='nvidia-container'>
            <div class="main-container">
                <div class="title-and-input">
                    <div>
                        <h3>Greetings {user ? user.firstName : "Guest"}</h3>
                        <h4 class="text">Powered by <span>NVIDIA</span></h4>
                    </div>
                    <div id="input-field">
                        <input
                            onChange={handleInput}
                            placeholder='A cow wearing sunglass'
                            class='input-form' // Adjusted to 'class' for JSX compatibility
                        />
                        <br />
                        <button onClick={generateImage}>
                            {generating ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </div>
                {image && <img class='generated-image' src={image} alt="Generated" />} {/* Adjusted to 'class' for JSX compatibility */}
            </div>
        </div>
    );
};

export default Nvidia;
