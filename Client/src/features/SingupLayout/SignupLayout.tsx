export default function SignupLayout() {
  return (
    <div>
      <form className="flex flex-col gap-5 w-75 mx-auto mt-15 p-4 border-1 rounded-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">email</label>
          <input className=" border-1" type="text" id="email" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">password</label>
          <input className=" border-1" type="text" id="password" />
        </div>
        <div>
          <button className="btn" type="submit">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}
