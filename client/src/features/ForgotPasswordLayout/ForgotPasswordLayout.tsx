import { useState } from "react";
import useCatchAsync from "../../utills/catchAsync";
import { API_URL } from "../../utills/constants";
import toast from "react-hot-toast";

export default function ForgotPasswordLayout() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Backend je  taj koji ce poslati reset link na mail
  const handleReset = useCatchAsync(async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    const fetchData = await fetch(`${API_URL}/api/v1/users/reset-token`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    if (!fetchData.ok) {
      const errorResponse = await fetchData.json();
      const error = new Error("Something went wrong...");
      error.responseData = errorResponse;
      throw error;
    }
    toast.success("Reset link has been send to email address");
  }, setIsLoading);

  return (
    <div>
      <section className="px-4 max-w-xl mx-auto ">
        <form
          onSubmit={(e) => handleReset(e)}
          className="inline-flex flex-col items-start justify-center gap-5"
        >
          <div className="flex flex-col gap-3">
            <label htmlFor="email">Enter email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="text"
              className="border-1 rounded-xs"
            />
          </div>
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <button className="border-1 rounded-xs px-4 py-1">Submit</button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
