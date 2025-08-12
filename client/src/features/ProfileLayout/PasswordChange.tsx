import { useForm } from "react-hook-form";
import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";

type FormType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function PasswordChange() {
  const { register, handleSubmit, reset, getValues } = useForm<FormType>(); // zasto ovo sa formType radim, da bih omogucio type-safety

  const changePassword = useCatchAsync(async () => {
    const fetchData = await fetch(`${API_URL}/api/v1/users/change-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: getValues().oldPassword,
        newPassword: getValues().newPassword,
        confirmNewPassword: getValues().confirmNewPassword,
      }),
    });
    if (!fetchData.ok) {
      const responseError = await fetchData.json();
      const error = new Error("Something went wrong...");
      error.responseData = responseError;
      throw error;
    }
    toast.success("Password changed successfuly");
    reset();
  });

  function onSuccess(data: FormType) {
    console.log(data);
    changePassword();
  }

  return (
    <form
      onSubmit={handleSubmit(onSuccess)}
      className="mt-10 flex flex-col gap-5 items-end"
    >
      <div className="flex flex-col gap-2">
        <label>Old password</label>
        <input
          type="text"
          className="border-1 rounded-xs"
          {...register("oldPassword")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>New password</label>
        <input
          type="text"
          className="border-1 rounded-xs"
          {...register("newPassword")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Confirm new password</label>
        <input
          type="text"
          className="border-1 rounded-xs"
          {...register("confirmNewPassword")}
        />
      </div>
      <button className="border-1 px-4 py-2 rounded-xs">Update</button>
    </form>
  );
}
