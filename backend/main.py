from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://connectsphere.local", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["chatapp"]
    users_collection = db["users"]
    # Test the connection
    client.server_info()  # This will raise an exception if the connection fails
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    raise Exception("MongoDB connection failed")

# Pydantic model for user data
class UserUpdate(BaseModel):
    email: str
    displayName: str
    phone: str
    address: str
    profileImage: str

# Update user profile endpoint
@app.put("/api/user/update")
async def update_user(user: UserUpdate):
    try:
        print(f"Received update request for email: {user.email}")
        # Find and update the user in MongoDB
        result = users_collection.update_one(
            {"email": user.email},
            {
                "$set": {
                    "displayName": user.displayName,
                    "phone": user.phone,
                    "address": user.address,
                    "profileImage": user.profileImage,
                }
            },
        )

        print(f"Update result: matched_count={result.matched_count}, modified_count={result.modified_count}")

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"User not found with email: {user.email}")

        return {"message": "Profile updated successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")