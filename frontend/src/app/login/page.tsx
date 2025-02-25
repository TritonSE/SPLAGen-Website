"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Checkmark from "../components/CheckMark";

import styles from "./login.module.css";

// Define the schema for form validation using Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

// Infer the TypeScript type from the Zod schema
type FormFields = z.infer<typeof schema>;

// Initialize react-hook-form
const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    resolver: zodResolver(schema), // Use Zod for form validation
    mode: "onChange",
  });

  // Effect to check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      // Simulate API call with a 1-second delay...
      // Note how only email is saved...not the password.
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log(data);
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "We couldn't find an account with that email and password.",
      });
    }
  };

  // Handler for remember me checkbox changes
  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    setValue("rememberMe", checked);
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageDiv}>
        <div className={styles.decorationText}>
          <h1>
            <strong> Log in </strong>
          </h1>
          <h3 className={styles.welcomeback}> Welcome back!</h3>
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputFieldContainer}>
            <label htmlFor="email">Email</label>
            <input {...register("email")} id="email" type="text" placeholder="Email" />
            {errors.email && <div className="text-red-500">{errors.email.message}</div>}
          </div>

          <div className={styles.inputFieldContainer}>
            <label htmlFor="password">Password</label>
            <input {...register("password")} id="password" type="password" placeholder="Password" />
            {errors.password && <div className="text-red-500">{errors.password.message}</div>}
          </div>

          <Checkmark checked={rememberMe} onChange={handleRememberMeChange} label="Remember me" />

          {/* Submit button is dynamically enabled/disabled based on form state */}
          <button
            className={`longButton ${!isValid ? "disabledButton" : ""}`}
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Loading..." : "Log in"}
          </button>

          {errors.root && <div className="text-red-500">{errors.root.message}</div>}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link href="/login/forgot_login"> I forgot my username or password </Link>
            <span>
              {" "}
              Don&apos;t have an account?{" "}
              <Link href="/login/forgot_login"> Create a new account. </Link>{" "}
            </span>
            <Link href="/login/forgot_login"> I&apos;m an admin. </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
