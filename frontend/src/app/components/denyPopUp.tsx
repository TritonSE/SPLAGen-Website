/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  note: z.string().min(5, "Message must be at least 5 characters."),
});

type FormData = z.infer<typeof schema>;

type DenyRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  name: string;
  email: string;
};

const DenyRequestModal: React.FC<DenyRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  email,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>⚠ Are you sure you want to deny {name}&apos;s request?</h2>
        <p className="modal-text">
          This action is irreversible. They will remain in the counselor database but will not
          appear in the directory. To be added again, they must submit a new request.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Send a note to: <strong>{email}</strong>
          </label>
          <input {...register("note")} type="text" placeholder={`Let ${name} know why`} />
          {errors.note && <p className="error-text">{errors.note.message}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="deny-button">
              Deny Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DenyRequestModal;
