"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import { User, getWhoAmI } from "../api/users";

type IUserContext = {
  user: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
};

export const UserContext = createContext<IUserContext>({
  // firebaseUser: null,
  user: null,
  loadingUser: true,
  reloadUser: () => {},
});

/**
 * A provider component that handles the logic for supplying the context
 * with its current user & loading state variables.
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const reloadUser = () => {
    setLoadingUser(true);
    getWhoAmI("temp_firebase_token") // Make the API call
      .then((res) => {
        if (res.success) {
          setUser(res.data); // Set user if API call is successful
        } else {
          setUser(null); // Set user to null if the API call fails
        }
        setLoadingUser(false); // Set loading state to false when done
      })
      .catch((error: unknown) => {
        console.error("Error fetching user:", error);
        setUser(null); // Set user to null in case of error
        setLoadingUser(false); // Stop loading in case of error
      });
  };

  useEffect(() => {
    reloadUser();
  });

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        reloadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
