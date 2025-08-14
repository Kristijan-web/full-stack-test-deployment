import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";
import sendServerErrorToCatch from "../../utills/sendServerErrorToCatch";

export default function Logout() {
  const { setUser } = useUser();
  const handleLogout = useCatchAsync(async () => {
    const fetchData = await fetch(`${API_URL}/api/v1/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!fetchData.ok) {
      // nema mi smisla ovde prikazivati gresku sa servera, kada korisnik klikne logout i operacija ne uspe dovoljno je ("Something went wrong...") jer korisnikova akcija nema nikakvog uticaja na logout
      await sendServerErrorToCatch(fetchData);
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
