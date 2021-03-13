import { useEffect, useState } from 'react';
import axios from 'axios';


export interface googleAuthProps {
    onAuthChange: (isSignedIn: boolean) => void
}

export const GoogleAuth = ({ onAuthChange }: googleAuthProps): JSX.Element => {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        onAuthChange(isSignedIn);
    }, [isSignedIn, onAuthChange]);

    useEffect(() => {
        gapi.load('auth2', () => {
            const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
            gapi.auth2.init({ client_id });
            gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
                setIsSignedIn(signedIn)
                const host = process.env.REACT_APP_APISERVER_HOST as string;
                const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
                axios.post(`${host}/login`, `idtoken=${idToken}`, {
                    headers: { 'Access-Control-Allow-Credentials': true },
                    withCredentials: true
                });
            })

            //console.log(gapi.auth2.getAuthInstance());
        })
    }, []);

    const onButtonClick = () => {
        const authInstance = gapi.auth2.getAuthInstance();
        if (!isSignedIn) {
            //props.signIn();
            authInstance.signIn();

        } else {
            //props.signOut();
            authInstance.signOut();
        }

    };

    return (
        <button className="ui button" onClick={onButtonClick}>
            <i className="google icon red" ></i>
            { `Sign ${isSignedIn ? 'out' : 'in'}`}
        </button>
    );
};

