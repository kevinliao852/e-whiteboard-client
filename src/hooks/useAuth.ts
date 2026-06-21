import { useAppSelecter } from "../app/hooks";
import { AuthStatus, selectAuthStatus } from "../features/auth/authSlice";

export function useAuthStatus() {
  const authStatus = useAppSelecter(selectAuthStatus);

  return authStatus;
}
