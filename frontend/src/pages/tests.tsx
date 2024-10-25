
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Test() {
  
  const notify = () =>
    toast("Hello World", {
      duration: 4000,
      position: "bottom-right",

      icon: "👏",
      iconTheme: {
        primary: "#000",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    });
  return (
    <>
      <Button onClick={notify}>
        Show Toast
      </Button>
    </>
  );
}
