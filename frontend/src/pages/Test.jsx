import React, { useState } from 'react'
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export default function Test() {
  const [gemQue, setGemQue] = useState('');
  const [gemAns, setGemAns] = useState('');
  console.log(gemQue, gemAns);


  async function testAI() {
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
      <button onClick={()=>testAI()}>Ask</button>
      <textarea name="gemini answer" id="" value={gemAns}></textarea>
    </div>


  )
}

