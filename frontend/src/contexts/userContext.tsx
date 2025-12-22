"use client";

import { Auth, User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { FirebaseStorage } from "firebase/storage";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

import { User, getWhoAmI } from "@/api/users";
import { OnboardingStep } from "@/components/navbar/VerticalStepper";
import { initFirebase } from "@/firebase/firebase";

// User context interface
type IUserContext = {
  firebaseAuth: Auth | null;
  firebaseStorage: FirebaseStorage | null;
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
};

/**
 * A context that provides the current Firebase and Splagen (MongoDB) user data,
 * automatically fetching them when the page loads.
 */
export const UserContext = createContext<IUserContext>({
  firebaseAuth: null,
  firebaseStorage: null,
  firebaseUser: null,
  user: null,
  loadingUser: true,
  reloadUser: () => undefined,
  onboardingStep: 0,
  setOnboardingStep: () => undefined,
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
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(0);
  const setOnboardingStepHandler = useCallback(
    (step: OnboardingStep) => {
      setOnboardingStep(step);
    },
    [setOnboardingStep],
  );

  // Initialize Firebase
  const { auth, storage } = initFirebase();

  /**
   * Callback triggered by Firebase when the user logs in/out, or on page load
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);
      setInitialLoading(false);
    }); // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [auth]);
  const reloadUser = useCallback(() => {
    if (initialLoading) {
      return;
    }

    setLoadingUser(true);
    setUser(null);

    if (firebaseUser === null) {
      // No firebase user, so we're not logged in
      setLoadingUser(false);
    } else {
      // We have a firebase user, get their token and authenticate with the backend
      firebaseUser
        .getIdToken(true) // Force token refresh
        .then((token) =>
          getWhoAmI(token)
            .then((res) => {
              if (res.success) {
                setUser(res.data); // Set user if API call is successful
              } else {
                setUser(null); // Set user to null if the API call fails
              }
              setLoadingUser(false);
            })
            .catch((error: unknown) => {
              console.error("Error fetching user:", error);
              setUser(null);
              setLoadingUser(false);
            }),
        )
        .catch((error: unknown) => {
          console.error("Error getting Firebase token:", error);
          setUser(null);
          setLoadingUser(false);
        });
    }
  }, [firebaseUser, initialLoading, setUser, setLoadingUser]);

  // Update user data when Firebase authentication state changes
  useEffect(() => {
    reloadUser();
  }, [initialLoading, firebaseUser, reloadUser]);
  return (
    <UserContext.Provider
      value={{
        firebaseStorage: storage,
        firebaseAuth: auth,
        firebaseUser,
        user,
        loadingUser,
        reloadUser,
        onboardingStep,
        setOnboardingStep: setOnboardingStepHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
