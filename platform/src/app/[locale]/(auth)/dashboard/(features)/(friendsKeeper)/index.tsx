"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSaveWeatherShortcut } from "@/hooks/useSaveWeatherShortcut";
import { addTrackedFriend } from "../../../../../../../../shared/db/utils";
import { useTrackedFriends } from "@/hooks/useTrackedFriends";
import { useToggleTrackedFriend } from "@/hooks/useToggleTrackedFriend";
import AddTrackedFriendModal from "./addTrackedFriendModal";

const FriendsKeeper = () => {
  const [friendName, setFriendName] = useState<string>("");
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);

  const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";

  const { data: trackedFriends, isLoading, error } = useTrackedFriends(userId);
  // const toggleTrackedFriend = useToggleTrackedFriend(userId);
  console.log("trackedFriends", trackedFriends);
  return (
    <div className="w-full flex flex-col border-2 border-gray-200 p-5">
      <div className="flex pb-10 justify-between gap-2">
        <p className="text-2xl">Friends Keeper</p>
        <Button onClick={() => setShowAddFriendModal(true)}>Add</Button>
        <AddTrackedFriendModal
          userId={userId}
          isOpen={showAddFriendModal}
          onClose={() => setShowAddFriendModal(false)}
        />
      </div>
      <div className="pt-8"></div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
};

export default FriendsKeeper;
