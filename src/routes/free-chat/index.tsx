import { createFileRoute } from "@tanstack/react-router";

import { ChatScreen } from "../../ChatScreen";

export const Route = createFileRoute("/free-chat/")({
  component: ChatScreen,
});
