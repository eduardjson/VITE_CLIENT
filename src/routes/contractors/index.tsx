import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contractors/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/contractors/"!</div>;
}
