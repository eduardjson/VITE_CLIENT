import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { ActionDropdown } from "./ActionDropdown";
import { Profile } from "./Profile";

const Header = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const handleSelect = (_, i: number) => {
    const tabPaths = {
      0: "/products",
      1: "/warehouses",
      2: "/shipments",
      3: "/movements",
      4: "/returns",
      5: "/prices",
      6: "/analytics",
      7: "/employees",
      8: "/contractors",
    };
    setTabIndex(i);

    navigate({ to: tabPaths[i] });
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
          padding: "8px",
          paddingLeft: "20px",
          maxWidth: "inherit",
          height: "52px",
        }}
      >
        <div className="flex flex-row items-center">
          <Link to="/">СПБ-СНАБЖЕНИЕ</Link>
          <ActionDropdown
            label="Выберите доступное действие"
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
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          display: "flex",
          alignContent: "center",
        }}
        className="bg-blue-300 justify-between"
      >
        <Tabs
          value={tabIndex}
          onChange={handleSelect}
          aria-label="basic tabs example"
          className="flex flex-row justify-between"
        >
          <Tab label="Товары" tabIndex={0} />
          <Tab label="Склады" tabIndex={1} />
          <Tab label="Отгрузки" tabIndex={2} />
          <Tab label="Перемещения" tabIndex={3} />
          <Tab label="Возвраты" tabIndex={4} />
          <Tab label="Прайсы" tabIndex={5} />
          <Tab label="Аналитика" tabIndex={6} />
          <Tab label="Сотрудники" tabIndex={7} />
          <Tab label="Объекты" tabIndex={8} />
        </Tabs>
      </Box>
    </div>
  );
};

export default Header;
