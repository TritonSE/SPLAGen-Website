"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Checkmark } from "../../components";

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
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Effect to check for remembered email on component mount aka refresh
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedRememberMe = localStorage.getItem("rememberMe") === "true"; // remembers whether checkmark was on.
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
    }
    if (rememberedRememberMe) {
      setRememberMe(true);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormFields> = useCallback(async (data) => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      // Simulate API call with a 1-second delay...
      // Note how only email is saved...not the password.
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.setItem("rememberMe", "false");
      }

      console.log(data);
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "We couldn't find an account with that email and password.",
      });
    }
  }, []);

  // Handler for 'remember me' checkbox changes
  const handleRememberMeChange = useCallback(
    (checked: boolean) => {
      setRememberMe(checked);
      setValue("rememberMe", checked);
    },
    [setValue],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit]
  );

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageDiv}>
        <div className={styles.decorationText}>
          <h1>
            <strong> Log in </strong>
          </h1>
          <h3 className={styles.welcomeback}> Welcome back!</h3>
        </div>

        <form onSubmit={handleFormSubmit} autoComplete="on">
          <div className={styles.inputFieldContainer}>
            <label htmlFor="email">Email</label>
            <input {...register("email")} id="email" type="text" placeholder="Email" />
            {/* {errors.email && <div className="text-red-500">{errors.email.message}</div>} */}
          </div>

          <div className={styles.inputFieldContainer}>
            <label htmlFor="password">Password</label>
            <input {...register("password")} id="password" type="password" placeholder="Password" />
          </div>
          <div className={styles.formError}>
            {" "}
            {errors.email || errors.password ? "Login credentials invalid" : ""}{" "}
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
            <Link href="/forgotLogin"> I forgot my username or password </Link>
            <span>
              <span style={{ color: "black" }}> Don&apos;t have an account? </span>
              <Link href="/forgotLogin"> Create a new account </Link>
            </span>
            <Link href="/forgotLogin"> I&apos;m an admin </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
