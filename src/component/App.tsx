import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home';
import { Dashboard } from './Dashboard';
import { useCallback, useState } from 'react';

export const App = (): JSX.Element => {
  const [auth, setAuth] = useState<boolean>(false);
  const onAuthChange = useCallback((isSignedIn: boolean) => {
    setAuth(isSignedIn);
  }, []);
  return (
    <div>
      <Router>
        <Header onAuthChange={onAuthChange} />
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/Dashboard" component={Dashboard}>
          {auth ? null : <Redirect to="/home" />}
        </Route>
      </Router>
    </div>
  );
};
