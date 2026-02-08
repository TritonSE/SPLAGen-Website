import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "..";

import styles from "./styles.module.css";

import { User, formatUserFullName, getMultipleUsers } from "@/api/users";
import { ProfilePicture } from "@/components/ProfilePicture";
import { ConfirmInviteAdminPopup } from "@/components/modals/ManageFlowPopup";
import { Modal } from "@/components/modals/Modal";
import { UserContext } from "@/contexts/userContext";

type InviteAdminPopupProps = {
  isOpen: boolean;
  onClose: () => unknown;
  onInviteAdmin: () => unknown;
};

export const InviteAdminPopup = ({ isOpen, onClose, onInviteAdmin }: InviteAdminPopupProps) => {
  const { t } = useTranslation();
  const { firebaseUser } = useContext(UserContext);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>();
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = useCallback(async () => {
    if (!firebaseUser) return;

    setErrorMessage("");
    try {
      const token = await firebaseUser.getIdToken();
      const response = await getMultipleUsers(token, "", search, 1, false);
      if (response.success) {
        setUsers(response.data.users);
      } else {
        setErrorMessage(`${t("failed-to-fetch-users")}: ${response.error}`);
      }
    } catch (error) {
      setErrorMessage(`${t("failed-to-fetch-users")}: ${String(error)}`);
    }
  }, [firebaseUser, search, t]);

  useEffect(() => {
    void loadUsers();
  }, [firebaseUser, search, loadUsers]);

  return (
    <>
      <Modal
        hideButtonsRow
        isOpen={isOpen}
        onClose={onClose}
        title={t("invite-admin")}
        onSave={() => null}
        content={
          <div className={styles.root}>
            <div className={styles.searchContainer}>
              <Image src="/icons/search.svg" alt="Search icon" width={27} height={16} />
              <input
                placeholder={t("search-counselors")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className={styles.searchBar}
              />
            </div>
            <div className={styles.usersContainer}>
              {users?.map((user) => (
                <div key={user._id} className="flex flex-row items-center gap-5 pr-4">
                  <ProfilePicture user={user} />
                  <div className="mr-auto">
                    <strong>{formatUserFullName(user)}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#555" }}>{user.personal.email}</div>
                  </div>
                  <Button
                    className="py-1"
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                    label={t("invite")}
                  />
                </div>
              ))}
            </div>

            {users && users.length === 0 ? <p>{t("no-users-found")}</p> : null}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </div>
        }
      />
      <ConfirmInviteAdminPopup
        isOpen={selectedUser !== null}
        onCancel={() => {
          setSelectedUser(null);
        }}
        onInvite={() => {
          onInviteAdmin();
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
};
