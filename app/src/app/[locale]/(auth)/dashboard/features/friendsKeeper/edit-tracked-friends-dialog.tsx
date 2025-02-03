import React, { useEffect, useState } from 'react';
import { useContacts } from "@/hooks/useContacts";
import { useTrackContact } from "@/services/track-contact";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const AddTrackedFriendModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { mutate: trackContacts, isPending } = useTrackContact();
  const { data: contacts, isLoading } = useContacts();

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

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const handleSave = () => {
    if (selectedContacts.length > 0) {
      trackContacts(selectedContacts);
    }
  };

  useEffect(() => {
    setSelectedContacts(
      contacts?.filter((contact: any) => contact.tracked).map((contact: any) => contact.contact_id) || []
    );
  }, [contacts]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onModalClose}>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Tracked Friends</h2>
        <div className="mb-4">
          <Label htmlFor="friendName" className="block text-sm font-medium text-gray-700">
            Search Contacts
          </Label>
          <Input
            type="text"
            id="friendName"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          {isLoading && <p className="p-2 text-gray-500">Loading...</p>}
          {filteredContacts?.length === 0 && !isLoading && (
            <p className="p-2 text-gray-500">No contacts found</p>
          )}
          <ul className="list-none">
            {filteredContacts?.map((contact: any) => (
              <li key={contact.contact_id} className="flex items-center p-2 hover:bg-gray-100">
                <Checkbox
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
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrackedFriendModal;
