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
                <p className="text-white ml-5">Fetching....</p>
              )}
          {/* chat */}
          <div className="chat-sec mt-10 flex flex-col px-3 lg:px-96">
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
