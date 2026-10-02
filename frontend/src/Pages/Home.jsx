import React, { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handlechange = (e) => {
    setMessage(e.target.value);
  };
  console.log(message);

  return (
    <>
      <div className="headings w-full flex justify-center flex-col">
        <h1 className="text-xl md:text-3xl text-white text-center mt-6">
          Customer <span className="text-red-400">Support</span> Agent
        </h1>
        <p className="text-white text-center mt-5 text-md md:text-xl">
          How can i help you?
        </p>
        {/* chat */}
        <div className="chat-sec mt-10 flex flex-col px-3 lg:px-96">
          <textarea
            onChange={handlechange}
            value={message}
            name="msg "
            id="msg"
            className="pt-20 pl-4  bg-white outline-0 rounded-2xl resize-none border-2 border-blue-600"
          >
            
          </textarea>
        </div>
      </div>
    </>
  );
}
