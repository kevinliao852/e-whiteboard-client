import { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { Header } from '../component/Header';
import { GoogleAuthContext } from '../contexts/GoogleAuthContext';
import { Dashboard } from './Dashboard';
import { Home } from './Home';

export const Routes = () => {
  const { isSignedIn } = useContext(GoogleAuthContext);

  return (
    <BrowserRouter>
      <Header />
      <Route path="/" exact component={Home}></Route>
      <Route path="/home" exact component={Home}></Route>
      <Route
        path="/Dashboard"
        exact
        component={isSignedIn ? Dashboard : Home}
      ></Route>
    </BrowserRouter>
  );
};
