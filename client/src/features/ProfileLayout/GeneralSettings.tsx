import { useForm } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";
import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";
import sendServerErrorToCatch from "../../utills/sendServerErrorToCatch";

type FormType = {
  fullName: string;
  email: string;
  password: string;
};

export default function GeneralSettings() {
  const { user, setUser } = useUser();
  const { register, handleSubmit, getValues } = useForm<FormType>({
    defaultValues: user || undefined,
  });

  const updateSettings = useCatchAsync(async () => {
    const fetchData = await fetch(`${API_URL}/api/v1/users`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        fullName: getValues().fullName,
        email: getValues().email,
      }),
    });

    const response = await fetchData.json();

    if (!fetchData.ok) {
      await sendServerErrorToCatch(fetchData);
    }

    toast.success("Update successful");
    setUser(response.data);
  });

  function onSuccess(data: FormType) {
    console.log(data);
    updateSettings();
  }

  return (
    <form
      onSubmit={handleSubmit(onSuccess)}
      className="mt-10 flex flex-col gap-5 items-end"
    >
      <div className="flex flex-col gap-2">
        <label>Full name</label>
        <input
          type="text"
          className="border-1 rounded-xs"
          {...register("fullName")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Email</label>
        <input
          type="text"
          className="border-1 rounded-xs"
          {...register("email")}
        />
      </div>
      <button className="border-1 px-4 py-2 rounded-xs">Update</button>
    </form>
  );
}
