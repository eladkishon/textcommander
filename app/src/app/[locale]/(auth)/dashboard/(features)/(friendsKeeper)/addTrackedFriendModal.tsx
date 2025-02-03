import React, { useEffect, useState } from 'react';
import { useContacts } from "@/hooks/useContacts";
import { useTrackContact } from "@/services/track-contact";
import { useUser } from "@clerk/nextjs";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddTrackedFriendModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { user } = useUser();
  const { mutate: trackContacts, isPending } = useTrackContact();
  const { data: contacts, isLoading } = useContacts();



  // Filter contacts by search query
  const filteredContacts = search
    ? contacts?.filter((contact: any) =>
        contact.contact_name.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  const onModalClose = () => {
    onClose();
    setSearch("");
    setSelectedContacts([]);
  };

  const toggleContactSelection = (contactName: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactName)
        ? prevSelected.filter((name) => name !== contactName)
        : [...prevSelected, contactName]
    );
  };

  const handleSave = () => {
    if (selectedContacts.length > 0) {
      trackContacts(selectedContacts);
    }
  };

  useEffect(() => {
    setSelectedContacts(contacts?.filter((contact: any) => contact.tracked).map((contact: any) => contact.contact_id) || []);
  }, [contacts]);


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add Tracked Friends</h2>
        <div className="mb-4">
          <Label htmlFor="friendName" className="block text-sm font-medium text-gray-700">
            Search Contacts
          </Label>
          <input
            type="text"
            id="friendName"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {isLoading && <p className="p-2">Loading...</p>}
          {filteredContacts?.length === 0 && !isLoading && (
            <p className="p-2 text-gray-500">No contacts found</p>
          )}
          <ul className="list-none">
            {filteredContacts?.map((contact: any) => (
              <li key={contact.contact_id} className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.contact_id)}
                  onChange={() => toggleContactSelection(contact.contact_id)}
                  className="mr-2"
                />
                <span className="text-gray-800">{contact.contact_name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <Button onClick={onModalClose} className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTrackedFriendModal;
