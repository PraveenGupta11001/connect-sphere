#### Installation
> npm install tailwindcss @tailwindcss/vite redux react-redux @reduxjs/toolkit axios react-toastify
- npm install lucide-react
- npm install firebase
- npm install framer-motion
- npm i openai
- npm i @google/genai
- npm install dayjs



#### Color palletes & Themes
Indigo- 3A59D1
Light Blue - 3D90D7
Ligher Blue - 7AC6D2
Green Mix - B5FCCD
Green limy - 90C67C
Green - 2E8B57
Gray - 808080
Dark Gray - 333333
Black - 000000

#### Home Page
- 3D90D7
- 7AC6D2
- B5FCCD

#### Login Page
- 3A59D1
- 3D90D7
- 7AC6D2

#### Signup Page
- 3A59D1
- 3D90D7
- B5FCCD

#### Dashboard Page
- 3A59D1
- 3D90D7
- B5FCCD

#### Profile Page
- 3A59D1
- 3D90D7
- B5FCCD

#### Chat Page
- 3A59D1
- 3D90D7

#### Setting up Firebase OAuth - Authentication
Github - go to github.com/settings/develper settings/OAuth Apps
set things 
Google just easily.

#### remove warning of v7 Router Versioning
add this - <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

#### setup firebase access to specific url to give access
> sudo nano /etc/hosts
to add - 127.0.0.1   connectsphere.local
then install
- sudo apt update
- sudo apt install nginx

create file
sudo nano /etc/nginx/sites-available/connectsphere
add config material-
server {
    listen 80;
    server_name connectsphere.local;

    location / {
        proxy_pass http://localhost:5173;  # Vite dev server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
<>--------------------<>
Then link it cmds
sudo ln -s /etc/nginx/sites-available/connectsphere /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

Then domains in firebase like this
connectsphere.local

and into viteconfig.js files
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // to allow access from local network
    allowedHosts: ['connectsphere.local'], // ✅ allow custom domain
  },
})


