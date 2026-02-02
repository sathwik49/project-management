import type {
  signInInputType,
  signUpInputType,
} from "../validations/auth.validation";
import type { getCurrentUserResponseType, signUpResponseType } from "./types";
import { api } from "./axios";

export const signUpMutation = async (
  data: signUpInputType,
): Promise<signUpResponseType> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const signInMutation = async (
  data: signInInputType,
): Promise<signUpResponseType> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getCurrentUser = async (): Promise<getCurrentUserResponseType> => {
  const res = await api.get("/user/get-user");
  return res.data;
};

export const logOutMutation = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
