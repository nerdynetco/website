import { getRepoContributors, getRepoStats } from "~/lib/third-party/github";
import { appConfig } from "~/project.config";
import PageClient from "./page-client";

export const metadata = {
  title: "About | Nerdy Network",
  description: "The internet's messiest, nerdiest corner.",
};

export default function Page() {
  // We are no longer fetching data here. 
  // We simply render the static Client Component.
  return <PageClient />;
}