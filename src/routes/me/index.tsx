import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
  Paper,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useGetCurrentUserQuery, useLogoutMutation } from "../../services";
import { useState } from "react";
import { ActionModal } from "../../components";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/me/")({
  component: MeProfile,
});

// Компонент для отображения информации с иконкой
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box className="flex items-start gap-3 py-1">
    <Box className="text-primary min-w-[24px]">{icon}</Box>
    <Box>
      <Typography variant="caption" className="text-gray-600">
        {label}
      </Typography>
      <Typography variant="body2">{value || "Не указано"}</Typography>
    </Box>
  </Box>
);

function MeProfile() {
  const { data } = useGetCurrentUserQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleLogout = async () => {
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
      <Box className="flex justify-center items-center h-screen w-screen bg-gray-100">
        <Typography>Загрузка профиля...</Typography>
      </Box>
    );
  }

  const fullName =
    `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Пользователь";
  const roles = Array.isArray(data.role) ? data.role : [data.role];
  const isAdmin = roles.includes("ADMIN") || roles.includes("admin");

  return (
    <Box className="min-h-[95vh] w-full bg-gray-100 flex flex-col">
      {/* Верхняя часть с градиентом */}
      <Box className="h-[280px] relative">
        <Container maxWidth="lg" className="h-[95%] relative">
          {/* Аватар */}
          <Avatar
            src={data.avatar}
            alt={fullName}
            className="w-40 h-40 border-4 border-white absolute -bottom-20 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 shadow-lg"
            sx={{ bgcolor: "primary.main" }}
          >
            {!data.avatar && (data.firstName?.[0] || data.username?.[0] || "U")}
          </Avatar>

          {/* Кнопка редактирования */}
          <IconButton
            className="absolute bottom-6 right-6 bg-white hover:bg-gray-100"
            size="medium"
          >
            <EditIcon />
          </IconButton>
        </Container>
      </Box>

      {/* Основной контент */}
      <Container maxWidth="lg" className="flex-1 py-4">
        <Box className="mt-8">
          {/* Имя пользователя и роль */}
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
            <Box>
              <Typography
                variant="h3"
                component="h1"
                className="font-semibold mb-1"
              >
                {fullName}
              </Typography>
              <Box className="flex gap-1 flex-wrap">
                <Chip
                  label={`@${data.username}`}
                  size="small"
                  icon={<PersonIcon />}
                  variant="outlined"
                />
                {isAdmin && (
                  <Chip
                    label="Администратор"
                    size="small"
                    color="warning"
                    icon={<AdminIcon />}
                  />
                )}
                {roles.map(
                  (role, index) =>
                    role !== "ADMIN" &&
                    role !== "admin" && (
                      <Chip
                        key={index}
                        label={role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ),
                )}
                <Chip label="Активен" size="small" color="success" />
              </Box>
            </Box>
          </Box>

          <Divider className="my-4" />

          {/* Информация в две колонки */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                className="font-medium mb-3"
              >
                Контактная информация
              </Typography>
              <Paper variant="outlined" className="p-3 rounded-lg">
                <InfoItem
                  icon={<EmailIcon />}
                  label="Email"
                  value={data.email}
                />
                <InfoItem
                  icon={<PhoneIcon />}
                  label="Телефон"
                  value={data.phone}
                />
                <InfoItem
                  icon={<BadgeIcon />}
                  label="Username"
                  value={data.username}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                className="font-medium mb-3"
              >
                Дополнительная информация
              </Typography>
              <Paper variant="outlined" className="p-3 rounded-lg">
                <InfoItem
                  icon={<PersonIcon />}
                  label="Имя"
                  value={data.firstName || "Не указано"}
                />
                <InfoItem
                  icon={<PersonIcon />}
                  label="Фамилия"
                  value={data.lastName || "Не указано"}
                />
                <InfoItem
                  icon={<CalendarIcon />}
                  label="Зарегистрирован"
                  value={
                    data.createdAt
                      ? format(new Date(data.createdAt), "d MMMM yyyy", {
                          locale: ru,
                        })
                      : "Не указано"
                  }
                />
              </Paper>
            </Grid>
          </Grid>

          {/* О себе */}
          {data.bio && (
            <>
              <Divider className="my-4" />
              <Typography
                variant="h6"
                gutterBottom
                className="font-medium mb-2"
              >
                О себе
              </Typography>
              <Paper variant="outlined" className="p-3 rounded-lg">
                <Typography variant="body1" className="text-gray-600">
                  {data.bio}
                </Typography>
              </Paper>
            </>
          )}

          {/* ID и кнопка выхода */}
          <Box className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <Typography variant="body2" className="text-gray-600">
              ID: {data.id || "Не указан"}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<LogoutIcon />}
              onClick={handleOpenConfirm}
              disabled={isLoading}
              className="rounded-lg px-4"
            >
              {isLoading ? "Выход..." : "Выйти из профиля"}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Модальное окно подтверждения выхода */}
      <ActionModal
        title="Выход из системы"
        actionName="Выйти"
        cancelName="Отмена"
        content="Вы действительно хотите выйти из системы? Все несохраненные данные могут быть утеряны."
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onSubmitAction={handleLogout}
      />
    </Box>
  );
}
