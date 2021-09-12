import { Menu } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import { GoogleAuth, googleAuthProps } from './GoogleAuth';
export const Header = (props: googleAuthProps) => {
  return (
    <Menu>
      <Menu.Item active={useParams() === 'home'}>
        <Link to="/home">Home</Link>
      </Menu.Item>
      <Menu.Item active={useParams() === 'dashboard'}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item position="right">
        <GoogleAuth onAuthChange={props.onAuthChange} />
      </Menu.Item>
    </Menu>
  );
};
