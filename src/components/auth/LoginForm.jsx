import { LabeledInput } from "../form/input";
import { Button } from "../form/button";
import { RedirectLink } from "../ui/AuthLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import * as z from "zod";

const loginDTO = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginDefaultValue = { email: "", password: "" };
export default function LoginForm() {
  // prettier-ignore
  const { handleSubmit, control, formState: { errors } } = useForm({ 
    defaultValues: LoginDefaultValue, 
    resolver: zodResolver(loginDTO) 
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (data) => {
    try {
      // Transform for DummyJSON: email → username (strip domain)
      const username = data.email.replace("@gmail.com", "");
      const payload = {
        username,
        password: data.password,
        expiresInMins: 30, // Required by DummyJSON
      };
      console.log("Sending payload:", payload);
      const userDetail = await login(payload);
      toast.success("Login successful!");
      console.log(userDetail);
      navigate("/user");
    } catch (err) {
      console.log({ err });
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-5 w-full">
        <LabeledInput type="email" label="Email" name="email" handler={control} errMsg={errors?.email?.message} />
        <LabeledInput type="password" label="Password" name="password" handler={control} errMsg={errors?.password?.message} />
        <div>
          <div className="flex w-full justify-end">
            <RedirectLink to="/forget-password" variant="link" txt="Forget Password?" className="italic font-medium" />
          </div>

          <div className="flex w-full gap-3 mt-4">
            <Button type="reset" variant="danger" txt="Cancel" />
            <Button type="submit" txt="Login" />
          </div>
        </div>
      </form>
    </>
  );
}
