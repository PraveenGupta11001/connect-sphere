### How to run and set certification to unsecure urls

Setting Up HTTPS with mkcert for ConnectSphere WeBot
This guide explains how to set up HTTPS for the ConnectSphere WeBot project using mkcert to create locally trusted SSL certificates. It covers installing mkcert, generating certificates, configuring the FastAPI backend (~/Desktop/ConnectSphere-Frontend/backend/main.py) and React frontend (~/Desktop/ConnectSphere-Frontend/frontend/src/WeBot.jsx), running both servers, and verifying the setup. The backend runs at https://192.168.29.102.nip.io:8000 and the frontend at https://192.168.29.102.nip.io:5173.
Project Paths:

Backend: ~/Desktop/ConnectSphere-Frontend/backend/main.py
Frontend: ~/Desktop/ConnectSphere-Frontend/frontend/src/WeBot.jsx
Vite Config: ~/Desktop/ConnectSphere-Frontend/frontend/vite.config.js
Certificates: ~/Desktop/ConnectSphere-Frontend/backend/certs/

Prerequisites

OS: Ubuntu/Linux (adjust for other OS)
Tools: curl, git, python3, pip, nodejs, npm
Project: Cloned at ~/Desktop/ConnectSphere-Frontend
Ports: 8000 (backend), 5173 (frontend) free
Groq API Key: Stored in ~/Desktop/ConnectSphere-Frontend/backend/.env

Step 1: Install mkcert
mkcert creates locally trusted SSL certificates for development.

Install Dependencies:
sudo apt update
sudo apt install libnss3-tools


Download and Install mkcert:
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
sudo chmod +x /usr/local/bin/mkcert


Verify Installation:
mkcert --version

Expected: v1.4.4

Install Local CA:
mkcert -install

This creates a local Certificate Authority (CA) trusted by your system.


Step 2: Generate SSL Certificates
Create certificates for 192.168.29.102.nip.io, localhost, connectsphere.local, and 127.0.0.1.

Navigate to Certificates Directory:
cd ~/Desktop/ConnectSphere-Frontend/backend
mkdir -p certs
cd certs


Generate Certificates:
mkcert 192.168.29.102.nip.io localhost connectsphere.local 127.0.0.1

This generates:

192.168.29.102.nip.io+3.pem (certificate)
192.168.29.102.nip.io+3-key.pem (private key)


Verify Files:
ls ~/Desktop/ConnectSphere-Frontend/backend/certs

Expected: 192.168.29.102.nip.io+3-key.pem  192.168.29.102.nip.io+3.pem

Validate Certificate:
openssl x509 -in ~/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem -text -noout

Check for:

Issuer: mkcert ...
Subject: Includes 192.168.29.102.nip.io, localhost, etc.
Validity: Not expired



Step 3: Configure and Run Backend
The FastAPI backend (main.py) serves the WeBot API at https://192.168.29.102.nip.io:8000 with HTTPS.

Ensure .env:
cat ~/Desktop/ConnectSphere-Frontend/backend/.env

Example:
GROQ_API_KEY=your_groq_api_key_here

If missing, create it:
echo "GROQ_API_KEY=your_key_here" > ~/Desktop/ConnectSphere-Frontend/backend/.env


Install Backend Dependencies:
cd ~/Desktop/ConnectSphere-Frontend/backend
pip install uvicorn[standard] groq python-dotenv fastapi pydantic


Run Backend:Start the FastAPI server with HTTPS using the mkcert certificates:
cd ~/Desktop/ConnectSphere-Frontend/backend
uvicorn main:app --host 0.0.0.0 --port 8000 \
--ssl-keyfile /home/your-username/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3-key.pem \
--ssl-certfile /home/your-username/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem \
--reload


Replace your-username with your actual username (e.g., praveen).
The --reload flag enables auto-reload for development.
Check the terminal for startup messages or errors (e.g., certificate issues, Groq API key errors).
Ensure port 8000 is free:lsof -i :8000
sudo kill -9 <pid>





Step 4: Configure and Run Frontend
The React frontend (WeBot.jsx) runs at https://192.168.29.102.nip.io:5173 and connects to the backend.

Update .env:Set the backend URL to HTTPS:
echo "VITE_BACKEND_URL=https://192.168.29.102.nip.io:8000" > ~/Desktop/ConnectSphere-Frontend/frontend/.env
cat ~/Desktop/ConnectSphere-Frontend/frontend/.env


Install Frontend Dependencies:
cd ~/Desktop/ConnectSphere-Frontend/frontend
npm install


