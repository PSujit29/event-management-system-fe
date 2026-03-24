import { LabeledInput, SelectInput } from "../form/input";
import { Button } from "../form/button";
import { useForm } from "react-hook-form";
import type { IRegisterCredentials } from "../../types/authType";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const registerDTO = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.email().nonempty("Email is required").nonoptional(),
      password: z.string().min(8, "Password must be min 8 characters long").nonempty("Password is required").nonoptional(),
      confirmPassword: z.string().min(1, "Confirm Password is required"),
      role: z.string().nonempty("Role is required").nonoptional(),
  }).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] }); 

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterCredentials>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "" },
    resolver: zodResolver(registerDTO),
  });

  // { commented previous code. no use case beside future referrence
  // const [credentials, setCredentials] = useState<ICredentials>({ name: "", email: "", password: "", confirmPassword: "", role:"" });

  // useEffect(() => {
  //   console.log(credentials);
  // }, [credentials]);

  // const control = (ev: BaseSyntheticEvent) => {
  //   const { name, value } = ev.target;
  //   setCredentials((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (ev:) => {
  //   ev.preventDefault();
  //   //TODO later add submit functionality. leave it as it is now
  // };
  // }

  // {errors && console.log(errors);}

  const submitForm = (data: IRegisterCredentials) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
        <LabeledInput type="text" label="Name" name="name" handler={control} errMsg={errors?.name?.message} />
        <LabeledInput type="email" label="Email" name="email" handler={control} errMsg={errors?.email?.message} />
        <LabeledInput type="password" label="Password" name="password" handler={control} errMsg={errors?.password?.message} />
        <LabeledInput
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          handler={control}
          errMsg={errors?.confirmPassword?.message}
        />

        <SelectInput
          label="role"
          name="role"
          handler={control}
          errMsg={errors?.role?.message}
          options={[
            { value: "user", label: "Customer" },
            { value: "seller", label: "Vendor" },
          ]}
        />

        <div className="flex w-full gap-3 mt-4">
          <Button type="reset" variant="danger" txt="Cancel" />
          <Button type="submit" txt="Register" />
        </div>
      </form>
    </>
  );
}
