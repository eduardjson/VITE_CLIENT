import { Prisma } from "@prisma/client";

export type UserInfo = {
  userId: string;
  userName: string;
};

export type MessageUpdatePayload = Prisma.MessageWhereUniqueInput &
  Pick<Prisma.MessageUpdateInput, "text">;

export interface Attachment {
  id: string;
  messageId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  uploadedAt: string;
}

export interface Message {
  id: number;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface MessageCreatePayload {
  userId: string;
  userName: string;
  text: string;
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    filePath: string;
  }[];
}

// export interface MessageUpdatePayload {
//   id: number;
//   text: string;
// }
