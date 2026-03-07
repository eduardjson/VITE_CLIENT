import { createFileRoute } from "@tanstack/react-router";
import { CustomerCategoryList } from "../../components/price/CustomerCategoryList";
import { PriceHistory } from "../../components/price/PriceHistory";

export const Route = createFileRoute("/price-history/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CustomerCategoryList />
      <PriceHistory productId={""} />
    </div>
  );
}
