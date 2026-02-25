export interface UserDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: ["ADMIN"];
  avatar: string;
}

export interface RegisterFormData extends UserDTO {
  repeatPassword: string;
}

export interface LoginFormData extends Pick<UserDTO, "email" | "password"> {}
