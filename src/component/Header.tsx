import { Menu } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { GoogleAuthContext } from '../contexts/GoogleAuthContext';

export const Header = () => {
  const { isSignedIn, signIn, signOut } = useContext(GoogleAuthContext);
  console.log(isSignedIn);
  return (
    <Menu>
      <Menu.Item active={useParams() === 'home'}>
        <Link to="/home">Home</Link>
      </Menu.Item>
      <Menu.Item active={useParams() === 'dashboard'}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item position="right">
        <button
          className="ui button"
          onClick={() => (isSignedIn ? signOut() : signIn())}
        >
          <i className="google icon red"></i>
          {`Sign ${isSignedIn ? 'out' : 'in'}`}
        </button>
      </Menu.Item>
    </Menu>
  );
};
