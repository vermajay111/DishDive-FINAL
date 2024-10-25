import { useSelector } from "react-redux";
import Sidebar from "@/components/custom/sidebar/sidebar";
import "./protectedRoute.css";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";


export default function ProtectRoute({ children }: any) {
  const refreshToken = useSelector((state: any) => state.token.refresh);

    useEffect(() => {
      if (!refreshToken) {
            toast.error("Sorry but we cannot let you through! You must be logged in 😢");
      }
    }, []);

  return (
    <>
      {refreshToken ? (
        children
      ) : (
        <Sidebar>
          <div className="blocker">
            <div className="blocker-content">
              <h1 style={{ color: "#fff" }}>
                You need to log in to view this page
              </h1>
              <p style={{ color: "#ccc" }}>
                Please login to access this feature.
              </p>
              <button
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                <Button variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </button>
            </div>
          </div>
        </Sidebar>
      )}
    </>
  );
}
