import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";

type Form = {
  email: string;
  password: string;
};

export default function LoginLayout() {
  const { formState, register, handleSubmit, getValues } = useForm<Form>();
  const { errors } = formState;
  // const { dispatch: } = useError();
  const { setUser } = useUser();

  const handleLogin = async () => {
    const sendLoginData = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: getValues().email,
        password: getValues().password,
      }),
    });
    console.log(sendLoginData.status);
    if (sendLoginData.status === 200) {
      // mora da se gadje /me endpoint
      console.log("UPAO");
      const fetchUserData = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });

      const userData = await fetchUserData.json();
      setUser(userData.data);
      toast.success("Login successful!");
    }
  };

  function handleSuccess(data: Form, e?: React.BaseSyntheticEvent) {
    console.log(data);
    if (e) {
      handleLogin();
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
