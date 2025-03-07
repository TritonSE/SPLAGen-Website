import React, { ReactNode } from "react";

// Custom Button Component
const Button = ({
  children,
  variant,
  onClick,
}: {
  children: ReactNode;
  variant?: string;
  onClick: () => void;
}) => (
  <button
    className={`px-4 py-2 rounded ${
      variant === "destructive" ? "bg-red-500 text-white" : "border border-gray-300"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Custom Card Component
const Card = ({ children }: { children: ReactNode }) => (
  <div className="p-6 w-96 text-center bg-white shadow-lg rounded-lg">{children}</div>
);

// Base Popup Component
const BasePopup = ({
  icon,
  title,
  message,
  notePlaceholder,
  noteTo,
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  notePlaceholder?: string;
  noteTo?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
}) => {
  return (
    <Card>
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-sm mb-4">{message}</p>
      {noteTo && (
        <input
          type="text"
          placeholder={notePlaceholder}
          className="w-full border p-2 mb-4 rounded"
        />
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Card>
  );
};

// Specific Popups
export const DenyRequestPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string; email: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={"⚠️"} // Replacing with emoji instead of Lucide React
    title={`Are you sure you want to deny ${user.name}’s request?`}
    message="This action is irreversible. They will remain part of the counselor database but will not appear in the directory. To be added, they will need to submit a new request."
    notePlaceholder="Let them know why"
    noteTo={user.email}
    cancelText="Cancel"
    confirmText="Deny Request"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const ApproveRequestPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={"❓"} // Replacing with emoji
    title={`Approve ${user.name}’s request to be part of the directory?`}
    message="The counselor will be approved and added to the directory. Any future updates will require manual review."
    cancelText="Cancel"
    confirmText="Approve Request"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const InviteAdminPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={"ℹ️"} // Replacing with emoji
    title={`Invite ${user.name} to be an admin?`}
    message="They will have access to manage counselors, create announcements, and moderate discussions."
    cancelText="Cancel"
    confirmText="Send Invite"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

export const RemoveAdminPopup = ({
  user,
  onCancel,
  onConfirm,
}: {
  user: { name: string; email: string };
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <BasePopup
    icon={"⚠️"} // Replacing with emoji
    title={`Are you sure you want to remove ${user.name} as an admin?`}
    message="They will remain as a genetic counselor but will lose all admin privileges. To make them an admin again, you will need to resend an invitation."
    notePlaceholder="Let them know why"
    noteTo={user.email}
    cancelText="Cancel"
    confirmText="Remove Admin"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);
