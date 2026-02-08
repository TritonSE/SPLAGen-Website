import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { User } from "@/api/users";
import { UserContext } from "@/contexts/userContext";

export const LOGIN_URL = "/login";
export const HOME_URL = "/";

/**
 * An interface for the user's current authentication credentials
 */
export type AuthCredentials = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
};

/**
 * A type for a function that determines whether the user should be redirected
 * based on their current credentials
 */
export type CheckShouldRedirect = (authCredentials: AuthCredentials) => boolean;

export type UseRedirectionProps = {
  checkShouldRedirect: CheckShouldRedirect;
  redirectURL: string;
};

/**
 * A base hook that redirects the user to redirectURL if checkShouldRedirect returns true
 */
export const useRedirection = ({ checkShouldRedirect, redirectURL }: UseRedirectionProps) => {
  const { firebaseUser, user, loadingUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if we are still loading the current user
    if (loadingUser) {
      return;
    }

    if (checkShouldRedirect({ firebaseUser, user })) {
      router.push(redirectURL);
    }
  }, [firebaseUser, user, loadingUser, checkShouldRedirect, redirectURL, router]);
};

/**
 * A hook that redirects the user to the staff/admin home page if they are already signed in
 */
export const useRedirectToHomeIfSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, user }) => firebaseUser !== null && user !== null,
    redirectURL: HOME_URL,
  });
};

/**
 * A hook that redirects the user to the login page if they are not signed in
 */
export const useRedirectToLoginIfNotSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, user }) => firebaseUser === null || user === null,
    redirectURL: LOGIN_URL,
  });
};

/**
 * A hook that redirects the user to the staff home page if they are signed in, but not a superadmin
 */
export const useRedirectToHomeIfNotSuperAdmin = () => {
  useRedirection({
    checkShouldRedirect: ({ user }) => user !== null && user.role !== "superadmin",
    redirectURL: HOME_URL,
  });
};

/**
 * A hook that redirects the user to the staff home page if they are signed in, but not an admin/superadmin
 */
export const useRedirectToHomeIfNotAdminOrSuperAdmin = () => {
  useRedirection({
    checkShouldRedirect: ({ user }) =>
      user !== null && !["admin", "superadmin"].includes(user.role),
    redirectURL: HOME_URL,
  });
};
