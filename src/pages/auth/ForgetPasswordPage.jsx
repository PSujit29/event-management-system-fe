import { Heading1 } from "../../components/typography/heading";
import ForgetPasswordForm from "../../components/auth/ForgetPasswordForm";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

export default function ForgetPasswordPage() {
  const outletContext = useOutletContext();
  useEffect(() => {
    outletContext.setSidePanel({ title: "Forgot Password ?", children: <p>Don't Worry. It happens. We will get back to you soon</p> });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Heading1 pageTitle="Reset Password" className="text-emerald-800 underline mb-5" />
      <ForgetPasswordForm />
    </>
  );
}
