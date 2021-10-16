import { GoogleAuthContextStore } from '../contexts/GoogleAuthContext';
import { Routes } from './Routes';

export const App = (): JSX.Element => {
  return (
    <div>
      <GoogleAuthContextStore>
        <Routes />
      </GoogleAuthContextStore>
    </div>
  );
};
