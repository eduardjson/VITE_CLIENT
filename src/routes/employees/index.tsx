import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGetAllUsersQuery } from "../../services";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from "@mui/material";

export const Route = createFileRoute("/employees/")({
  component: Employees,
});

function Employees() {
  const { data } = useGetAllUsersQuery();
  const navigate = useNavigate();

  const handleRowClick = user => {
    // Navigate to the detail page for the selected user
    navigate({ to: `/employees/${user.id}` });
  };

  const columns = [
    { label: "Логин", field: "username" },
    { label: "Имя", field: "firstName" },
    { label: "Фамилия", field: "lastName" },
    { label: "Роль", field: "role" },
  ];

  return (
    <Card>
      <CardHeader title="Сотрудники" />
      <CardContent>
        <TableContainer>
          <Table aria-label="employee-table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.label}>{column.label}</TableCell>
                ))}
                <TableCell>Фото профиля</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map(row => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => handleRowClick(row)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F0F0F0",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {columns.map(column => (
                      <TableCell key={column.field}>
                        {column.field === "role"
                          ? row[column.field].join(", ")
                          : column.field === "createdAt" ||
                              column.field === "updatedAt"
                            ? new Date(row[column.field]).toLocaleString()
                            : row[column.field]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Avatar
                        alt={`${row.firstName} ${row.lastName}`}
                        src={row.avatar}
                        sx={{ width: 30, height: 30 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
