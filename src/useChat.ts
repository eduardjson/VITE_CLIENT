import { useCallback, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_URI, USER_INFO } from "./constants";
import { Message, MessageUpdatePayload, MessageCreatePayload } from "./types";
import axios from "axios";

// экземпляр сокета
let socket: Socket;

export const useChat = () => {
  const userInfo = USER_INFO;

  // это важно: один пользователь - один сокет
  if (!socket) {
    socket = io(SERVER_URI, {
      query: {
        userName: userInfo.userName,
      },
    });
  }

  const [messages, setMessages] = useState<Message[]>();
  const [log, setLog] = useState<string>();

  useEffect(() => {
    socket.on("log", (log: string) => {
      setLog(log);
    });

    socket.on("messages", (messages: Message[]) => {
      setMessages(messages);
    });

    socket.emit("messages:get");

    return () => {
      socket.off("log");
      socket.off("messages");
    };
  }, []);

  // Функция для загрузки файлов
  const uploadFiles = useCallback(async (files: File[]): Promise<any[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        // `${SERVER_URI}/attachments/upload`,
        "http://localhost:5000/api/attachments/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки файлов:", error);
      return [];
    }
  }, []);

  // отправка сообщения с файлами
  const send = useCallback(
    async (payload: MessageCreatePayload, files?: File[]) => {
      if (files && files.length > 0) {
        const uploadedFiles = await uploadFiles(files);
        socket.emit("message:post", {
          ...payload,
          attachments: uploadedFiles,
        });
      } else {
        socket.emit("message:post", payload);
      }
    },
    [uploadFiles],
  );

  const update = useCallback((payload: MessageUpdatePayload) => {
    socket.emit("message:put", payload);
  }, []);

  const remove = useCallback((payload: { id: number }) => {
    socket.emit("message:delete", payload);
  }, []);

  window.clearMessages = useCallback(() => {
    socket.emit("messages:clear");
    location.reload();
  }, []);

  const chatActions = useMemo(
    () => ({
      send,
      update,
      remove,
      uploadFiles,
    }),
    [send, update, remove, uploadFiles],
  );

  return { messages, log, chatActions };
};
