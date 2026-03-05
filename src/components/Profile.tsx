import { Avatar, Button, Link } from "@mui/material";
import { useGetCurrentUserQuery } from "../services";
import { Login } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";

export const Profile = () => {
  const { data } = useGetCurrentUserQuery();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      {data?.username ? (
        <>
          <Link href="/me" className="no-underline">
            <Avatar
              alt={data?.username || ""}
              src={data?.avatar}
              onClick={() => navigate({ to: "/me" })}
              className="cursor-pointer scale-80"
            />
          </Link>
        </>
      ) : (
        <Button color="primary" href="/auth/login">
          <Login />
        </Button>
      )}
    </div>
  );
};
