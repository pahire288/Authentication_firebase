import { useContext } from 'react';
import AuthContext from '../store/auth-context';

const Profile = () => {
  const authCtx = useContext(AuthContext);

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <section>
      <h1>Welcome to your Profile</h1>
      <button onClick={logoutHandler}>Logout</button>
    </section>
  );
};

export default Profile;
