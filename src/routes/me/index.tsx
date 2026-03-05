import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
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

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box className="flex items-start gap-2">
    <Box className="text-gray-400 min-w-6">{icon}</Box>
    <Box>
      <Typography variant="body2" className="text-gray-500">
        {label}
      </Typography>
      <Typography variant="body1" className="font-medium">
        {value || "—"}
      </Typography>
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
      <Box className="flex justify-center items-center h-screen w-screen">
        <Typography>Загрузка профиля...</Typography>
      </Box>
    );
  }

  const fullName =
    `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Пользователь";
  const roles = Array.isArray(data.role) ? data.role : [data.role];
  const isAdmin = roles.includes("ADMIN") || roles.includes("admin");

  return (
    <Dialog open fullScreen>
      <Box className=" bg-white flex flex-col gap-10 p-4 min-w-150 mx-auto my-auto">
        <Box
          className={`flex flex-row justify-start w-full h-50 items-start gap-4`}
        >
          <div className="w-50 h-50 overflow-hidden rounded-sm">
            <img
              src={data.avatar}
              alt={fullName}
              width="220"
              height="220"
              className="scale-120"
            />
          </div>
          <Box className="flex flex-col items-start gap-2 flex-wrap">
            <Typography variant="h4">{fullName}</Typography>
            <Box className="flex gap-2 flex-wrap mt-2 items-center">
              <Chip
                label={`@${data.username}`}
                size="small"
                variant="outlined"
                className="border-gray-200"
              />
              {isAdmin && (
                <Chip
                  label="Администратор"
                  size="small"
                  icon={<AdminIcon />}
                  className="bg-amber-50 text-amber-700 border-amber-200"
                />
              )}
              {roles.map(
                (role, index) =>
                  role === "USER" && (
                    <Chip
                      key={index}
                      label={"Пользователь"}
                      size="small"
                      variant="outlined"
                      className="border-green-600"
                    />
                  ),
              )}
              <IconButton size="small" className="text-gray-800">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-col gap-2">
          <InfoItem
            icon={<EmailIcon fontSize="small" />}
            label="Email"
            value={data.email}
          />
          <InfoItem
            icon={<PhoneIcon fontSize="small" />}
            label="Телефон"
            value={data.phone}
          />
          <InfoItem
            icon={<BadgeIcon fontSize="small" />}
            label="Username"
            value={data.username}
          />
          <InfoItem
            icon={<PersonIcon fontSize="small" />}
            label="Имя"
            value={data.firstName}
          />
          <InfoItem
            icon={<PersonIcon fontSize="small" />}
            label="Фамилия"
            value={data.lastName}
          />
          <InfoItem
            icon={<CalendarIcon fontSize="small" />}
            label="Зарегистрирован"
            value={
              data.createdAt
                ? format(new Date(data.createdAt), "d MMMM yyyy", {
                    locale: ru,
                  })
                : ""
            }
          />
        </Box>
        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-400 font-mono">
            ID: {data.id || "—"}
          </Typography>
          <Button
            variant="text"
            color="error"
            size="medium"
            startIcon={<LogoutIcon />}
            onClick={handleOpenConfirm}
            disabled={isLoading}
            className="hover:bg-red-50 px-4 py-2"
          >
            {isLoading ? "Выход..." : "Выйти"}
          </Button>
        </Box>
        <ActionModal
          title="Выход из системы"
          actionName="Выйти"
          cancelName="Отмена"
          content="Вы действительно хотите выйти?"
          open={confirmOpen}
          onClose={handleCloseConfirm}
          onSubmitAction={handleLogout}
        />
      </Box>
    </Dialog>
  );
}
