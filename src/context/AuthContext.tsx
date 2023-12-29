/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SignOutUser, userStateListener } from "../utils/Firebase";
import { createContext, useState, useEffect, ReactNode } from "react";

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  currentUser: {} as User | null,
  setCurrentUser: (_user: User | null) => { },
  signOut: () => { },
  isUpdated: false,
  setIsUpdated: ( _q: boolean ) => { },
  nickname: '',
  setNickname: (_q: string) => { },
  avatarURL: '',
  setAvatarURL: (_q: string) => { },
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = useState(false);
  const [nickname, setNickname] = useState('');
   const [avatarURL, setAvatarURL] = useState('');

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user);
        setNickname(user.displayName || 'Anonymous');
        setAvatarURL(user.photoURL || '');
      }
    });
    return unsubscribe
  }, [setCurrentUser]);

  const signOut = () => {
    SignOutUser()
    setCurrentUser(null)
    setNickname('');
    setAvatarURL('');
    navigate('/')
  }

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
    isUpdated,
    setIsUpdated,
    nickname,
    setNickname,
    avatarURL,
    setAvatarURL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}