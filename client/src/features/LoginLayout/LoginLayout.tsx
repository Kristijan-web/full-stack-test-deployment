import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import useCatchAsync from "../../utills/catchAsync";
import { useError } from "../../contexts/ErrorContext";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";

type Form = {
  email: string;
  password: string;
};

export default function LoginLayout() {
  const { formState, register, handleSubmit, getValues } = useForm<Form>();
  const { errors } = formState;
  const { dispatch } = useError();

  const handleLogin = useCatchAsync(async () => {
    const sendLoginData = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: getValues().email,
        password: getValues().password,
      }),
    });
    if (sendLoginData.status === 204) {
      console.log("Login successful");
      toast.success("Login successful!");
    } else {
      const response = await sendLoginData.json();
      // da li ce catchAsync uhvatiti gresku koja nije operational
      if (!sendLoginData.ok && response.error.isOperational) {
        dispatch({
          type: "setErrorOperational",
          payload: {
            errorMessage: response.data.message,
          },
        });
      }
    }
  });

  function handleSuccess(data: Form, e?: React.BaseSyntheticEvent) {
    console.log(data);
    if (e) {
      handleLogin(e);
    } else {
      dispatch({
        type: "setErrorProgrammatic",
        payload: {
          errorMessage: new Error(
            "Something went wrong, please contact developer"
          ),
        },
      });
    }
  }

  return (
    <div>
      <div className="px-5 max-w-250 mx-auto">
        <Form
          onSubmit={handleSubmit(handleSuccess)}
          className="flex items-center justify-center flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="border-1 rounded-xs"
              {...register("email", { required: "This field is required" })}
            />
            {errors?.email?.message && <p>{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              className="border-1 rounded-xs"
              {...register("password", { required: "This field is required" })}
            />
          </div>
          <button type="submit" className="px-4 py-1 border-1 rounded-xs">
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
