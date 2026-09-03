"use client";
import { useEffect, useState } from "react";
import type { PollType } from "src/models/poll";

export const ClosingBadge = ({ poll }: { poll: PollType }) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const closesAt = new Date(poll.closesAt);
      const timeDifference = closesAt.getTime() - now.getTime();
      if (timeDifference <= 0) {
        setRemainingTime("Closed");
      } else {
        setRemainingTime(formatRemainingTime(timeDifference));
      }
    };

    calculateRemainingTime();
    const intervalId = setInterval(calculateRemainingTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [poll.closesAt]);

  return remainingTime === "Closed" ? "Closed" : `Closing in: ${remainingTime}`;
};

function formatRemainingTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    days && `${days} day${days === 1 ? "" : "s"}`,
    hours && `${hours} hour${hours === 1 ? "" : "s"}`,
    minutes && `${minutes} minute${minutes === 1 ? "" : "s"}`,
    remainingSeconds && `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}
