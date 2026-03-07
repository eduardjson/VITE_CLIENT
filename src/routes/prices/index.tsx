import { createFileRoute } from "@tanstack/react-router";
import { ProductPrices } from "../../components/price/ProductPrices";

export const Route = createFileRoute("/prices/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductPrices productId={"9"} />;
}
