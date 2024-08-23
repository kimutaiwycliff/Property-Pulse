'use client';
import { useState } from "react";
import { toast } from "react-toastify";
import markMessageAsRead from "@/app/actions/markMessagesAsRead";
import { set } from "mongoose";

const MessageCard = ({message}) => {
    const [isRead, setIsRead] = useState(message.read);
    const handleReadCLick = async () => {
        const read = await markMessageAsRead(message._id);
        setIsRead(read);
        toast.success(`Message marked as ${read ? "read" : "new"}`);
    }
  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
        {!isRead && (<div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">New</div>)}
      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span>
        Boston Commons Retreat
      </h2>
      <p className="text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
        libero nobis vero quos aspernatur nemo alias nam, odit dolores sed
        quaerat illum impedit quibusdam officia ad voluptatibus molestias sequi?
        Repudiandae!
      </p>

      <ul className="mt-4">
        <li>
          <strong>Name:</strong> John Doe
        </li>

        <li>
          <strong>Reply Email:</strong>
          <a href="mailto:recipient@example.com" className="text-blue-500">
            recipient@example.com
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>
          <a href="tel:123-456-7890" className="text-blue-500">
            123-456-7890
          </a>
        </li>
        <li>
          <strong>Received:</strong>1/1/2024 12:00 PM
        </li>
      </ul>
      <button className="mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md">
        {isRead ? "Mark as New" : "Mark as Read"}
      </button>
      <button className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
        Delete
      </button>
    </div>
  );
}
export default MessageCard