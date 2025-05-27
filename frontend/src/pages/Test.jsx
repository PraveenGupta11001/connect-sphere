import React, { useState } from 'react'
import { GoogleGenAI } from "@google/genai";

export default function Test() {
  const [gemQue, setGemQue] = useState('');
  const [gemAns, setGemAns] = useState('');

  async function askGemini() {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyC_whWksDAGxiTi-3f8iSivUfGTij8emFU" });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: gemQue,
    });
    setGemAns(response.text);
    console.log(response.text);
  }

  return (
    <div>
      <div>Gemni Ask</div>
      <input type="text" placeholder='Ask Anything...' onChange={(e)=>setGemQue(e.target.value)} />
      <button onClick={()=>askGemini()}>Ask</button>
      <textarea name="gemini answer" id="" value={gemAns}></textarea>
    </div>


  )
}

