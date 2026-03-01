import { createFileRoute } from "@tanstack/react-router";

import { ChatScreen } from "../../ChatScreen";
import { useGetCurrentUserQuery } from "../../services";

export const Route = createFileRoute("/free-chat/")({
  component: Component,
});

function Component() {
  const { data } = useGetCurrentUserQuery();

  if (!data?.id || !data?.username) {
    return null;
  }
  return <ChatScreen id={data.id} username={data.username} />;
}
