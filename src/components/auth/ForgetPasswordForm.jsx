import { LabeledInput } from "../form/input";
import { Button } from "../form/button";
import { useForm } from "react-hook-form";
import { RedirectLink } from "../ui/AuthLink";

export default function ForgetPasswordForm() {
  const { control, handleSubmit } = useForm({ defaultValues: { email: "" } });

  const sendReset = (data) => {
    //TODO: Add API call later
    console.log(data); //console for test purpose only
  };
  return (
    <form onSubmit={handleSubmit(sendReset)} className="flex flex-col gap-4">
      <LabeledInput type="email" label="Email" name="email" placeholder="Enter your email" handler={control} />

      <div className="flex flex-col w-full gap-4 mt-2">
        <Button type="submit" txt="Send Reset Link" />
        <div className="text-center">
          <RedirectLink to="/login" txt="← Back to Login" variant="link" className="sm:text-sm text-gray-500" />
        </div>
      </div>
    </form>
  );
}