Run Frontend:Start the Vite development server with HTTPS:
cd ~/Desktop/ConnectSphere-Frontend/frontend
npm run dev -- --host


The --host flag exposes the server to the network (e.g., 192.168.29.102.nip.io:5173).
Check the terminal for Vite’s startup URL (should include https).
If Vite fails, verify vite.config.js certificate paths:import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      cert: fs.readFileSync(path.resolve(__dirname, '../backend/certs/192.168.29.102.nip.io+3.pem')),
      key: fs.readFileSync(path.resolve(__dirname, '../backend/certs/192.168.29.102.nip.io+3-key.pem')),
    },
    allowedHosts: ['localhost', '192.168.29.102', 'connectsphere.local', '127.0.0.1', '192.168.29.102.nip.io'],
    hmr: {
      host: '192.168.29.102.nip.io',
      port: 5173,
      protocol: 'wss',
    },
  },
});





Step 5: Verify Setup
Test both backend and frontend to ensure HTTPS works and the WeBot functions (including microphone).
Backend Tests

Test GET /:
curl -k https://192.168.29.102.nip.io:8000

Expected: {"message":"AI Chatbot API is running!"}

Test POST /chat:
curl -k -X POST https://192.168.29.102.nip.io:8000/chat \
-H "Content-Type: application/json" \
-d '{"user_input":"Namaste","max_tokens":1024,"temperature":0.9,"conversation_history":[]}'

Expected: Streaming JSON response (e.g., {"response":"Namaste! How can I assist you today?"}).

Postman:

URL: https://192.168.29.102.nip.io:8000/chat
Method: POST
Headers: Content-Type: application/json
Body:{
    "user_input": "Namaste",
    "max_tokens": 1024,
    "temperature": 0.9,
    "conversation_history": []
}


Disable SSL verification (Settings → General → SSL certificate verification → Off).


Check Logs:
tail -f ~/Desktop/ConnectSphere-Frontend/backend/*.log

Look for errors like “Groq API error” or “Unexpected error”.


Frontend Tests

Open Frontend:

URL: https://192.168.29.102.nip.io:5173
Browser: Chrome or Edge
Action: Accept the self-signed certificate warning (“Advanced” → “Proceed”).


Test WeBot:

Open the WeBot chat (click the chat icon).
Send a text message (e.g., “Namaste”).
Verify the response appears from WeBot.
Test the microphone button:
Click the microphone.
Allow microphone access.
Speak and verify the transcript sends as a message.




Check DevTools:

Open DevTools (F12) → Console/Network.
Ensure no CORS or fetch errors.
Verify POST https://192.168.29.102.nip.io:8000/chat requests succeed.


Test Large Conversation:

Send multiple long messages.
Expect a message like “Conversation too long! Please refresh to start a new chat” if the history exceeds ~6000 tokens.
Refresh the page and verify the chat resets.



Troubleshooting

Backend Not Responding:

Check Uvicorn:lsof -i :8000

Kill processes if needed:sudo kill -9 <pid>


Verify certificates:ls ~/Desktop/ConnectSphere-Frontend/backend/certs


Re-run backend with absolute paths.


SSL Errors:

If curl fails with wrong version number:curl http://192.168.29.102.nip.io:8000

If HTTP works, Uvicorn isn’t using SSL. Re-run with correct SSL flags.
Validate certificates:openssl s_client -connect 192.168.29.102.nip.io:8000 -showcerts




CORS Errors:

Check backend logs for CORS issues.
Ensure main.py CORS includes https://192.168.29.102.nip.io:5173.


Microphone Not Working:

Verify window.isSecureContext is true in DevTools console.
Test in Chrome/Edge.
Ensure browser trusts the certificate.


Groq API Issues:

Verify API key:cat ~/Desktop/ConnectSphere-Frontend/backend/.env


Test Groq:from groq import Groq
client = Groq(api_key="your_key_here")
response = client.chat.completions.create(model="llama3-70b-8192", messages=[{"role":"user","content":"test"}])
print(response)


#### How to run cmds for backend and frontend for local -
backend 

uvicorn main:app --host 0.0.0.0 --port 8000 --ssl-keyfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3-key.pem --ssl-certfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem --reload

frontend 

npx vite --host



Notes

Certificates: mkcert is for development only. For production, use Let’s Encrypt or a trusted CA.
Security: Ensure your Groq API key is secure and not exposed.
Paths: Adjust paths if your project is moved (e.g., replace /home/your-username with your actual path).
Date: Guide updated on May 29, 2025.

For issues, contact the project maintainer or check logs for detailed errors.
