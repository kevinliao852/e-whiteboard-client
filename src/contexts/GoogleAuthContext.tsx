import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { AuthStatus, changeAuthStatus } from "../features/auth/authSlice";
import {
  GOOGLE_CLIENT_ID,
  API_SERVER_HOST,
  isMockApiServerHost,
} from "../config/config";
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

type AuthResponse = {
  id: number;
  "display-name": string;
  email: string;
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
  const useMockAuth = isMockApiServerHost(API_SERVER_HOST);

  const applyAuthenticatedUser = React.useCallback(
    (data: AuthResponse) => {
      const userInfo: UserInfo = {
        id: data.id,
        displayName: data["display-name"],
        email: data.email,
      };

      dispatch(setUserInfo(userInfo));
      dispatch(changeAuthStatus(AuthStatus.Login));
      setIsSignedIn(true);
    },
    [dispatch],
  );

  const resetAuthentication = React.useCallback(() => {
    dispatch(clearUserInfo());
    dispatch(changeAuthStatus(AuthStatus.Logout));
    setIsSignedIn(false);
  }, [dispatch]);

  const signInWithMockServer = React.useCallback(async () => {
    const response = await axios.post<AuthResponse>(
      `${API_SERVER_HOST}/login`,
      new URLSearchParams({
        idtoken: "mock-google-id-token",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      },
    );

    applyAuthenticatedUser(response.data);
  }, [applyAuthenticatedUser]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      if (useMockAuth) {
        console.warn(
          "REACT_APP_GOOGLE_CLIENT_ID is not set, using mock auth because API_SERVER_HOST points to the mock server",
        );
      } else {
        console.warn(
          "REACT_APP_GOOGLE_CLIENT_ID is not set and API_SERVER_HOST is not the mock server",
        );
      }
      resetAuthentication();
      return;
    }

    let isActive = true;
    resetAuthentication();

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
            applyAuthenticatedUser(response.data);
          } catch (error) {
            console.error("Google login failed", error);
            if (useMockAuth) {
              try {
                await signInWithMockServer();
              } catch (mockError) {
                console.error("Mock login fallback failed", mockError);
                resetAuthentication();
              }
            } else {
              resetAuthentication();
            }
          }
        },
      });
    };

    initializeGoogleAuth();

    return () => {
      isActive = false;
    };
  }, [
    applyAuthenticatedUser,
    resetAuthentication,
    signInWithMockServer,
    useMockAuth,
  ]);

  const signIn = async () => {
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt();
      return;
    }

    if (!useMockAuth) {
      console.error(
        "Mock auth is unavailable because API_SERVER_HOST does not point to the mock server. Configure Google login or switch API_SERVER_HOST to the mock server.",
      );
      resetAuthentication();
      return;
    }

    try {
      await signInWithMockServer();
    } catch (error) {
      console.error("Mock login failed", error);
      resetAuthentication();
    }
  };

  const signOut = () => {
    window.google?.accounts.id.cancel();
    window.google?.accounts.id.disableAutoSelect();
    resetAuthentication();
  };

  const value = useMemo(
    () => ({ isSignedIn, signOut, signIn }),
    [isSignedIn, signIn, signOut],
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
