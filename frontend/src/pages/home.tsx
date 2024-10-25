import Sidebar from "@/components/custom/sidebar/sidebar.tsx";
import LoadingScreen from "@/components/custom/load/loadingScreen";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/D.png";
import { ModeToggle } from "@/components/custom/modetoggle/modetoggle";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold font-[cursive]">
            Welcome to Your AI-Powered Cookbook
          </h1>

          <p className="text max-w-2xl mx-auto mb-8 animate-fade-in" >
            Discover delicious recipes with AI. Whether you're searching for new
            ideas or need personalized guidance, our app is designed to make
            cooking simple, fun, and smarter than ever.
          </p>
        </div>
        <img
          src={Logo}
          className="h-64 object-cover rounded-full mb-10 animate-bounce shadow-lg"
          style={{ height: "170px", width: "170px" }}
          alt="App Logo"
        />

        {/* Button Section */}
        <div className="flex justify-center space-x-4 mb-10 animate-fade-in">
          <Button
            variant="default"
            size="lg"
            className="bg-white text-black border border-white hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
            onClick={() => navigate("/dishes")}
          >
            Explore Recipes
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border border-gray-500 hover:bg-gray-700 hover:text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
            onClick={() => navigate("/favorites")}
          >
            View Favorites
          </Button>
          <ModeToggle />
        </div>

        {/* Loading Screen */}
        <LoadingScreen />
      </div>
    </Sidebar>
  );
}
