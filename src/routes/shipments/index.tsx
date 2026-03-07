import { createFileRoute } from "@tanstack/react-router";
import { ShipmentList } from "../../components/shipment/ShipmentList";

export const Route = createFileRoute("/shipments/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShipmentList />;
}
