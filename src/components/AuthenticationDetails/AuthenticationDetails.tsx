import { onAuthStateChanged, signOut } from "firebase/auth";
import { useContext, useEffect, } from "react";
import { auth } from "../../utils/Firebase";
import { AuthContext } from '../../context/AuthContext';

export const AuthenticationDetails = () => {

  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error('UserContext is undefined, please verify the context provider');
  }

  const { currentUser, setCurrentUser } = userContext;

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      listen();
    };
  });

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {currentUser ? (
        <>
          <p>{`Signed In as ${currentUser.email}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};
