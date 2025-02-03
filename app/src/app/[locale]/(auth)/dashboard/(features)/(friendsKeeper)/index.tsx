"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddTrackedFriendModal from "./addTrackedFriendModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../../../../../lib/db/supabase";
import { useUser } from "@clerk/nextjs";
import { useContacts } from "@/hooks/useContacts";


const FriendsKeeper = () => {
  const [friendName, setFriendName] = useState<string>("");
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);

  const { data, isLoading, error } = useContacts();

  return (
    <div className="w-full flex flex-col border-2 border-gray-200 p-5">
      <div className="flex pb-10 justify-between gap-2">
        <p className="text-2xl">Friends Keeper</p>
        <Button onClick={() => setShowAddFriendModal(true)}>Add</Button>
        <AddTrackedFriendModal
          isOpen={showAddFriendModal}
          onClose={() => setShowAddFriendModal(false)}
        />
      </div>

      {data?.map((friend) => (
        <div key={friend.contact_id}>{friend.contact_name}</div>
      ))}
      <div className="pt-8"></div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
};

export default FriendsKeeper;
