import Link from "next/link";

const ForgotLogin = () => {
  return (
    <div>
      <h1> You are in forgot login page</h1>
      <Link href="/login"> Go back to login </Link>
    </div>
  );
};

export default ForgotLogin;
