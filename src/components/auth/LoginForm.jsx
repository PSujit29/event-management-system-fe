import { LabeledInput } from "../form/input";
import { Button } from "../form/button";
import { RedirectLink } from "../ui/AuthLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import * as z from "zod";


const loginDTO = z.object({
  // email: z.email().nonempty("Email is required").nonoptional(),
  username: z.string().nonempty("Username is required").nonoptional(),
  password: z.string().min(8).nonempty("Password is required").nonoptional(),
});

const LoginDefaultValue = { username: "", password: "" };
export default function LoginForm() {

  // prettier-ignore
  const { handleSubmit, control, formState: { errors } } = useForm({ 
    defaultValues: LoginDefaultValue, 
    resolver: zodResolver(loginDTO) 
  });

  const navigate = useNavigate();
  const {login} = useAuth()

  const handleLoginSubmit = async (data) => {
    try {
      const userDetail = await login(data);
      console.log(userDetail)
      navigate("/user");
    } catch (err) {
      console.log({ err });
      //TODO: later add some ui popup or something
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-5 w-full">
        <LabeledInput type="text" label="Username" name="username" handler={control} errMsg={errors?.username?.message} />
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
