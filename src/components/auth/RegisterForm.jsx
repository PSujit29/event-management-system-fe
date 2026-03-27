import { LabeledInput, SelectInput } from "../form/input";
import { Button } from "../form/button";
import { useForm, useWatch } from "react-hook-form"; // Added useWatch
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

// Base schema for shared fields
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

// Discriminated union to handle role-specific fields
const registerDTO = z
  .discriminatedUnion("role", [
    baseSchema.extend({ role: z.literal("Student"), rollNumber: z.string().min(1, "Roll Number is required") }),
    baseSchema.extend({ role: z.literal("Teacher"), designation: z.string().min(1, "Designation is required") }),
    baseSchema.extend({ role: z.literal("Admin"), designation: z.string().min(1, "Designation is required") }),
  ])
  .refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export default function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "Student", rollNumber: "", designation: "" },
    resolver: zodResolver(registerDTO),
  });

  const selectedRole = useWatch({ control, name: "role" });

  const submitForm = async (data) => {
    const { confirmPassword: _confirmPassword, ...payload } = data;

    try {
      await registerUser(payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log({ err });
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
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
        label="Role"
        name="role"
        handler={control}
        errMsg={errors?.role?.message}
        options={[
          { value: "Student", label: "Student" },
          { value: "Teacher", label: "Teacher" },
          { value: "Admin", label: "Admin" },
        ]}
      />

      {/* Conditional Logic based on Role */}
      {selectedRole === "Student" ? (
        <LabeledInput type="text" label="Roll Number" name="rollNumber" handler={control} errMsg={errors?.rollNumber?.message} />
      ) : (
        <LabeledInput type="text" label="Designation" name="designation" handler={control} errMsg={errors?.designation?.message} />
      )}

      <div className="flex w-full gap-3 mt-4">
        <Button type="reset" variant="danger" txt="Cancel" />
        <Button type="submit" txt="Register" />
      </div>
    </form>
  );
}
