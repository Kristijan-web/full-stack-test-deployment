import { useState } from "react";
import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import sendServerErrorToCatch from "../../utills/sendServerErrorToCatch";
import { useUser } from "../../contexts/UserContext";

export default function ResetPasswordLayout() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = useCatchAsync(async (e) => {
    e?.preventDefault();
    const fetchData = await fetch(
      `${API_URL}/api/v1/users/forgot-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      }
    );
    if (!fetchData.ok) {
      await sendServerErrorToCatch(fetchData);
    }
    const response = await fetchData.json();

    setUser(response.data);
    navigate("/");
  });

  return (
    <div>
      <section>
        <div className="max-w-xl mx-auto px-4 flex items-center justify-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col items-end justify-start gap-5"
          >
            <div className="flex flex-col gap-3">
              <label htmlFor="new-password">New password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="new-password"
                type="text"
                className="border-1 rounded-xs"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirm-password"
                type="text"
                className="border-1 rounded-xs"
              />
            </div>
            <div>
              <button type="submit" className="border-1 rounded-xs px-4 py-1">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
