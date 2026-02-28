import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useGetCurrentUserQuery, useLogoutMutation } from "../../services";
import { useState } from "react";
import { ActionModal } from "../../components";

export const Route = createFileRoute("/me/")({
  component: MeProfile,
});

function MeProfile() {
  const { data } = useGetCurrentUserQuery();

  const [logout, { isLoading }] = useLogoutMutation();

  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleLogout = async () => {
    const confirm = window.confirm("Вы действительно хотите выйти?");
    if (!confirm) return;

    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await logout(refreshToken).unwrap();
      navigate({ to: "/auth/login" });
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  if (!data) {
    return (
      <Card>
        <CardHeader title="Мой профиль" />
        <CardContent>
          <Typography>Загрузка...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={`${data.firstName} ${data.lastName}`} />
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            alt={`${data.firstName} ${data.lastName}`}
            src={data.avatar}
            sx={{ width: 128, height: 128 }}
          />
          <Typography>Username: {data.username}</Typography>
          <Typography>Email: {data.email}</Typography>
          <Typography>Phone: {data.phone}</Typography>
          <Typography>
            Role: {Array.isArray(data.role) ? data.role.join(", ") : data.role}
          </Typography>
          <Typography>
            Зарегистрирован: {new Date(data.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button onClick={handleOpenConfirm}>Выйти из профиля</Button>
        <ActionModal
          title="Выход"
          actionName="Выход из системы"
          cancelName="Отмена"
          content="Подтвердите выход. Все не сохраненные данные будут утеряны"
          open={confirmOpen}
          onClose={handleCloseConfirm}
          onSubmitAction={handleLogout}
        />
      </CardActions>
    </Card>
  );
}
