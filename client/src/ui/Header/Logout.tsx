import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";

export default function Logout() {
  const { setUser } = useUser();
  const handleLogout = useCatchAsync(async () => {
    const fetchData = await fetch(`${API_URL}/api/v1/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!fetchData.ok) {
      const response = await fetchData.json();
      const error = new Error("Something went wrong...");
      response.message = "Logout failed, please contact developer";
      error.responseData = response;
      throw error;
    }

    if (fetchData.ok) {
      setUser(null);
      toast.success("Successfuly logged out");
    }
  });

  return (
    <p className="cursor-pointer" onClick={handleLogout}>
      Logout
    </p>
  );
}
