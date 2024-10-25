import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/custom/load/loadingScreen.tsx";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/custom/sidebar/sidebar.tsx";
import { axiosInstance } from "@/utils/TokenRefresh";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

function AdvancedView() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentStep, setCurrentStep] = React.useState(0);
  const globalHttp = "http://127.0.0.1:8000";

  const { isPending, data } = useQuery({
    queryKey: ["recipeData", id],
    queryFn: () =>
      axiosInstance
        .get(`${globalHttp}/recipes/dish`, { params: { id } })
        .then((res) => res.data),
  });

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentStep(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Sidebar>
      <ScrollArea className="h-full w-full p-6 flex flex-col items-center relative">
        
        <Button
          onClick={() => navigate(-1)} // Navigate back
          className="absolute top-4 left-transition" 
          variant="outline"
        >
          <Undo2 className="mr-2"/> Go Back
        </Button>

        <div className="max-w-lg mx-auto shadow-lg rounded-2xl p-6 border">
          <h1 className="text-5xl font-bold text-center mb-4 font-serif">
            {data.title}
          </h1>

          <h2 className="text-xl text-center mb-2">Ingredients</h2>
          <Carousel
            opts={{ align: "center" }}
            className="w-full max-w-md mx-auto"
          >
            <CarouselContent>
              {data.ingredient.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="flex-grow border border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-gray-800">
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-medium text-white">
                          {item.name}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-400 hover:text-white rounded-full" />
            <CarouselNext className="text-gray-400 hover:text-white rounded-full" />
          </Carousel>

          <h2 className="text-xl font-semibold text-center mt-6 mb-2">
            Steps to Make Your Dish
          </h2>
          <Carousel setApi={setApi} className="w-full max-w-md mx-auto">
            <CarouselContent>
              {data.step.map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="flex-grow border border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-gray-800">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-medium text-white">
                        {item.step}
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray -400 hover:text-white rounded-full" />
            <CarouselNext className="text-gray-400 hover:text-white rounded-full" />
            <div className="py-2 text-center text-sm text-gray-500">
              Steps completed: {currentStep} of {data.step.length}
            </div>
          </Carousel>
        </div>
      </ScrollArea>
    </Sidebar>
  );
}

export default AdvancedView;
