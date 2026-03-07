import { createFileRoute } from "@tanstack/react-router";
import { ObjectList } from "../../components/object/ObjectList";

export const Route = createFileRoute("/contractors/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ObjectList />;
}
