import PasswordChange from "./PasswordChange";
import GeneralSettings from "./GeneralSettings";

export default function ProfileLayout() {
  return (
    <div>
      <section className="mt-15">
        <div className="flex  gap-20 max-w-xl mx-auto px-5 items-start">
          <div>
            <h2>General settings</h2>
            <GeneralSettings />
          </div>
          <div>
            <h2>Change password</h2>
            <PasswordChange />
          </div>
        </div>
      </section>
    </div>
  );
}
