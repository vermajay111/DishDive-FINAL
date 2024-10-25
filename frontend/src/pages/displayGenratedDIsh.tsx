import Sidebar from "@/components/custom/sidebar/sidebar.tsx";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState } from "react";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

function DisplayGeneratedDish() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  let dish = { recipe_image: null, title: null, ing: [null], steps: [null] };

  if (localStorage.getItem("recipe_gen") !== null) {
    dish = JSON.parse(localStorage.getItem("recipe_gen"));
  }
  const [recipeImage, setRecipeImage] = useState(dish.recipe_image);

  React.useEffect(() => {
    setRecipeImage(dish.recipe_image);
  }, [dish.recipe_image]);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Sidebar>
      <ScrollArea
        className="h-full w-full p-4 flex flex-col items-center justify-center"
        style={{ overflowX: "hidden" }}
      >
        <div
          className="max-w-md mx-auto border border-[hsl(240, 5.9%, 90%)] p-4 w-[70%]"
          style={{ borderRadius: "10px" }}
        >
          <h1 className="text-4xl font-mono text-center">{dish.title}</h1>
          <br />
          {recipeImage && (
            <div className="w-full max-w-sm mx-auto">
              <img
                src={`data:image/png;base64,${recipeImage}`}
                alt="Generated Dish"
                className="w-full h-auto"
              />
            </div>
          )}
          <br />
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full max-w-sm mx-auto"
          >
            <h1 className="text font-semibold text-center">
              Here are the precise ingredients you will need to make this dish
            </h1>
            <CarouselContent>
              {dish.ing.map((item: any, index: any) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="flex-grow border border-[hsl(240, 5.9%, 90%)]">
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text font-semibold">{item}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <br />
          <h1 className="text font-semibold text-center">
            Here are the steps to make your dish:
          </h1>
          <Carousel setApi={setApi} className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {dish.steps.map((item: any, index: any) => (
                <CarouselItem key={index}>
                  <Card className="flex-grow border border-[hsl(240, 5.9%, 90%)]">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text font-semibold">{item}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <div className="py-2 text-center text-sm text-muted-foreground">
              Steps completed {current} of {dish.steps.length}
            </div>
          </Carousel>
          <Button variant="outline" onClick={() => {toast.success("This dish has been saved for later. You can access it in your dashboard")}}><PlusIcon className="mr-2" />Save This Dish</Button>
        </div>
      </ScrollArea>
    </Sidebar>
  );
}

export default DisplayGeneratedDish;