import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Food1 from "../../../assets/LoadScreenImages/Food_1.jpg"
import Food2 from "../../../assets/LoadScreenImages/Food_2.jpg";
import Food3 from "../../../assets/LoadScreenImages/Food_3.jpg";
import Food4 from "../../../assets/LoadScreenImages/Food_4.jpg";
import Food5 from "../../../assets/LoadScreenImages/Food_5.jpg";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const LoadingScreen = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const messages = [
    { message: "The Most advanced Cookbook app ever!", img: Food1 },
    { message: "Use Our AI feature to cook food!", img: Food2 },
    { message: "Still under dev. Beta only!", img: Food3 },
    { message: "New recipes shared by users Everyday!", img: Food4 },
    {
      message: "Use our app to find the best dishes from all over the world!",
      img: Food5,
    },
  ];
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="relative w-full max-w-lg">
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="shadow-lg rounded-lg overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <img
                      src={message.img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-64 object-cover mb-4 rounded"
                    />
                    <span className="text-2xl font-semibold text-center">
                      {message.message}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2 shadow-md ml-2" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2 shadow-md mr-2" />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground mt-4">
          <Progress value={(current / count) * 100} className="w-full" />
          Slide {current} of {count}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
