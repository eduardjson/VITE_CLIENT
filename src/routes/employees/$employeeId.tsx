import { createFileRoute } from "@tanstack/react-router";

import { useGetAllUsersQuery } from "../../services";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
} from "@mui/material";

export const Route = createFileRoute("/employees/$employeeId")({
  component: EmployeeDetail,
});

function EmployeeDetail() {
  const { employeeId } = Route.useParams();
  const { data } = useGetAllUsersQuery();

  // Fallback: find the user in the list; alternatively fetch a single user by id if you have such an API
  const user = data?.find(u => String(u.id) === String(employeeId));

  if (!user) {
    return (
      <Card>
        <CardHeader title="Сотрудник" />
        <CardContent>
          <Typography>Загрузка… или сотрудник не найден.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={`${user.firstName} ${user.lastName}`} />
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            alt={`${user.firstName} ${user.lastName}`}
            src={user.avatar}
            sx={{ width: 128, height: 128 }}
          />
          <Typography variant="h6">{user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone}</Typography>
          <Typography>Роль: {user.role?.join?.(", ") ?? user.role}</Typography>
          <Typography>
            Зарегистрирован: {new Date(user.createdAt).toLocaleString()}
          </Typography>
          <Typography>
            Обновлен: {new Date(user.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
