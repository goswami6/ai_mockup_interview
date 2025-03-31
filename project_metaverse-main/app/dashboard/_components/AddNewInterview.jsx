"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { X } from "lucide-react"; // Import Close Icon
import { Button } from "@/components/ui/button"; // Relative path


const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false);

    return (
      <>
        {/* Main Button to Open Popup */}
        <div 
          className="relative flex aspect-[2/1] w-full max-w-md flex-col items-center justify-center 
          rounded-xl border border-transparent p-8 text-center bg-white overflow-hidden shadow-xl cursor-pointer"
          onClick={() => setOpenDialog(true)} // Opens Popup
        >
          
          {/* Zigzag Border Animation */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent zigzag-border"></div>

          {/* Pointer Tail */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rotate-45 border-l border-b border-black"></div>

          {/* Clickable Text */}
          <h2 className="font-bold text-sm text-gray-800">+ Add new</h2>
        </div>

        {/* Dialog / Popup */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          {/* Backdrop Effect */}
          {openDialog && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>}

          {/* Centered Popup */}
          <DialogContent className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 rounded-lg shadow-xl w-96">
            
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setOpenDialog(false)} // Closes Popup
            >
              {/* <X size={20} /> */}
            </button>

            {/* Header */}
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New Interview</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Fill in the details for the new interview.
                <div className="flex gap-5 justify-center" onClick={()=>setOpenDialog(false)}>
                <Button className="rounded-md border border-white bg-black text-white px-4 py-2 hover:bg-gray-800">
  Cancel
</Button>
<Button className="rounded-md border border-white bg-black text-white px-4 py-2 hover:bg-gray-800">
  Start Interview
</Button>

                </div>
              </DialogDescription>
            </DialogHeader>

            {/* Popup Content (You can add a form here) */}
            <p className="text-sm text-gray-600">
              This is where you can add interview details.
            </p>
          </DialogContent>
        </Dialog>

        {/* Zigzag Border & Hover Animation */}
        <style jsx>{`
          @keyframes zigzagBefore {
            0% { transform: translateX(-100%); }
            25%, 100% { transform: translateX(100%); }
          }

          @keyframes zigzagAfter {
            0%, 12.5% { transform: translateY(-100%); }
            37.5%, 100% { transform: translateY(100%); }
          }

          .zigzag-border {
            position: absolute;
            display: flex;
            gap: 10px;
          }

          .zigzag-border::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, black);
            transform: translateX(-100%);
            animation: zigzagBefore 4s linear infinite;
          }

          .zigzag-border::after {
            content: "";
            position: absolute;
            right: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, transparent, black);
            transform: translateY(-100%);
            animation: zigzagAfter 4s linear infinite;
          }

          /* Hover Effect */
          .zigzag-border:hover {
            outline: 2px solid black;
            outline-offset: -5px;
            transition: 0.3s linear;
          }
        `}</style>
      </>
    );
};

export default AddNewInterview;
