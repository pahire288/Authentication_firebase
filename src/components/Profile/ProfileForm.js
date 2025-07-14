import { useRef, useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // ✅ Endpoint for change password in Firebase
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyC44GiGCfzmvLH1iqYKqsyHuOjHYrEG_b0';

    setIsLoading(true);

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token, // ✅ Current user idToken from context
        password: enteredNewPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Password change failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log('Password changed successfully:', data);
        alert('Password changed successfully!');
        // ✅ Optionally logout user after password change for security
        authCtx.logout();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="6" required ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <p>Changing password...</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
