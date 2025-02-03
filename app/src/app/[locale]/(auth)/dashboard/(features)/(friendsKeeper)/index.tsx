"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddTrackedFriendModal from "./addTrackedFriendModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../../../../../lib/db/supabase";


const FriendsKeeper = () => {
  const [friendName, setFriendName] = useState<string>("");
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const userId = "user_2roH7uYsYk5m4ORVmNkCw7KLqrh";
  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("user_contacts").select("*").eq("user_id", userId);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(data);
      }
    };
    fetchData();
  }, []);

  console.log("data", data);
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
