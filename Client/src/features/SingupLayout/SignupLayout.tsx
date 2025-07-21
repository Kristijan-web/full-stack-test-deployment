import { useState } from "react";
import useCatchAsync from "../../utills/catchAsync";

export default function SignupLayout() {
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const signup = useCatchAsync(async (e) => {
    e.preventDefault();

    const sendData = await fetch(`http://127.0.0.1:3000/api/v1/users/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await sendData.json();
    if (data.message === "success") {
      console.log("uspesno registrovan user");
    }
  });

  return (
    <div>
      <form className="flex flex-col gap-5 w-75 mx-auto mt-15 p-4 border-1 rounded-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" border-1"
            type="text"
            id="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" border-1"
            type="text"
            id="password"
          />
        </div>
        <div>
          <button onClick={(e) => signup(e)} className="btn" type="submit">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}
