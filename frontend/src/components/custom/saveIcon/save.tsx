import { useState } from "react";
import { PlusIcon } from "lucide-react"; // Import your HeartIcon
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

function Savebutton({ post }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // State for animation

  const handleHeartClick = () => {
    setIsSaved(!isSaved); // Toggle the heart's state
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false); // Reset animation state after it's done
    }, 300); 

    toast(
      isSaved
        ? `Removed, ${post} from saved dishes`
        : `Saved, ${post}. You can now access this dish by going to your dashboard`,
      {
        duration: 4000,
        position: "bottom-right",

        // Styling
        style: {},
        className: "",

        // Custom Icon
        icon: "➕",

        // Change colors of success/error/loading icon
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },

        // Aria
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      }
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={handleHeartClick}>
          <PlusIcon
            className={`transition-transform duration-300 ${
              isAnimating ? "scale-150" : "" // Apply the scaling class when animating
            } ${
              isSaved
                ? "text-yellow-700 hover:text-yellow-700" // Apply both text color and fill for 'loved' state
                : "text-yellow-500 hover:text-yellow-700 fill-transparent"
            }`}
            size={20}

          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {isSaved ? "You Have saved this dish" : "Save this dish!"}
      </TooltipContent>
    </Tooltip>
  );
}

export default Savebutton;
