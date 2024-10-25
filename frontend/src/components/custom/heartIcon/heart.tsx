import { useState } from "react";
import { HeartIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

function HeartButton({ post }) {
  const [isLoved, setIsLoved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // State for animation

  const handleHeartClick = () => {
    // Trigger animation
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false); // Reset animation state after it's done
    }, 300); // Match the timeout with the duration of your animation

    // Toggle the heart's state
    setIsLoved(!isLoved);

    // Show toast notification
    toast(isLoved ? `Disliked, ${post}` : `Liked, ${post}`, {
      duration: 4000,
      position: "bottom-right",
      icon: "❤️",
      iconTheme: {
        primary: "#000",
        secondary: "#fff",
      },
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={handleHeartClick}>
          <HeartIcon
            className={`transition-transform duration-300 ${
              isAnimating ? "scale-150" : "" // Apply the scaling class when animating
            } ${
              isLoved
                ? "text-red-700 fill-red-700" // 'loved' state styles
                : "text-red-500 hover:text-red-700 fill-transparent" // 'not loved' state styles
            }`}
            size={20}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {isLoved ? "You love this dish!" : "Love this dish!"}
      </TooltipContent>
    </Tooltip>
  );
}

export default HeartButton;
