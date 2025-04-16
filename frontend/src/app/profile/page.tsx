"use client";

import { useContext, useState } from "react";

import { User } from "@/api/users";
import { EditBasicInfoModal, PillButton } from "@/components";
import { UserContext } from "@/contexts/userContext";

// changes
// edited user contller to give account info
// tweaked user frontend api to include account info

// behavior:
// directory button dissapears if logged in user is a student.

// TODO
// - deal with possibility of null/not being logged in
// allow editing.s

type DisplayComponentProps = {
  user: User;
  openModal: () => void; // setIsModalOpen
};

// Sub component to render depending on what the user desires
const General = ({ user, openModal }: DisplayComponentProps) => {
  return (
    <div>
      <br />

      <b> Personal Information </b>
      <span> {user.personal.firstName} </span>
      <br />

      <button onClick={openModal}> Edit 🖋️ </button>
      <br />
      <br />
      <b> Personal Information </b>
    </div>
  );
};

// Sub component to render depending on what the user desires
// only accessible if user's account type is not a student

const Directory = ({ user }: DisplayComponentProps) => {
  return (
    <div>
      <b> Directory Information </b>
      <span> {user.personal.lastName} </span>

      {/* <PillButton label="Edit 🖋️" onClick={}/> */}
    </div>
  );
};

const Profile: React.FC = () => {
  // info modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // general and directory
  const [state, setState] = useState<"general" | "directory">("general");
  let DisplayComponent = state === "general" ? General : Directory;

  switch (state) {
    case "general":
      DisplayComponent = General;
      break;

    case "directory":
      DisplayComponent = Directory;
      break;
  }

  const { user } = useContext(UserContext);
  const membershipStatus = user?.account.membership; // "student" | "geneticCounselor" |  "healthcareProvider" | "associate";

  return (
    <div>
      <PillButton
        label="General"
        isActive={state === "general" ? true : false}
        onClick={() => {
          setState("general");
        }}
      />
      <PillButton
        label="Directory"
        isActive={state === "directory" ? true : false}
        onClick={() => {
          setState("directory");
        }}
        className={membershipStatus === "student" ? "hidden" : ""}
      />
      <p> {state} </p>

      {user && <DisplayComponent user={user} openModal={handleOpenModal} />}

      <EditBasicInfoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Profile;
