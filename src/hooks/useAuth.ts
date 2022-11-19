import { useAppSelecter } from "../app/hooks";
import { AuthStatus, selectAuthStatus } from "../features/auth/auth-slice";

export function useAuthStatus() {
  const authStatus = useAppSelecter(selectAuthStatus);

  return authStatus;
}
