import { createFileRoute } from "@tanstack/react-router";
import { useGetAllUsersQuery } from "../../services";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/employees/$employeeId")({
  component: EmployeeDetail,
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
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.75 }}>
    <Box sx={{ color: "text.secondary", minWidth: 20 }}>{icon}</Box>
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.75rem" }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "0.95rem" }}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

function EmployeeDetail() {
  const { employeeId } = Route.useParams();
  const { data } = useGetAllUsersQuery();

  const user = data?.find(u => String(u.id) === String(employeeId));

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Загрузка… или сотрудник не найден
        </Typography>
      </Box>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Пользователь";
  const roles = Array.isArray(user.role) ? user.role : [user.role];

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      {/* Заголовок */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 400, color: "text.primary", mb: 3 }}
      >
        Профиль сотрудника
      </Typography>

      {/* Основной контент */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Левая колонка с аватаром и основной информацией */}
        <Box sx={{ width: { md: 240 } }}>
          <Avatar
            src={user.avatar}
            alt={fullName}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              bgcolor: "grey.200",
              color: "text.primary",
              fontSize: "2.5rem",
            }}
          >
            {!user.avatar && (user.firstName?.[0] || user.username?.[0] || "U")}
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
            {fullName}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            @{user.username}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {roles.map((role, index) => (
              <Chip
                key={index}
                label={role}
                size="small"
                sx={{
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  borderRadius: 1,
                  fontSize: "0.7rem",
                  height: 24,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Правая колонка с детальной информацией */}
        <Box sx={{ flex: 1 }}>
          {/* Контактная информация */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                mb: 1,
                letterSpacing: 0.5,
              }}
            >
              КОНТАКТЫ
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <InfoItem
                icon={<EmailIcon fontSize="small" />}
                label="Email"
                value={user.email}
              />
              <InfoItem
                icon={<PhoneIcon fontSize="small" />}
                label="Телефон"
                value={user.phone}
              />
            </Paper>
          </Box>

          {/* Дополнительная информация */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                mb: 1,
                letterSpacing: 0.5,
              }}
            >
              ИНФОРМАЦИЯ
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <InfoItem
                icon={<BadgeIcon fontSize="small" />}
                label="ID"
                value={user.id?.toString()}
              />
              <InfoItem
                icon={<PersonIcon fontSize="small" />}
                label="Имя пользователя"
                value={user.username}
              />
            </Paper>
          </Box>

          {/* Даты */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                mb: 1,
                letterSpacing: 0.5,
              }}
            >
              ДАТЫ
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <InfoItem
                icon={<CalendarIcon fontSize="small" />}
                label="Зарегистрирован"
                value={
                  user.createdAt
                    ? format(new Date(user.createdAt), "d MMMM yyyy", {
                        locale: ru,
                      })
                    : "—"
                }
              />
              <InfoItem
                icon={<UpdateIcon fontSize="small" />}
                label="Обновлен"
                value={
                  user.updatedAt
                    ? format(new Date(user.updatedAt), "d MMMM yyyy", {
                        locale: ru,
                      })
                    : "—"
                }
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
