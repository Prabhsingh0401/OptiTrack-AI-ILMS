// import { Link } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
// import { Box, TextField, Button, Stack, Typography } from '@mui/material';
import './index.scss'
import Inventory from "../Inventory";
import Dashboard from '../../assets/Dashboard icon.png';
// import Analytics from '../../assets/Analytics icon.png';
import Datavisualize from "../Visualization/Datavisualized";
import Nvidia from "../ImageGeneration/ImageGeneration";
import nvidia from '../../assets/Nvidia.png'

export default function Inventorypage() {
  const { user } = useUser(); // Access user data

  const [formData, setFormData] = useState({
    unitPrice: '',
    name: '',
    time: '',
    day: '',
    country: ''
  });

  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a result after form submission
    const simulatedResult = `Restock Recommendation: ${formData.unitPrice} units of ${formData.name} in ${formData.country}`;
    setResult(simulatedResult);
  };

  return (
    <div className="index-page">
      <h1>Greetings, {user ? user.firstName : "Guest"}</h1>
      <h2>Dashboard <img src={Dashboard}></img></h2>
      <Inventory></Inventory>
      <Datavisualize></Datavisualize>
      <div className="ImageGeneration">
      <h2 className="GenerationImage">Generate Images<img src={nvidia}></img></h2>
      <br></br> <br></br>
      <p>Introducing our innovative image generation tool powered by NVIDIA's Stable Diffusion XL. 
        Create stunning visuals effortlessly with real-time updates and high-quality images. Perfect 
        for artists, marketers, and developers, our intuitive interface. <br></br> <br></br> Offering seamless customization 
        and instant previews, transforming your creative ideas into captivating visuals with speed and 
        precision.</p>
      <Nvidia></Nvidia>
      </div>
    </div>

  );
}