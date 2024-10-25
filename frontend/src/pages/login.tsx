import { Button } from "@/components/ui/button";
import axios from "axios";
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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { setCookieByDays, setCookieByMinutes } from "@/utils/cookieManager";
import LoadingScreen from "@/components/custom/load/loadingScreen";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/custom/sidebar/sidebar";
import toast from "react-hot-toast";
import Food4 from "@/assets/LoadScreenImages/Food_3.jpg";

interface UserDataTypes {
  username: string;
  password: string;
}

export default function Login() {
  const dispatch = useDispatch();
  const global_http = "http://127.0.0.1:8000/";
  const navigate = useNavigate();
  const schema = yup.object().shape({
    username: yup.string().max(30).required("Username is required"),
    password: yup.string().min(6).max(20).required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (UserCred: any) => {
      const response = await axios.post(global_http + "users/login", UserCred);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setCookieByMinutes("access", data.access, 5);
      setCookieByDays("refresh", data.refresh, 7);
      setCookieByDays("username", variables.username, 7);
      dispatch(user_refresh());
      dispatch(token_refresh());
      toast.success("Successfully Logged In!");
      navigate("/dishes");
    },
    onError: (error) => {
      console.log(error);
      toast.error("There was an error logging in! This account may not exist!");
    },
  });

  const onSubmit = (data: UserDataTypes) => {
    mutation.mutate(data);
  };
  if (mutation.isPending) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }
  return (
    <Sidebar>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-[35%] overflow-hidden">
          <img
            src={Food4}
            className="h-64 object-cover w-full rounded-t-lg"
          />
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="">Login</CardTitle>
              <CardDescription>
                Login in to your existing account to see your account and access
                the best art
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Publicly Visible Username"
                    {...register("username")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="8 digit secure password"
                    {...register("password")}
                  />
                </div>
                <div
                  className="flex items-center space-x-2"
                  style={{ marginTop: "20px" }}
                >
                  <Label htmlFor="terms">
                    Don't Have An Account?{" "}
                    <Link to="/signup" style={{ color: "skyblue" }}>
                      Signup
                    </Link>
                  </Label>
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="outline">
                  <input type="submit" className="submitBtn" value="Login" />
                </Button>
                {mutation.isError ||
                  (errors.password && (
                    <p className="text-red-500 ml-3">
                      Username or password is incorrect please try again!
                    </p>
                  ))}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}