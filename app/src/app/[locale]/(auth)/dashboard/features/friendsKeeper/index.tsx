"use client";
import { useState } from "react";
import AddTrackedFriendModal from "./edit-tracked-friends-dialog";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";

const FriendsKeeper = () => {
  const [showEditContactsModal, setShowEditContactsModal] = useState<boolean>(false);
  const { data: contacts, isLoading, error } = useContacts();

  return (
    <div className="w-full flex flex-col border border-gray-300 p-6 rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Friends Keeper</h2>
        <Button onClick={() => setShowEditContactsModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          Edit Tracked Contacts
        </Button>
      </div>

      {isLoading && <p className="text-gray-500">Loading contacts...</p>}
      {error && <p className="text-red-500">Error loading contacts</p>}
      {contacts?.map((friend) => (
        <div key={friend.contact_id} className="py-2 border-b border-gray-200 last:border-b-0 text-gray-700">
          {friend.contact_name}
        </div>
      ))}

      <AddTrackedFriendModal
        isOpen={showEditContactsModal}
        onClose={() => setShowEditContactsModal(false)}
      />
    </div>
  );
};

export default FriendsKeeper;
