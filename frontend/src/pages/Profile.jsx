import React from 'react';
import { Edit } from 'lucide-react';
import userIconImg from "../assets/user-286.png";

export default function Profile() {
  return (
    <div className='mt-16 flex justify-center'>
      <div className='w-full max-w-4xl'>
        {/* Header background section */}
        <div className='h-[30vh] bg-gradient-to-b from-indigo-500 to-sky-500 flex justify-center items-center relative'>
          {/* Profile image container */}
          <div className='w-[120px] h-[120px] rounded-full bg-white ring-2 ring-white shadow-lg relative'>
            {/* Profile Image */}
            <img src={userIconImg} alt="User" className='w-full h-full object-cover' />

            {/* Edit Icon Overlay */}
            <button
              className='absolute bottom-0 right-0 p-1.5 rounded-full bg-white shadow-md z-10 border border-gray-300 hover:bg-gray-100 transition'
              aria-label="Edit Profile Picture"
            >
              <Edit size={18} className='text-black' />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className='px-4 md:px-8 py-6 text-center'>
          <h1 className='text-2xl font-semibold mb-2'>Hi! Media</h1>
          <div>
            <form className='flex flex-col gap-5'>
                <div className='flex gap-2'>
                    <span>Name</span>
                    <input type="text focus:none focus:ring-2" placeholder='name to display...'/>
                </div>
                <div className='flex'>
                    <span>Phone</span>
                    <input type="text" />
                </div>
                <div className='flex'>
                    <span>Address</span>
                    <input type="text" />
                </div>
                <div className='flex'>
                    <span>Name</span>
                    <input type="text" />
                </div>
                <div className='flex'>
                    <span>Name</span>
                    <input type="text" />
                </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
