import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading,setLoading] = useState(false)
  const [response,setResponse] = useState([])
  const handlechange = (e) =>{
    setMessage(e.target.value);
  };
  const handlesubmit = async (e) => {
    try {
      if(message.trim()===""){
        return
      }
      if (e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        setLoading(true)
        setResponse((prev)=>[...prev,{sender:"user",text:message}])
        const res = await axios.post(
          "http://localhost:8282/api/chat",
          {message},
          { withCredentials: true },
        );
        setResponse((prev)=>[...prev,{sender:"Ai",text:res.data}])
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };
  return (
    <>
      <div className="w-full h-screen flex justify-center">
        <div className="headings w-full flex justify-center flex-col">
          <h1 className="text-xl md:text-3xl text-white text-center mt-6">
            Customer <span className="text-red-400">Support</span> Agent
          </h1>
          <p className="text-white text-center mt-5 text-md md:text-xl">
            How can i help you?
          </p>
            {loading && (
                <p className="text-white pl-20">Fetching....</p>
              )}

              {/* user response and user message  */}
              {response.map((msg,index)=>
                  <div 
    key={index} 
    className={`w-full flex ${msg.sender === "user" ? "justify-start pl-4 pt-5 md:pl-20 pb-5" : "justify-end pr-5 flex-wrap"}`}
  >
    
    {/* The actual chat bubble */}
    <p className="text-white bg-blue-500 p-3 rounded-2xl max-w-[80%] md:max-w-[50%] break-words">
      {msg.text}
    </p>
  </div>
              )}
          {/* chat */}
          <div className="chat-sec mt-15 flex flex-col px-3 lg:px-96">
            <textarea
              onChange={handlechange}
              onKeyDown={handlesubmit}
              value={message}
              name="msg "
              id="msg"
              className="pt-20 pl-4  bg-white outline-0 rounded-2xl resize-none border-2 border-blue-600"
            ></textarea>
          </div> 
        </div>
      </div>
    </>
  );
}
