import { AppBar, Box, Tab, Tabs, useTheme } from "@mui/material";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ActionDropdown } from "./ActionDropdown";
import { Profile } from "./Profile";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  // Маппинг путей к индексам
  const tabPaths: Record<string, number> = {
    "/products": 0,
    "/warehouses": 1,
    "/shipments": 2,
    "/movements": 3,
    "/returns": 4,
    "/prices": 5,
    "/analytics": 6,
    "/employees": 7,
    "/free-chat": 8,
    "/contractors": 9,
  };

  // Определяем активный таб на основе текущего пути
  const getActiveTabIndex = (): number => {
    // Проверяем точное совпадение
    if (currentPath in tabPaths) {
      return tabPaths[currentPath];
    }

    // Проверяем вложенные пути (например /products/add)
    for (const [path, index] of Object.entries(tabPaths)) {
      if (currentPath.startsWith(path + "/")) {
        return index;
      }
    }

    return 0; // По умолчанию первый таб
  };

  const [tabIndex, setTabIndex] = useState(getActiveTabIndex());

  // Обновляем таб при изменении пути
  useEffect(() => {
    setTabIndex(getActiveTabIndex());
  }, [currentPath]);

  const handleSelect = (_: React.SyntheticEvent, newValue: number) => {
    // Находим путь по индексу
    const path = Object.keys(tabPaths).find(key => tabPaths[key] === newValue);
    if (path) {
      setTabIndex(newValue);
      navigate({ to: path });
    }
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
          height: "64px",
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex flex-row items-center gap-4">
          <Link
            to="/"
            className="font-bold text-xl"
            style={{ color: theme.palette.primary.main }}
          >
            СПБ-СНАБЖЕНИЕ
          </Link>
          <ActionDropdown
            label="Действия"
            actions={[
              {
                action: () => navigate({ to: "/products/add" }),
                label: "Добавить продукт",
                key: "ADD_PRODUCT",
              },
            ]}
          />
        </div>
        <Profile />
      </AppBar>

      <Box
        sx={{
          width: "100%",
          bgcolor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleSelect}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Навигационные вкладки"
          sx={{
            minHeight: "48px",
            px: 2,
            "& .MuiTabs-indicator": {
              height: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              minHeight: "48px",
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "text.secondary",
              transition: "color 0.2s, background-color 0.2s",
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
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
        </Tabs>
      </Box>
    </div>
  );
};

export default Header;
