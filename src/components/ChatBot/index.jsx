import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // You can keep axios for making requests to the backend
import './index.scss'; // Import your SCSS file

// Set Axios base URL globally (for production, make sure to use the correct environment URL)
axios.defaults.baseURL = 'http://localhost:5000'; // Replace with the backend server URL in production

// Component to display chat history
const ChatHistory = ({ chatHistory }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat-history">
      {chatHistory.map((entry, index) => (
        <div
          key={index}
          className={`message ${entry.type === "user" ? "user" : "bot"}`}
        >
          {entry.message}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

// Main Chatbot Component
const Chatbot = ({ onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error handling state

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to send the message to the backend server
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    setErrorMessage(""); // Reset error message before sending new request

    try {
      // Send the message to the backend server
      const response = await axios.post('/api/chat', {
        message: userInput,
      });

      const botMessage = response.data.message;

      // Update chat history with the user's message and bot's response
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: botMessage },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage(error.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Function to handle "Enter" key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        <ChatHistory chatHistory={chatHistory} />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}

      <div className="text-field-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button> {/* Change text to 'Sending...' while loading */}
        <button
          className="close-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
