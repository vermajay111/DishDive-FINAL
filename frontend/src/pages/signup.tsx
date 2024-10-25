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
import { Link } from "react-router-dom";
import LoadingScreen from "@/components/custom/load/loadingScreen";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";
import {
  setCookieByDays,
  setCookieByMinutes,
} from "@/utils/cookieManager"
import { useDispatch } from "react-redux";
import Sidebar from "@/components/custom/sidebar/sidebar";
import Food5 from "@/assets/LoadScreenImages/Food_4.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UserDataTypes {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

function Signup() {
  const global_http = "http://127.0.0.1:8000/";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    username: yup.string().max(30).required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).max(20).required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const mutation = useMutation({
    mutationFn: async (UserCred: any) => {
      const response = await axios.post(global_http + "users/signup", UserCred);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setCookieByMinutes("access", data.access, 5);
      setCookieByDays("refresh", data.refresh, 7);
      setCookieByDays("username", variables.username, 7);
      dispatch(user_refresh());
      dispatch(token_refresh());
      toast.success("Successfully Created Account!");
      navigate("/dishes");
    },
    onError: (error) => {
      console.log(error);
      toast.error("There was an error creating your account! Please try again");
    },
  });

  const onSubmit = (data: UserDataTypes) => {
    console.log(data);
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
    <>
      <Sidebar>
        <div className="flex flex-col items-center justify-center h-screen">
          {" "}
          {/* Center items vertically */}
          <div className="w-[35%] overflow-hidden">
            {" "}
            {/* Fixed width for both elements */}
            <img
              src={Food5}
              className="h-64 object-cover w-full rounded-t-lg" // Rounded top corners only
            />
            <Card className="w-full">
              {" "}
              {/* No rounded corners on the card */}
              <CardHeader>
                <CardTitle className="">Signup</CardTitle>
                <CardDescription>
                  Register now to access the best gourmet meals recipe for free!
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="Legal First Name"
                      {...register("first_name")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Legal Last Name"
                      {...register("last_name")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Publicly Visible Username"
                      {...register("username")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Personal email Address"
                      {...register("email")}
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
                  <div className="space-y-1">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="Same password as above"
                      {...register("confirm_password")}
                    />
                    <p></p>
                  </div>
                  <div
                    className="flex items-center space-x-2"
                    style={{ marginTop: "20px" }}
                  >
                    <Label htmlFor="terms">
                      By Signing Up You Accept the{" "}
                      <Link to="/policy" style={{ color: "skyblue" }}>
                        Terms And Policies
                      </Link>
                    </Label>
                  </div>
                  <div
                    className="flex items-center space-x-2"
                    style={{ marginTop: "20px" }}
                  >
                    <Label htmlFor="terms">
                      Already Have An Account?{" "}
                      <Link to="/login" style={{ color: "skyblue" }}>
                        Login
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <input
                      type="submit"
                      className="submitBtn"
                      value="Sign up"
                    />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </Sidebar>
    </>
  );
}

export default Signup;