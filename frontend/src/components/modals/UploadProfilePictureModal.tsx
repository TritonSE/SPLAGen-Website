import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "..";

import { Modal } from "./Modal";
import styles from "./UploadProfilePictureModal.module.css";

import { editProfilePicture } from "@/api/users";
import { SuccessMessage } from "@/components/SuccessMessage";
import { UserContext } from "@/contexts/userContext";

export const UploadProfilePictureModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentFileURL, setCurrentFileURL] = useState("");
  const { firebaseStorage, firebaseUser, user, reloadUser } = useContext(UserContext);
  // 10 MB max file size
  const { getRootProps, getInputProps, fileRejections, acceptedFiles } = useDropzone({
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.account.profilePicture) {
      setCurrentFileURL(user.account.profilePicture);
    }
  }, [user]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setCurrentFileURL(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      setError(
        fileRejections
          .map((rejection) => rejection.errors.map((err) => err.message).join(", "))
          .join(", "),
      );
    }
  }, [fileRejections]);

  const handleSave = async () => {
    if (!firebaseStorage || !firebaseUser) return;

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      let fileURL = currentFileURL;
      if (currentFileURL && currentFileURL !== user?.account.profilePicture) {
        const storageRef = ref(firebaseStorage, `files/${firebaseUser.uid}/profile_picture`);
        await uploadBytes(storageRef, acceptedFiles[0]);
        fileURL = await getDownloadURL(storageRef);
      }

      const res = await editProfilePicture(fileURL, token);
      if (res.success) {
        setSuccessMessage("Profile picture updated");
        await reloadUser();
        onClose();
      } else {
        setError(`Failed to update profile picture: ${res.error}`);
      }
    } catch (err) {
      setError(`Failed to update profile picture: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Upload profile picture"
        loading={loading}
        content={
          <>
            <p>A high-quality photo will make your profile more professional</p>
            <div className={styles.container}>
              <div className={styles.picture}>
                {currentFileURL ? (
                  <Image src={currentFileURL} alt="Profile picture" width={200} height={200} />
                ) : (
                  <p>No picture uploaded</p>
                )}
              </div>
              <div className={styles.buttonsRow}>
                <Button
                  disabled={!currentFileURL}
                  label="Remove photo"
                  onClick={() => {
                    setCurrentFileURL("");
                  }}
                />
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button variant="secondary" label="Upload photo" />
                </div>
              </div>

              {error && <div className="text-red-500">{error}</div>}
            </div>
          </>
        }
        onSave={handleSave}
      />
      <SuccessMessage
        message={successMessage}
        onDismiss={() => {
          setSuccessMessage("");
        }}
      />
    </>
  );
};
