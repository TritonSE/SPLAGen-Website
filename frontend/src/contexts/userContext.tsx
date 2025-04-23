"use client";

// import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

import { User, getWhoAmI } from "@/api/users";
import { OnboardingStep } from "@/components/navbar/VerticalStepper";
// import { initFirebase } from "@/firebase/firebase";

//TODO: uncommet firebase code when ready
type IUserContext = {
  //   firebaseUser: FirebaseUser | null;
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
  //   firebaseUser: null,
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
  //   const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  //   const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(0);

  const setOnboardingStepHandler = useCallback(
    (step: OnboardingStep) => {
      setOnboardingStep(step);
    },
    [setOnboardingStep],
  );

  //   const { auth } = initFirebase();

  /**
   * Callback triggered by Firebase when the user logs in/out, or on page load
   */
  //   onAuthStateChanged(auth, (firebaseUser) => {
  //     setFirebaseUser(firebaseUser);
  //     setInitialLoading(false);
  //   });

  const reloadUser = useCallback(() => {
    // if (initialLoading) {
    //   return;
    // }
    setLoadingUser(true);
    setUser(null);

    // TODO: Delete this after firebase is set up and uncomment the chunk below
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

    // if (firebaseUser === null) {
    //   setLoadingUser(false);
    // } else {
    //   firebaseUser.getIdToken().then((token) =>
    //     getWhoAmI("temp_firebase_token") // Make the API call
    //       .then((res) => {
    //         if (res.success) {
    //           setUser(res.data); // Set user if API call is successful
    //         } else {
    //           setUser(null); // Set user to null if the API call fails
    //         }
    //         setLoadingUser(false); // Set loading state to false when done
    //       })
    //       .catch((error: unknown) => {
    //         console.error("Error fetching user:", error);
    //         setUser(null); // Set user to null in case of error
    //         setLoadingUser(false); // Stop loading in case of error
    //       }),
    //   );
    // }
  }, [setUser, setLoadingUser]);

  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  //TODO: switch to this useeffect when firebase is set up
  // useEffect(reloadUser, [initialLoading, firebaseUser]);

  return (
    <UserContext.Provider
      value={{
        // firebaseUser,
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
