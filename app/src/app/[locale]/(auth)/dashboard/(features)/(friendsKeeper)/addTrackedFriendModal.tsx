import { Button } from "@/components/ui/button";
import { useContacts } from "@/hooks/useContacts";
import { useTrackContact } from "@/services/track-contact";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const AddTrackedFriendModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { user } = useUser();
  const { mutate: trackFriend, isPending } = useTrackContact(selectedContact || "");
  const { data: contacts, isLoading } = useContacts();
  
  if (!isOpen) return null; 

  // Filter contacts by search query
  const filteredContacts = search
    ? contacts?.filter((contact: any) =>
        contact.contact_name.toLowerCase().startsWith(search.toLowerCase())
      )
    : [];

  const onModalClose = () => {
    onClose();
    setSearch("");
    setSelectedContact("");
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {/* Modal Container */}
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Friends Keeper</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        {/* Suggestions List */}
        {search != selectedContact && (
          <ul className="border rounded-lg mt-2 max-h-40 overflow-y-auto bg-white shadow-md">
            {isLoading && <li className="p-2">Loading...</li>}
            {filteredContacts?.length === 0 && !isLoading && (
              <li className="p-2 text-gray-500">No contacts found</li>
            )}
            {filteredContacts?.map((contact: any) => (
              <li
                key={contact.contact_id}
                onClick={() => {
                  setSearch(contact.contact_name);
                  setSelectedContact(contact.contact_name);
                }}
                className="p-2 hover:bg-blue-200 cursor-pointer"
              >
                {contact.contact_name}
              </li>
            ))}
          </ul>
        )}

        {/* Selected Contact Display */}
        {selectedContact && (
          <p className="mt-4 text-green-600">Selected: {selectedContact}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onModalClose}
            className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
          >
            Close
          </button>
          <Button
            onClick={() => trackFriend()}
            disabled={isPending}
            className="px-4 py-2 bg-green-300 rounded-lg mr-2"
          >
            Track
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTrackedFriendModal;
