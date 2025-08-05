import { useState } from "react";
// import { useError } from "../../contexts/ErrorContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import useCatchAsync from "../../utills/catchAsync";

type inputTypes = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupLayout() {
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  // const [confirmPassword, setconfirmPassword] = useState<string>("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, getValues, formState } =
    useForm<inputTypes>();
  const { errors } = formState;
  // const { dispatch } = useError();

  const handleSignup = useCatchAsync(async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    // pravi zahtev backend-u
    setIsLoading(true);
    const fetchReq = await fetch("http://127.0.0.1:3000/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // email: getValues().email,
        password: getValues().password,
        confirmPassword: getValues().password,
      }),
    });
    const responseData = await fetchReq.json();
    if (!fetchReq.ok) {
      console.log("evo upao u not ok");
      throw new Error(responseData.error);
      // return dispatch({
      //   type: "setErrorOperational",
      //   payload: { errorMessage: { message: responseData.message } },
      // });
    }
    console.log(responseData);
    toast.success("Signup successful");
    navigate("/");
  });

  function onSuccess(data: inputTypes, e?: React.BaseSyntheticEvent) {
    console.log("Evo data za fields, ", data);
    console.log("evo ga event, ", e);
    if (e) {
      handleSignup(e);
    }
  }

  return (
    <div>
      <div className="max-w-[1200px] mx-auto">
        <Form
          onSubmit={handleSubmit(onSuccess)}
          className="flex items-center justify-center flex-col gap-5"
        >
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="border-1 rounded-xs"
              // onChange={(e) => setEmail(e.target.value)}
              // value={email}
              {...register("email", { required: "This field is required" })}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              className="border-1 rounded-xs"
              // onChange={(e) => setPassword(e.target.value)}
              // value={password}
              {...register("password", {
                required: "This field is required",
                validate: (value) => {
                  if (value.length < 2)
                    return "Password must have above 2 characters";
                },
              })}
            />
            {errors?.password?.message && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-3">
            <label htmlFor="confirmPassword">ConfirmPassword</label>
            <input
              id="confirmPassword"
              type="text"
              className="border-1 rounded-xs"
              // onChange={(e) => setconfirmPassword(e.target.value)}
              // value={confirmPassword}
              {...register("confirmPassword", {
                required: "This field is required",
                validate: (value) => {
                  if (value !== getValues().password) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            {errors?.confirmPassword?.message && (
              <p>{errors.confirmPassword.message}</p>
            )}
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <button
              type="submit"
              className="border-1 px-4 py-1 rounded-xs mt-2"
            >
              Signup
            </button>
          )}
        </Form>
      </div>
    </div>
  );
}
