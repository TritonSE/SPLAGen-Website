"use client";

import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";

// Have to wait until these are set up
import { User, getWhoAmI } from "@/api/Users";
import { initFirebase } from "@/firebase/firebase";

interface IUserContext {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
}

export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  user: null,
  loadingUser: true,
  reloadUser: () => {},
});

/**
 * A provider component that handles the logic for supplying the context
 * with its current user & loading state variables.
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { auth } = initFirebase();

  /**
   * Callback triggered by Firebase when the user logs in/out, or on page load
   */
  onAuthStateChanged(auth, (fbUser) => {
    setFirebaseUser(fbUser);
    setInitialLoading(false);
  });

  const reloadUser = () => {
    if (initialLoading) {
      return;
    }
    setLoadingUser(true);
    setUser(null);
    if (firebaseUser === null) {
      setLoadingUser(false);
    } else {
      firebaseUser.getIdToken().then((token) =>
        getWhoAmI(token).then((res) => {
          if (res.success) {
            setUser(res.data);
          } else {
            setUser(null);
          }
          setLoadingUser(false);
        }),
      );
    }
  };

  useEffect(reloadUser, [initialLoading, firebaseUser]);

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        user,
        loadingUser,
        reloadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
