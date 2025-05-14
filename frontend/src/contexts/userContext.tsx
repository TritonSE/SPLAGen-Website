"use client";

import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

import { User, getWhoAmI, logoutUser } from "@/api/users";
import { OnboardingStep } from "@/components/navbar/VerticalStepper";
import { initFirebase } from "@/firebase/firebase";

// User context interface
type IUserContext = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
  logout: () => Promise<void>;
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
};

/**
 * A context that provides the current Firebase and Splagen (MongoDB) user data,
 * automatically fetching them when the page loads.
 */
export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  user: null,
  loadingUser: true,
  reloadUser: () => undefined,
  logout: async () => {
    // Empty implementation for the default context
    await Promise.resolve();
  },
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
  const { auth } = initFirebase();

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
  /**
   * Handles user logout by calling Firebase signOut
   */
  const logout = useCallback(async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        setUser(null);
        // Redirect to login page after logout
        window.location.href = "/login";
      } else {
        console.error("Error during logout:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  // Update user data when Firebase authentication state changes
  useEffect(() => {
    if (!initialLoading) {
      reloadUser();
    }
  }, [initialLoading, firebaseUser, reloadUser]);
  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        user,
        loadingUser,
        reloadUser,
        logout,
        onboardingStep,
        setOnboardingStep: setOnboardingStepHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
