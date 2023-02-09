import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch } from "../app/hooks";
import { AuthStatus, changeAuthStatus } from "../features/auth/auth-slice";
import { GOOGLE_CLIENT_ID, API_SERVER_HOST } from "../config/config";
import { setUserInfo, UserInfo } from "../features/user/user-slice";

const client_id = GOOGLE_CLIENT_ID;
const host = API_SERVER_HOST;

type GoogleAuthContextType = {
  isSignedIn: Boolean;
  signOut: () => void;
  signIn: () => void;
};

export const GoogleAuthContext =
  React.createContext<GoogleAuthContextType | null>(null);

export const GoogleAuthContextStore = (props: any) => {
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    gapi.load("auth2", () => {
      gapi.auth2.init({ client_id });
      gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => {
        console.log(signedIn);
        setIsSignedIn(signedIn);
        const idToken = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().id_token;

        axios
          .post(`${host}/login`, `idtoken=${idToken}`, {
            headers: { "Access-Control-Allow-Credentials": true },
            withCredentials: true,
          })
          .then((response) => {
            const data = response.data;

            const userInfo: UserInfo = {
              id: data.id,
              displayName: data["display-name"],
              email: data.email,
            };

            console.log(response);
            dispatch(changeAuthStatus(AuthStatus.Login));
            dispatch(setUserInfo(userInfo));
          })
          .catch(console.log);
      });
    });
  }, [dispatch]);

  const signIn = useCallback(() => {
    console.log(gapi.auth2.getAuthInstance().signIn());
  }, []);

  const signOut = useCallback(() => {
    gapi.auth2.getAuthInstance().signOut();
    dispatch(changeAuthStatus(AuthStatus.Logout));
    setIsSignedIn(false);
  }, [dispatch]);

  const value = { isSignedIn, signOut, signIn };

  return (
    <GoogleAuthContext.Provider value={value}>
      {props.children}
    </GoogleAuthContext.Provider>
  );
};
