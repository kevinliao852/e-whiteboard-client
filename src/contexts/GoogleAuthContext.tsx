import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { AuthStatus, changeAuthStatus } from "../features/auth/authSlice";
import { GOOGLE_CLIENT_ID, API_SERVER_HOST } from "../config/config";
import {
  clearUserInfo,
  setUserInfo,
  UserInfo,
} from "../features/user/userSlice";

type GoogleAuthContextType = {
  isSignedIn: boolean;
  signOut: () => void;
  signIn: () => void;
};

type GoogleCredentialResponse = {
  credential: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            use_fedcm?: boolean;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          prompt: () => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const GoogleAuthContext =
  React.createContext<GoogleAuthContextType | null>(null);

export const GoogleAuthContextStore = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("REACT_APP_GOOGLE_CLIENT_ID is not set");
      dispatch(changeAuthStatus(AuthStatus.Logout));
      return;
    }

    let isActive = true;
    dispatch(changeAuthStatus(AuthStatus.Logout));

    const initializeGoogleAuth = () => {
      if (!isActive) {
        return;
      }

      if (!window.google) {
        window.setTimeout(initializeGoogleAuth, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        use_fedcm: true,
        callback: async ({ credential }) => {
          try {
            const response = await axios.post(
              `${API_SERVER_HOST}/login`,
              `idtoken=${encodeURIComponent(credential)}`,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
              },
            );

            const data = response.data;
            const userInfo: UserInfo = {
              id: data.id,
              displayName: data["display-name"],
              email: data.email,
            };

            dispatch(setUserInfo(userInfo));
            dispatch(changeAuthStatus(AuthStatus.Login));
            setIsSignedIn(true);
          } catch (error) {
            console.error("Google login failed", error);
            dispatch(clearUserInfo());
            dispatch(changeAuthStatus(AuthStatus.Logout));
            setIsSignedIn(false);
          }
        },
      });
    };

    initializeGoogleAuth();

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  const signIn = () => {
    if (!window.google) {
      console.error("Google Identity Services is not loaded");
      return;
    }

    window.google.accounts.id.prompt();
  };

  const signOut = () => {
    window.google?.accounts.id.cancel();
    window.google?.accounts.id.disableAutoSelect();
    dispatch(clearUserInfo());
    dispatch(changeAuthStatus(AuthStatus.Logout));
    setIsSignedIn(false);
  };

  const value = useMemo(
    () => ({ isSignedIn, signOut, signIn }),
    [isSignedIn],
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
