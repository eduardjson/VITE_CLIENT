import { createFileRoute } from "@tanstack/react-router";
import { WarehouseList } from "../../components/warehouse/WarehouseList";

export const Route = createFileRoute("/warehouses/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WarehouseList />;
}
