import { AppBar, Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Profile } from "./Profile";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const handleSelect = (_: React.SyntheticEvent, newValue: number) => {
    const tabPaths: Record<number, string> = {
      0: "/products",
      1: "/warehouses",
      2: "/shipments",
      3: "/movements",
      4: "/returns",
      5: "/prices",
      6: "/analytics",
      7: "/employees",
      8: "/free-chat",
      9: "/contractors",
      10: "/price-history",
    };
    setTabIndex(newValue);
    navigate({ to: tabPaths[newValue] });
  };

  const titles: Record<number, string> = {
    0: "Работа с материалами",
    1: "Управление складом",
    2: "Отгрузки",
    3: "Перемещения",
    4: "Возвраты материалов и оборудования",
    5: "Прайсы",
    6: "Просмотр статистики",
    7: "Список сотрудников",
    8: "Чат для документов",
    9: "Работа с подрядчиками",
    10: "Формирование цен",
  };

  return (
    <div className="flex flex-col w-full">
      <AppBar
        position="sticky"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 20px",
          height: "56px", // Можно уменьшить и шапку
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex flex-row items-center gap-4">
          <Link
            to="/"
            style={{ color: theme.palette.primary.main }}
            className="font-bold"
          >
            СПБ-СНАБЖЕНИЕ
          </Link>
        </div>
        <Profile />
      </AppBar>

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabIndex}
          onChange={handleSelect}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 30, // 👈 УМЕНЬШИЛ ВЫСОТУ
            "& .MuiTab-root": {
              minHeight: 30, // 👈 И ЗДЕСЬ ТОЖЕ
              textTransform: "none",
              fontSize: "0.85rem",
              py: 0.5,
            },
            "& .MuiTabs-indicator": {
              height: 2, // 👈 ТОНЬШЕ ИНДИКАТОР
            },
          }}
        >
          <Tab label="Товары" />
          <Tab label="Склады" />
          <Tab label="Отгрузки" />
          <Tab label="Перемещения" />
          <Tab label="Возвраты" />
          <Tab label="Прайсы" />
          <Tab label="Аналитика" />
          <Tab label="Сотрудники" />
          <Tab label="Чат" />
          <Tab label="Объекты" />
          <Tab label="Формирование цен" />
        </Tabs>
        <Typography variant="h6" className="px-5 pt-2">
          {titles[tabIndex]}
        </Typography>
      </Box>
    </div>
  );
};

export default Header;
