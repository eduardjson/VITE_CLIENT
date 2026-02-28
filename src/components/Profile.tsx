import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useGetCurrentUserQuery, useLogoutMutation } from "../services";
import { Login, ExitToApp } from "@mui/icons-material";

export const Profile = () => {
  const [logout, { isLoading, error }] = useLogoutMutation();
  // Стейт для управления видимостью диалогового окна
  const [open, setOpen] = useState(false);

  // Получаем текущего пользователя
  const { data } = useGetCurrentUserQuery();

  // Обработчик открытия диалогового окна
  const handleClickOpen = () => {
    if (data?.username) {
      setOpen(true); // Открываем диалоговое окно, если пользователь залогинен
    }
  };

  // Закрытие диалогового окна
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // Или берёте откуда-то ещё
    try {
      await logout(refreshToken).unwrap();
      alert("Вы успешно вышли из системы.");
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };
  return (
    <>
      {/* Основной контейнер */}
      <div className="flex flex-row">
        {data?.username ? (
          /* Аватар пользователя */
          <Avatar
            alt=""
            src={data?.avatar}
            onClick={handleClickOpen} // При клике показываем профиль
            sx={{
              cursor: "pointer", // Добавляем стили курсора
              width: 30,
              height: 30,
            }}
          />
        ) : (
          /* Кнопка входа, если пользователь не залогинен */
          <Button color="primary" href="/auth/login">
            <Login />
          </Button>
        )}
      </div>

      {/* Диалоговое окно профиля */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Профиль пользователя</DialogTitle>
        <DialogContent>
          {/* Увеличенный аватар пользователя */}
          <Avatar
            alt={data?.username || ""}
            src={data?.avatar}
            style={{ marginBottom: "1rem" }}
            sx={{ width: 80, height: 80 }}
          />
          {/* Имя пользователя */}
          <Typography variant="h6">{data?.username}</Typography>
          {/* Дополнительная информация (например email) */}
          <Typography>{data?.email}</Typography>
        </DialogContent>
        <DialogActions>
          {/* Кнопка выхода из системы */}
          <Button onClick={handleLogout}>
            Выход <ExitToApp />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
