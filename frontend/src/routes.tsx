import { Route, Routes } from "react-router-dom";
import DishFinder from "@/pages/finder.tsx";
import DisplayGeneratedDish from "@/pages/displayGenratedDIsh.tsx";
import DisplayDishes from "@/pages/displayDishes.tsx";
import AdvancedView from "@/pages/fullDishView.tsx";
import Home from "@/pages/home.tsx";
import Login from "./pages/login";
import Logout from "./pages/logout";
import ProtectRoute from "./utils/ProtectedRoute";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Terms from "./pages/terms";
import Test from "./pages/tests";

export const router = (
  <Routes>
    <Route
      path="/finder"
      element={
        <ProtectRoute>
          <DishFinder />
        </ProtectRoute>
      }
    />
    <Route
      path="/display_generated_dish"
      element={
        <ProtectRoute>
          <DisplayGeneratedDish />
        </ProtectRoute>
      }
    />
    <Route
      path="/dishes"
      element={
        <ProtectRoute>
          <DisplayDishes />
        </ProtectRoute>
      }
    />
    <Route
      path="/dish/:id"
      element={
        <ProtectRoute>
          <AdvancedView />
        </ProtectRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/info" element={<Terms />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/test" element={<Test />} />
  </Routes>
);