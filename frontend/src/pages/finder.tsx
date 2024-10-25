import Sidebar from "@/components/custom/sidebar/sidebar.tsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@radix-ui/react-select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import LoadingScreen from "@/components/custom/load/loadingScreen";
import { axiosInstance } from "@/utils/TokenRefresh";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Food1 from "@/assets/IngImages/Ing_1.jpg";
import Food2 from "@/assets/IngImages/Ing_2.jpg";
import Food3 from "@/assets/IngImages/Ing_3.jpg";
import Food4 from "@/assets/IngImages/Ing_4.jpg";

export default function DishFinder() {
  const navigate = useNavigate();

   const [api, setApi] = React.useState<CarouselApi>();
   const [current, setCurrent] = React.useState(0);
   const [count, setCount] = React.useState(0);

   const messages = [
     {
       message: "Step 1: Consildate your left over edible items",
       img: Food1,
     },
     { message: "Step 2: One by one input all the ingredients to this app", img: Food2 },
     { message: "Important note! You can ignore basic elements like water and salt we will asume that you already have them", img: Food3 },
     { message: "Step 3: Click on the Cook Now button on the bottom right to start generating a recipe!", img: Food4 },
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

  const global_http = "http://127.0.0.1:8000";
  if (sessionStorage.getItem("userIng") === null) {
    sessionStorage.setItem("userIng", JSON.stringify([]));
  }
  if (!sessionStorage.getItem("nextUrl")) {
    sessionStorage.setItem(
      "nextUrl",
      "http://127.0.0.1:8000/recipes/ners/?page=1"
    );
  }
  if (sessionStorage.getItem("currIng") === null){
    sessionStorage.setItem("currIng", JSON.stringify([]));
  }
  const storedUserIng = sessionStorage.getItem("userIng");
  const storedCurrIng = sessionStorage.getItem("currIng");

  const initialCurrIng: string[] = storedCurrIng
    ? JSON.parse(storedCurrIng):
    [];
  const initialUserIng: string[] = storedUserIng
    ? JSON.parse(storedUserIng)
    : [];

  const [userIng, setUserIng] = useState<string[]>(initialUserIng);
  const [currIng, setCurrIng] = useState<string[]>(initialCurrIng);
  const [next_url, setNextUrl] = useState<string>(
    sessionStorage.getItem("nextUrl")
  );
  const [quickAdd, setQuickAdd] = React.useState("");

  function addItem(e: string) {
    if (!userIng.includes(e)) {
      const updatedUserIng = [...userIng, e];
      setUserIng(updatedUserIng);
      sessionStorage.setItem("userIng", JSON.stringify(updatedUserIng));
      const updatedCurrIng = currIng.filter((item) => item !== e);
      toast.success(`We successfully added item: ${e} to your cart.`);
      setCurrIng(updatedCurrIng);
    }
  }

  const mutation = useMutation({
    mutationFn: async (ners: any) => {
      const response = await axiosInstance.post(
        global_http + "/recipes/generate_new_recipe/",
        ners
      );
      navigate("/display_generated_dish");
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("recipe_gen", JSON.stringify(data.data));
      toast.success(
        `We have made a new recipe! Click Save to save your new dish for later!`
      );
      return data.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error generating recipe!");
    },
  });

  function submitNers() {
    const data = {
      ners: userIng,
    };
    toast.success("We are prcessing your request please wait!")
    mutation.mutate(data);
  } 

  function resetCart() {
    setCurrIng([]);
    setUserIng([]);
    sessionStorage.setItem("userIng", JSON.stringify([]));
    setNextUrl("http://127.0.0.1:8000/recipes/ners/?page=1");
  }
  function removeItem(e: string) {
    const updatedUserIng = userIng.filter((item) => item !== e);
    setUserIng(updatedUserIng);
    sessionStorage.setItem("userIng", JSON.stringify(updatedUserIng));
    const updatedCurrIng = [...currIng, e];
    setCurrIng(updatedCurrIng);
    toast.success(`We successfully removed item: ${e} from your cart.`)
  }
  function makeArray(data: any) {
    const res: any = [];
    for (let i = 0; i < data.length; i++) {
      res.push(data[i].ner);
    }
    return res;
  }

  function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (quickAdd.trim() !== "") {
      const data = [...userIng, quickAdd];
      setUserIng(data);
      sessionStorage.setItem("userIng", JSON.stringify(data));
      setQuickAdd("");
    }
  }
  const { isPending, data, refetch, isFetched } = useQuery({
    queryKey: ["nerData"],
    queryFn: () =>
      axiosInstance.get(next_url).then((res: any) => {
        setNextUrl(res.data.next);
        setCurrIng([...currIng, ...makeArray(res.data.results)]);
        console.log([...currIng, ...makeArray(res.data.results)]);
        //sessionStorage.setItem("currIng", JSON.stringify(currIng))
        sessionStorage.setItem("nextUrl", res.data.next);
        return makeArray(res.data.results);
      }),
  });

  async function loadMoreData(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const data = await refetch();
    const new_data = [...currIng, ...data.data];
    setCurrIng(new_data);
  }
  
  useEffect(() => {
    if (isFetched) {
      setCurrIng(data);
    }
  }, [isFetched, data]);




  return (
    <Sidebar>
      {mutation.isPending ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Find Ingredients</CardTitle>
                  <CardDescription>
                    Enter all ingredients one by one
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <form className="flex-grow flex flex-col">
                    <div className="space-y-1.5 flex-grow flex flex-col">
                      <div className="flex justify-center items-center h-full p-4">
                        <div className="relative w-full max-w-lg">

                          <Carousel
                            setApi={setApi}
                            className="w-full"
                            plugins={[
                              Autoplay({
                                delay: 4500,
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
                        </div>
                      </div>

                      <div className="space-y-1.5 flex-grow flex flex-col">
                        <Label htmlFor="framework">
                          Our Commonly used ingredients (Click To add Items)
                        </Label>
                        <div className="p-4 flex-grow flex flex-col">
                          <ScrollArea className="h-72 w-full rounded-md border flex-grow flex flex-col">
                            <div className="p-4 flex-grow flex flex-col">
                              {isPending ? (
                                <div className="flex flex-col items-center justify-center flex-grow">
                                  <Loader2 className="mr-2 animate-spin" />
                                  <p>Loading data please wait...</p>
                                </div>
                              ) : (
                                <>
                                  {currIng.map((item, index) => (
                                    <div key={index} className="text-sm">
                                      <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          addItem(item);
                                        }}
                                      >
                                        {item}
                                      </Button>
                                      <Separator className="my-2" />
                                    </div>
                                  ))}
                                  <Button
                                    variant="link"
                                    className="w-full"
                                    onClick={loadMoreData}
                                  >
                                    Load More
                                  </Button>
                                </>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Cook Food With The Stuff You Have!</CardTitle>
                  <CardDescription>
                    Make sure you have everything you have
                  </CardDescription>
                  <Button variant="destructive" onClick={resetCart}>
                    Reset Cart
                  </Button>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <form className="flex-grow flex flex-col">
                    <div className="grid w-full items-center gap-4 flex-grow flex flex-col">
                      <div className="flex flex-col space-y-1.5 flex-grow">
                        <div className="flex space-x-2">
                          <Input
                            id="name"
                            placeholder="You can just type your ingredient in here, and add it no searching needed"
                            className="flex-grow"
                            value={quickAdd}
                            onChange={(e) => setQuickAdd(e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleQuickAdd}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                        <Label htmlFor="framework">
                          Your added ingredients (click items to remove)
                        </Label>
                        <div className="p-4 flex-grow flex flex-col">
                          <ScrollArea className="h-80 w-full rounded-md border flex-grow flex flex-col">
                            <div className="p-4 flex-grow flex flex-col">
                              {userIng.length === 0 ? (
                                <span>
                                  Nothing to show here. Add new items on the
                                  left panel
                                </span>
                              ) : (
                                userIng.map((item, index) => (
                                  <div key={index} className="text-sm">
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        removeItem(item);
                                      }}
                                    >
                                      {item}
                                    </Button>
                                    <Separator className="my-2" />
                                  </div>
                                ))
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="mt-4 p-4 border border-gray-800 rounded">
                    <span className="font-semibold text-sm">
                      Warning! In order to create the best dish for you it might
                      take some time! ETA: 1-3min
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between space-x-1">
                    <Label htmlFor="mode-switch" className="flex items-center">
                      <span>Finder</span>
                      <Switch id="mode-switch" className="mx-2" />
                      <span>AI Cook</span>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {isPending ? (
                    <Button disabled className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button onClick={submitNers}>Cook Now!</Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </Sidebar>
  );
}