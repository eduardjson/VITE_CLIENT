import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}></Box>
      <Outlet />
    </>
  );
}
