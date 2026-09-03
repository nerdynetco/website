"use client";

import dynamic from "next/dynamic";
import type { PollType } from "src/models/poll";

const DeletePoll = dynamic(() => import("./delete-poll"), {
  loading: () => null,
});

export default function DeletePollLazy({
  pollId,
}: {
  pollId: PollType["_id"];
}) {
  return <DeletePoll pollId={pollId} />;
}
