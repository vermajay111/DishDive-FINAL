import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingScreen from "@/components/custom/load/loadingScreen.tsx";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import Sidebar from "@/components/custom/sidebar/sidebar.tsx";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { axiosInstance } from "@/utils/TokenRefresh";
import { Separator } from "@/components/ui/separator";
import { HeartIcon, ScrollTextIcon, SendIcon, PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Alert } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";




import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeartButton from "@/components/custom/heartIcon/heart";
import Savebutton from "@/components/custom/saveIcon/save";

import { toast } from "react-hot-toast";

type CardProps = React.ComponentProps<typeof Card>;
interface DishData {
  id: number;
  title: string;
  ner: any[];
}

function Dishes({ className, ...props }: CardProps) {
  const global_http = "http://127.0.0.1:8000";
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [next_url, set_next_url] = useState<string | null>(null);
  const [dishes, setDishes] = useState<DishData[]>([]);
  const { isPending, isError, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axiosInstance.get(global_http + "/recipes/").then((res: any) => {
        set_next_url(res.data.next);
        return res.data;
      }),
  });
  const GetDetailedView = (id: number) => {
    console.log(id);
  };
  const loadMore = async () => {
    if (next_url) {
      const response = await axiosInstance.get(next_url);
      const newData = response.data.results;
      const uniqueData = newData.filter(
        (item: any) =>
          !dishes.some((existingItem) => existingItem.id === item.id)
      );
      setDishes((prevDishes) => [...prevDishes, ...uniqueData]);
      set_next_url(response.data.next);
      toast.success("Loaded more dishes sucessfully!", {
        position: "bottom-right",
      });
    }
  };

  if (isPending)
    return (
      <Sidebar>
        <LoadingScreen />
      </Sidebar>
    );
  return (
    <Sidebar>
      <div className="flex w-full">
        {/* Calendar Section */}
        <div className="ml-10 mt-10">
          <Calendar
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4"
          />
          <Button variant="secondary">
            Plan This Week's Meal Using DishDive AI
          </Button>
        </div>

        <div className="flex w-[55%]">
          <div className="flex-grow">
            <div className="flex flex-col items-center justify-center w-full">
              <Tabs defaultValue="account" className="w-full max-w-[600px]">
                <br />
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="account">Cookbook</TabsTrigger>
                  <TabsTrigger value="password">
                    Dishes Published By Users
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <div className="flex flex-col items-center justify-center p-4 w-full">
                    <div className="w-full max-w-[90%] rounded-md border p-4 centered-container">
                      <div className="flex space-x-2 mb-4">
                        <Input
                          id="name"
                          placeholder="Type the name of the dish you want to cook..."
                          className="flex-grow"
                        />
                        <Button variant="outline" size="icon">
                          <SearchIcon />
                        </Button>
                      </div>
                      <ScrollArea className="overflow-y-auto w-full max-h-[750px]">
                        <div className="flex flex-col space-y-4">
                          {!isError ? (
                            [...data.results, ...dishes].map(
                              (post: DishData) => (
                                <Card
                                  className={cn("w-full", className)}
                                  {...props}
                                  key={post.id}
                                >
                                  <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid gap-4">
                                    <p className="text-sm font-medium">
                                      Ingredients You Will Need:
                                    </p>
                                    <div>
                                      {post.ner.map((n: any, index: number) => (
                                        <div
                                          key={index}
                                          className="mb-1 grid grid-cols-[20px_1fr] items-start pb-1 last:mb-0 last:pb-0"
                                        >
                                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                          <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground leading-none">
                                              {n.ner}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                  <Separator className="my-4" />
                                  <CardFooter className="flex justify-between space-x-2">
                                    <div className="flex space-x-4 items-center">
                                      <TooltipProvider>
                                        <HeartButton post={post.title} />

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              onClick={() =>
                                                GetDetailedView(post.id)
                                              }
                                            >
                                              <Link to={`/dish/${post.id}`}>
                                                <ScrollTextIcon
                                                  className="text-blue-500 hover:text-blue-700 transition"
                                                  size={20}
                                                />
                                              </Link>
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            View Dish In Detail
                                          </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <button
                                                  onClick={() =>
                                                    GetDetailedView(post.id)
                                                  }
                                                >
                                                  <SendIcon
                                                    className="text-green-500 hover:text-green-700 transition"
                                                    size={20}
                                                  />
                                                </button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Share This Link With Your Friends!
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    <p className="text-blue-500">http://azure.dishdivenow.com/dishes/{post.id}/</p>
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Close
                                                  </AlertDialogCancel>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Get a link to share dish
                                          </TooltipContent>
                                        </Tooltip>
                                        <Savebutton post={post.title}/>
                                      </TooltipProvider>
                                    </div>
                                  </CardFooter>
                                </Card>
                              )
                            )
                          ) : (
                            <h1>Error fetching content</h1>
                          )}
                        </div>
                      </ScrollArea>
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        className="w-full mt-4"
                      >
                        Load More
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="password">
                  <p>Password</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default Dishes;