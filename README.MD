Setting Up HTTPS with mkcert, nginx, and Vercel for ConnectSphere WeBot
This guide sets up HTTPS for the ConnectSphere WeBot project using mkcert for local SSL certificates, nginx as a reverse proxy to achieve portless URLs (https://192.168.29.102.nip.io and https://connectsphere.local for the frontend, /api for the backend), and Vercel for hosting the frontend. The backend runs locally with FastAPI on port 8000, proxied via nginx. It covers certificate generation, server configuration, Vercel deployment, and verification for local and hosted setups.
Paths:

Backend: ~/Desktop/ConnectSphere-Frontend/backend/main.py
Frontend: ~/Desktop/ConnectSphere-Frontend/frontend/src/WeBot.jsx
Vite Config: ~/Desktop/ConnectSphere-Frontend/frontend/vite.config.js
Certificates: ~/Desktop/ConnectSphere-Frontend/backend/certs/

Prerequisites

OS: Ubuntu/Linux
Tools: curl, git, python3, pip, nodejs, npm, vercel, nginx
Ports: 8000 (backend), 5173 (frontend local dev) free
Accounts: Vercel, Groq API key (in ~/Desktop/ConnectSphere-Frontend/backend/.env)
/etc/hosts:192.168.29.102 connectsphere.local



Step 1: Install mkcert

Install Dependencies:
sudo apt update
sudo apt install libnss3-tools


Install mkcert:
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
sudo chmod +x /usr/local/bin/mkcert


Verify:
mkcert --version


Install CA:
mkcert -install



Step 2: Generate Certificates

Create Directory:
cd ~/Desktop/ConnectSphere-Frontend/backend
mkdir -p certs
cd certs


Generate:
mkcert 192.168.29.102.nip.io localhost connectsphere.local 127.0.0.1


Verify:
ls ~/Desktop/ConnectSphere-Frontend/backend/certs/

Expected: 192.168.29.102.nip.io+3.pem, 192.168.29.102.nip.io+3-key.pem


Step 3: Configure nginx Reverse Proxy

Install nginx:
sudo apt install -y nginx


Copy Certificates:
sudo mkdir -p /etc/nginx/certs
sudo cp ~/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem /etc/nginx/certs/
sudo cp ~/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3-key.pem /etc/nginx/certs/


Create Config:
sudo nano /etc/nginx/sites-available/connectsphere

Add:
server {
    listen 443 ssl;
    server_name 192.168.29.102.nip.io connectsphere.local;

    ssl_certificate /etc/nginx/certs/192.168.29.102.nip.io+3.pem;
    ssl_certificate_key /etc/nginx/certs/192.168.29.102.nip.io+3-key.pem;

    location / {
        proxy_pass https://localhost:5173;
        proxy_ssl_verify off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass https://localhost:8000/;
        proxy_ssl_verify off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


Enable and Restart:
sudo ln -s /etc/nginx/sites-available/connectsphere /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx



Step 4: Configure and Run Backend

Ensure .env:
echo "GROQ_API_KEY=your_key_here" > ~/Desktop/ConnectSphere-Frontend/backend/.env
cat ~/Desktop/ConnectSphere-Frontend/backend/.env


Install Dependencies:
cd ~/Desktop/ConnectSphere-Frontend/backend
pip install uvicorn[standard] groq python-dotenv fastapi pydantic


Run Backend with SSL:
cd ~/Desktop/ConnectSphere-Frontend/backend
uvicorn main:app --host 0.0.0.0 --port 8000 \
--ssl-keyfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3-key.pem \
--ssl-certfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem \
--reload


Check Port:
lsof -i :8000
sudo kill -9 <pid>



Step 5: Configure and Run Frontend Locally

Update .env:
echo "VITE_BACKEND_URL=https://192.168.29.102.nip.io/api" > ~/Desktop/ConnectSphere-Frontend/frontend/.env
cat ~/Desktop/ConnectSphere-Frontend/frontend/.env


Install Dependencies:
cd ~/Desktop/ConnectSphere-Frontend/frontend
npm install


Run Locally:
npm run dev -- --host



Step 6: Deploy Frontend to Vercel

Install Vercel CLI:
sudo npm install -g vercel


Verify:
vercel --version


Login:
vercel login


Deploy:
cd ~/Desktop/ConnectSphere-Frontend/frontend
vercel
vercel --prod


Project name: connectsphere
Framework: Vite
Build: npm run build
Output: dist
Environment variable: VITE_BACKEND_URL=https://192.168.29.102.nip.io/api


Map Domains:

In Vercel Dashboard → Project → Domains, add 192.168.29.102.nip.io and connectsphere.local.
Or:vercel domains add 192.168.102.nip.io





Step 7: Configure Authentication (Optional, if using Firebase Auth or similar)

Add Authorized Domains:
In Firebase Console → Authentication → Settings → Authorized Domains, add 192.168.29.102.nip.io, connectsphere.local, and the Vercel URL (e.g., connectsphere.vercel.app).



Step 8: Verify Setup
Local Setup

Backend:





curl -k https://192.168.29.102.nip.io/apicurl -k https://connectsphere.local/apicurl -k -X -POST https://192.168.29.102.nip.io/api/chat \

-H "Content-Type: application/json" \
-d '{"user_input":"Namaste","max_tokens":1024,"temperature":0.9,"conversation_history_id":""}'




Frontend:

Open https://192.168.29.102.nip.io and https://connectsphere.local.
Accept self-signed certificate warnings in Chrome.
Test WeBot: Send text (“Namaste”), test microphone, check auth flows.
Check DevTools (F12) for CORS/fetch errors.



Vercel Hosted

Frontend:

Open https://192.168.29.102.nip.io, https://connectsphere.local, or Vercel URL (e.g., https://connectsphere.vercel.app).
Test WeBot features and auth.


Backend:
Run 

cd ~/Desktop/ConnectSphere-Frontend/backend
uvicorn main:app --host 0.0.0.0 --port 8000 \
--ssl-keyfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3-key.pem \
--ssl-certfile /home/praveen/Desktop/ConnectSphere-Frontend/backend/certs/192.168.29.102.nip.io+3.pem \
--reload



Troubleshooting

Vercel CLI:
sudo npm install -g vercel
source ~/.bashrc


Backend:
lsof -i :8000
sudo kill -9 <pid>


nginx:
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log


CORS:

Verify main.py CORS allows https://192.168.29.102.nip.io, https://connectsphere.local, and Vercel URL.


Auth:

Check DevTools for errors.
Ensure domains are whitelisted.


SSL:
openssl s_client -connect 192.168.29.102.nip.io:8000 -showcerts



Notes

Date: May 29, 2025, 03:30 PM IST
Username: Replace praveen as needed.
Certificates: mkcert is for development. Use Let’s Encrypt for production.
Security: Keep Groq API key secure.

