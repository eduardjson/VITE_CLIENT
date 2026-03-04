import React, { useEffect, useState, useRef } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import TimeAgo from "react-timeago";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useChat } from "./useChat";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const notify = (message: string) =>
  toast.info(message, {
    position: "top-left",
    autoClose: 1000,
    hideProgressBar: true,
    transition: Slide,
  });

export const ChatScreen = ({
  id,
  username,
}: {
  id: string;
  username: string;
}) => {
  const theme = useTheme();
  const { messages, log, chatActions } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("");
  const [editingState, setEditingState] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(0);

  // Состояния для отображения градиентов
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const message = {
      userId: id,
      userName: username,
      text,
    };

    if (editingState) {
      chatActions.update({ id: editingMessageId, text });
      setEditingState(false);
    } else {
      chatActions.send(message);
    }

    setText("");
  };

  const removeMessage = (id: number) => {
    chatActions.remove({ id });
  };

  // Функция для проверки прокрутки
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // Показываем верхний градиент, если прокрутили вниз хотя бы на 10px
      setShowTopGradient(scrollTop > 10);

      // Показываем нижний градиент, если не дошли до конца (с запасом 10px)
      setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
    }
  };

  // Следим за прокруткой и изменениями в сообщениях
  useEffect(() => {
    checkScroll();
  }, [messages]);

  // Добавляем обработчик прокрутки
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll);
      return () => scrollElement.removeEventListener("scroll", checkScroll);
    }
  }, []);

  useEffect(() => {
    if (!log) return;
    notify(log);
  }, [log]);

  return (
    <Card className="min-w-100 max-w-250 h-9/10 p-4 gap-4 flex flex-col">
      <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
        {/* Верхний градиент */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 30,
            background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)} 0%, transparent 100%)`,
            opacity: showTopGradient ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Нижний градиент */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            background: `linear-gradient(to top, ${alpha(theme.palette.background.paper, 0.95)} 0%, transparent 100%)`,
            opacity: showBottomGradient ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Область сообщений (скролл) */}
        <Box
          ref={scrollRef}
          className="flex flex-col h-full overflow-y-scroll"
          sx={{
            overflowY: "auto",
            pr: 1,
            // Скрываем скролл, но оставляем функциональность
            "&::-webkit-scrollbar": {
              display: "none", // Для Chrome, Safari, Opera
            },
            scrollbarWidth: "none", // Для Firefox
            msOverflowStyle: "none", // Для IE и Edge
          }}
        >
          <Box sx={{ pt: 2, pb: 2 }}>
            {messages && messages.length > 0 ? (
              messages.map((message, i) => {
                const isMsgBelongsToUser = message.userId === id;
                return (
                  <div
                    key={message.id}
                    className={[
                      "my-2 p-4 rounded-lg text-gray-800 w-[75%]",
                      isMsgBelongsToUser
                        ? "self-end border border-green-500 bg-green-300"
                        : "self-start border border-blue-500 bg-blue-300",
                      editingState && editingMessageId === message.id
                        ? "opacity-50"
                        : "",
                    ].join(" ")}
                    style={{
                      marginLeft: isMsgBelongsToUser ? "auto" : undefined,
                      marginRight: isMsgBelongsToUser ? undefined : "auto",
                    }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        {isMsgBelongsToUser ? "Вы: " : ""}
                        {message.userName}
                      </span>
                      <TimeAgo date={message.createdAt} />
                    </div>
                    <p>{message.text}</p>
                    {isMsgBelongsToUser && (
                      <div className="flex justify-end mt-2">
                        <Button
                          size="small"
                          disabled={editingState}
                          onClick={() => {
                            setEditingState(true);
                            setEditingMessageId(message.id);
                            setText(message.text);
                          }}
                          sx={{ minWidth: "auto", p: 0.5, mr: 0.5 }}
                        >
                          <FiEdit2
                            size="18"
                            color={editingState ? "#ccc" : "#22c55e"}
                          />
                        </Button>
                        <Button
                          size="small"
                          disabled={editingState}
                          onClick={() => {
                            removeMessage(message.id);
                          }}
                          sx={{ minWidth: "auto", p: 0.5 }}
                        >
                          <FiTrash
                            size="18"
                            color={editingState ? "#ccc" : "#22c55e"}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <Box className="flex items-center justify-center h-full text-gray-400">
                Нет сообщений. Напишите что-нибудь!
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Форма отправки сообщения */}
      <CardActions className="flex flex-row" sx={{ pt: 2 }}>
        <TextField
          type="text"
          id="message"
          name="message"
          size="small"
          value={text}
          onChange={changeText}
          required
          autoComplete="off"
          className="input flex-1"
          placeholder="Введите сообщение..."
          onKeyPress={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
        />
        {editingState && (
          <Button
            variant="text"
            color="error"
            type="button"
            onClick={() => {
              setEditingState(false);
              setText("");
            }}
            sx={{ minWidth: "auto", p: 1 }}
          >
            <MdOutlineClose fontSize={20} />
          </Button>
        )}
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={sendMessage}
          disabled={!text.trim()}
          sx={{ minWidth: "auto", p: 1 }}
        >
          <Send className="-rotate-45 scale-75" />
        </Button>
      </CardActions>

      <ToastContainer />
    </Card>
  );
};
