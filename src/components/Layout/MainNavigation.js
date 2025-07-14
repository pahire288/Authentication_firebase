import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const logoutHandler = () => {
    authCtx.logout(); // clear token & context
    history.replace('/auth'); // redirect to login
  };

  const loginHandler = () => {
    history.push('/auth');
  };

  return (
    <header className={classes.header}>
      <nav>
        <ul>
          {!authCtx.isLoggedIn && (
            <li>
              <button onClick={loginHandler}>Login</button>
            </li>
          )}
          {authCtx.isLoggedIn && (
            <>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
