import ApiBuilder from "@/apis/builder/ApiBuilder";
import type { LoginRequest, LoginResponse, SignupRequest } from "./auth.types";

const loginApi = ApiBuilder.create<LoginRequest, LoginResponse>(
  "/api/v1/auth/login",
).setMethod("POST");

const signupApi = ApiBuilder.create<SignupRequest, void>(
  "/api/v1/members",
).setMethod("POST");

export { loginApi, signupApi };
