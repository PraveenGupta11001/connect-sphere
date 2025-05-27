### To install
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server.gpg

echo "deb [signed-by=/usr/share/keyrings/mongodb-server.gpg] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod

sudo systemctl status mongod
### mongo queries
mongosh
use chatapp

db.users.insertOne({
  email: "test@example.com",
  password: "hashedpassword", // Replace with the actual hashed password
  displayName: "",
  phone: "",
  address: "",
  profileImage: ""
})

db.users.find().pretty()

### Create the Database and Collection

The FastAPI backend uses a database named chatapp and a collection named users. If they don’t exist, MongoDB will create them automatically when you insert data, but let’s ensure the user data exists.

Manually Add a Test User (if needed):

Connect to the MongoDB shell:
bash

Copy
mongosh
Switch to the chatapp database:
javascript

Copy
use chatapp
Insert a test user (replace test@example.com with the email of your logged-in user):
javascript

Copy
db.users.insertOne({
  email: "test@example.com",
  password: "hashedpassword", // Replace with the actual hashed password
  displayName: "",
  phone: "",
  address: "",
  profileImage: ""
})
Verify the user exists:
javascript

Copy
db.users.find().pretty()


### Fast API
uvicorn main:app --reload --port 8000
