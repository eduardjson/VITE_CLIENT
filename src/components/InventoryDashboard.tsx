import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Container, Typography } from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  LocationOn as ObjectIcon,
  LocalShipping as ShipmentIcon,
} from "@mui/icons-material";

import ProductList from "./ProductList";
import { WarehouseList } from "./warehouse/WarehouseList";
import { ObjectList } from "./object/ObjectList";
import { ShipmentList } from "./shipment/ShipmentList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const InventoryDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление складом
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<InventoryIcon />} label="Товары" />
          <Tab icon={<WarehouseIcon />} label="Склады" />
          <Tab icon={<ObjectIcon />} label="Объекты" />
          <Tab icon={<ShipmentIcon />} label="Отгрузки" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <ProductList />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <WarehouseList />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ObjectList />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ShipmentList />
      </TabPanel>
    </Container>
  );
};
