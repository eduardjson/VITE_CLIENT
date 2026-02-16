import { Avatar, Button } from "@mui/material";
import { useGetCurrentUserQuery } from "../services";
import { Login, Logout } from "@mui/icons-material";

export const Profile = () => {
  const { data } = useGetCurrentUserQuery();

  return (
    <div className="flex flex-row">
      <Avatar alt="" src={data?.avatar} sx={{ width: 32, height: 32 }} />

      {data?.username ? (
        <Logout />
      ) : (
        <Button color="info" href="/auth/login">
          <Login />
        </Button>
      )}
    </div>
  );
};
