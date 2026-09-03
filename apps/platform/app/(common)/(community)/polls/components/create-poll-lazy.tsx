"use client";

import dynamic from "next/dynamic";

const CreatePoll = dynamic(() => import("./create-poll"), {
  loading: () => null,
});

export default function CreatePollLazy() {
  return <CreatePoll />;
}
