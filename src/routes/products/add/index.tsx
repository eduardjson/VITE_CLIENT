import { createFileRoute } from "@tanstack/react-router";
import ProductForm from "../../../components/ProductForm/ProductForm";

export const Route = createFileRoute("/products/add/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductForm mode="create" onClose={() => {}} />;
}
