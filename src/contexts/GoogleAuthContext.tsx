import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';

export const GoogleAuthContext = React.createContext({} as any);

export const GoogleAuthContextStore = (props: any) => {
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);
  const [, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    gapi.load('auth2', () => {
      const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
      gapi.auth2.init({ client_id });
      console.log(gapi.auth2);
      console.log('gapi init');
      setLoading(true);
    });
  }, []);

  useEffect(() => {
    if (!gapi.auth2?.getAuthInstance()) {
      return;
    }
    gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => {
      console.log(signedIn);
      setIsSignedIn((prev) => signedIn);
      const host = process.env.REACT_APP_API_SERVER_HOST as string;
      const idToken = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().id_token;

      axios
        .post(`${host}/login`, `idtoken=${idToken}`, {
          headers: { 'Access-Control-Allow-Credentials': true },
          withCredentials: true,
        })
        .then(console.log)
        .catch(console.log);
    });
  }, [gapi.auth2?.getAuthInstance]);

  useEffect(() => {
    if (!gapi.auth2?.getAuthInstance()) {
      return;
    }
    if (gapi.auth2.getAuthInstance().currentUser.get().isSignedIn()) {
      setIsSignedIn(true);
    }
  });

  const signIn = () => {
    console.log(gapi.auth2.getAuthInstance().signIn());
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setIsSignedIn((prev) => false);
  };

  const valueProvider = { isSignedIn, signOut, signIn };

  return (
    <GoogleAuthContext.Provider value={valueProvider}>
      {props.children}
    </GoogleAuthContext.Provider>
  );
};
