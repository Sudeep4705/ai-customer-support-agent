import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);

  const handlechange = (e) => {
    setMessage(e.target.value);
  };

  const handlesubmit = async (e) => {
    try {
      if (message.trim() === "") {
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setLoading(true);
        setResponse((prev) => [...prev, { sender: "user", text: message }]);
        const res = await axios.post(
          "http://localhost:8282/api/chat",
          { message },
          { withCredentials: true }
        );
        setResponse((prev) => [...prev, { sender: "Ai", text: res.data }]);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <div className="flex-shrink-0 p-6 text-center border-b border-gray-800 bg-gray-900">
        <h1 className="text-xl md:text-3xl font-semibold">
          Customer <span className="text-red-400">Support</span> Agent
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-2">
          How can I help you?
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-32 py-6 space-y-4">
        {response.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl break-words shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-gray-700 text-gray-100 rounded-tl-none"
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Loading*/}
        {loading && (
          <div className="flex justify-start w-full">
            <p className="text-gray-400 text-sm italic ml-2 animate-pulse">
              Fetching...
            </p>
          </div>
        )}
      </div>
      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <textarea
            onChange={handlechange}
            onKeyDown={handlesubmit}
            value={message}
            name="msg"
            id="msg"
            placeholder="Type your message... (Press Enter to send)"
            className="w-full bg-gray-800 text-white placeholder-gray-500 outline-none rounded-2xl resize-none border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-4 min-h-[60px] max-h-[150px] transition-all"
          ></textarea>
        </div>
      </div>
    </div>
  );
}