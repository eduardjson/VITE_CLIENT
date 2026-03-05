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

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 400, color: "text.primary", mb: 3 }}
      >
        Профиль сотрудника
      </Typography>
    </Box>
  );
}
