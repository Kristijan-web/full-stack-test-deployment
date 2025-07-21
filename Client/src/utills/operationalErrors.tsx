import toast from "react-hot-toast";

export default function operationalErrors(message: string) {
  toast.error(message);
}
