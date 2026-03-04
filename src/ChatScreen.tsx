import React, { useEffect, useState } from "react";
import { FiEdit2, FiSend, FiTrash } from "react-icons/fi";
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
  const { messages, log, chatActions } = useChat();

  const [text, setText] = useState("");
  const [editingState, setEditingState] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(0);

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

  useEffect(() => {
    if (!log) return;

    notify(log);
  }, [log]);

  return (
    <Card className="min-w-100 max-w-250 h-9/10 p-4 gap-4 flex flex-col">
      <CardHeader title="Чат для документов" />
      <CardContent
        className="flex flex-col overflow-y-scroll h-full mb-4"
        sx={{
          overflowY: "auto",
          // Стилизация скролла
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: 4,
            "&:hover": {
              background: "#555",
            },
          },
          // Для Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
        }}
      >
        {messages &&
          messages.length > 0 &&
          messages.map((message, i) => {
            const isMsgBelongsToUser = message.userId === id;
            return (
              <div
                key={message.id}
                className={[
                  "my-1 p-4 rounded-lg text-gray-800 w-[75%]",
                  isMsgBelongsToUser
                    ? "self-end border border-green-500 bg-green-300"
                    : "self-start border border-blue-500 bg-blue-300",
                  editingState ? "bg-gray-500" : "",
                ].join(" ")}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {isMsgBelongsToUser ? "Вы: " : ""}
                    {message.userName}
                  </span>
                  <TimeAgo date={message.createdAt} />
                </div>
                <p>{message.text}</p>
                {isMsgBelongsToUser && messages.length === i + 1 && (
                  <div className="flex justify-end">
                    <Button
                      disabled={editingState}
                      className={`${
                        editingState ? "hidden" : "text-orange-500"
                      }`}
                      onClick={() => {
                        setEditingState(true);
                        setEditingMessageId(message.id);
                        setText(message.text);
                      }}
                    >
                      <FiEdit2 size="20" color="green" />
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      disabled={editingState}
                      className={`${editingState ? "hidden" : "text-red-500"}`}
                      onClick={() => {
                        removeMessage(message.id);
                      }}
                    >
                      <FiTrash size="20" color="green" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
      </CardContent>
      <CardActions className="flex flex-row gap-2">
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
        />
        {editingState && (
          <button
            className="btn-error"
            type="button"
            onClick={() => {
              setEditingState(false);
              setText("");
            }}
          >
            <MdOutlineClose fontSize={18} />
          </button>
        )}
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={sendMessage}
        >
          <Send className="-rotate-45 scale-75" />
        </Button>
      </CardActions>
      <ToastContainer />
    </Card>
  );
};
