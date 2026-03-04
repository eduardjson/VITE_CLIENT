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
  useTheme,
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
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
    <Box sx={{ color: "primary.main", minWidth: 24 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || "Не указано"}</Typography>
    </Box>
  </Box>
);

function MeProfile() {
  const theme = useTheme();
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography>Загрузка профиля...</Typography>
      </Box>
    );
  }

  const fullName =
    `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Пользователь";
  const roles = Array.isArray(data.role) ? data.role : [data.role];
  const isAdmin = roles.includes("ADMIN") || roles.includes("admin");

  return (
    <Box
      sx={{
        minHeight: "95vh",
        width: "100%",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Верхняя часть с градиентом */}
      <Box
        sx={{
          height: 280,
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ height: "95%", position: "relative" }}>
          {/* Аватар */}
          <Avatar
            src={data.avatar}
            alt={fullName}
            sx={{
              width: 160,
              height: 160,
              border: "4px solid white",
              position: "absolute",
              bottom: -80,
              left: { xs: "50%", md: 32 },
              transform: { xs: "translateX(-50%)", md: "none" },
              boxShadow: theme.shadows[3],
              bgcolor: theme.palette.primary.main,
            }}
          >
            {!data.avatar && (data.firstName?.[0] || data.username?.[0] || "U")}
          </Avatar>

          {/* Кнопка редактирования */}
          <IconButton
            sx={{
              position: "absolute",
              bottom: 24,
              right: 24,
              bgcolor: "white",
              "&:hover": { bgcolor: "grey.100" },
            }}
            size="medium"
          >
            <EditIcon />
          </IconButton>
        </Container>
      </Box>

      {/* Основной контент */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Box sx={{ mt: 8 }}>
          {/* Имя пользователя и роль */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="600"
                sx={{ mb: 1 }}
              >
                {fullName}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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

          <Divider sx={{ my: 4 }} />

          {/* Информация в две колонки */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="500"
                sx={{ mb: 3 }}
              >
                Контактная информация
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
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
                fontWeight="500"
                sx={{ mb: 3 }}
              >
                Дополнительная информация
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
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
              <Divider sx={{ my: 4 }} />
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="500"
                sx={{ mb: 2 }}
              >
                О себе
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {data.bio}
                </Typography>
              </Paper>
            </>
          )}

          {/* ID и кнопка выхода */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ID: {data.id || "Не указан"}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<LogoutIcon />}
              onClick={handleOpenConfirm}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 4 }}
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
