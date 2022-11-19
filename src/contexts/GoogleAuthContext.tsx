import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID!;
const host = process.env.REACT_APP_API_SERVER_HOST!;

type GoogleAuthContextType = {
  isSignedIn: Boolean;
  signOut: () => void;
  signIn: () => void;
};

export const GoogleAuthContext =
  React.createContext<GoogleAuthContextType | null>(null);

export const GoogleAuthContextStore = (props: any) => {
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);

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
          .then(console.log)
          .catch(console.log);
      });
    });
  }, []);

  const signIn = useCallback(() => {
    console.log(gapi.auth2.getAuthInstance().signIn());
  }, []);

  const signOut = useCallback(() => {
    gapi.auth2.getAuthInstance().signOut();
    setIsSignedIn(false);
  }, []);

  const value = { isSignedIn, signOut, signIn };

  return (
    <GoogleAuthContext.Provider value={value}>
      {props.children}
    </GoogleAuthContext.Provider>
  );
};
