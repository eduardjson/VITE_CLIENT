import { Avatar, Button, Link } from "@mui/material";
import { useGetCurrentUserQuery } from "../services";
import { Login } from "@mui/icons-material";

import { useNavigate } from "@tanstack/react-router";

export const Profile = () => {
  const { data } = useGetCurrentUserQuery();
  const navigate = useNavigate();

  const goToMe = () => navigate("/me" as any);

  return (
    <>
      <div
        className="flex flex-row"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {data?.username ? (
          <>
            <Link href="/me">
              <Avatar
                alt={data?.username || ""}
                src={data?.avatar}
                onClick={goToMe}
                style={{ cursor: "pointer" }}
                sx={{ width: 30, height: 30 }}
              />
            </Link>
          </>
        ) : (
          <Button color="primary" href="/auth/login">
            <Login />
          </Button>
        )}
      </div>
    </>
  );
};
