// 'use client';
// import { useState } from 'react';
// import axios from 'axios';
// import openai from '@/lib/openai'; // Assuming openai config

// const ChatPage = () => {
//   const [inputText, setInputText] = useState('');
//   const [chatHistory, setChatHistory] = useState([{ role: 'system', content: 'You are an AI bot.' }]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSend = async () => {
//     if (!inputText) return;

//     setIsLoading(true);

//     // Append user input to the chat history
//     const updatedChatHistory = [...chatHistory, { role: 'user', content: inputText }];
//     setChatHistory(updatedChatHistory);
//     setInputText('');

//     try {
//       // Send chat history to the API
//       const response = await axios.post('/api/chat', { messages: updatedChatHistory });

//       // Append AI response to chat history
//       const aiMessage = { role: 'assistant', content: response.data.message };
//       setChatHistory([...updatedChatHistory, aiMessage]);
//     } catch (error) {
//       console.error('Error fetching response:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div>
//         {chatHistory.map((message, index) => (
//           <div key={index} className={`message ${message.role}`}>
//             <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong> {message.content}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         placeholder="Type your message..."
//         disabled={isLoading}
//       />
//       <button onClick={handleSend} disabled={isLoading || !inputText}>
//         {isLoading ? 'Loading...' : 'Send'}
//       </button>
//     </div>
//   );
// };

// export default ChatPage;
