import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const clientId =
    "380619020993-45je5iuq0789kvuf6gifu0b4tl6ghrt4.apps.googleusercontent.com";

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:3000/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Google login successful!");
        // Save token or perform further actions
        console.log("User data:", data);
        Cookies.set("sauto", data.cok, { expires: 10 });
        const userData = data.cok.split("-");
        navigate("/");
        window.location.reload();
      } else {
        toast.error(data.msg || "Google login failed.");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("An error occurred during Google login.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            toast.error("Google login failed. Please try again.");
          }}
          theme="filled_blue"
          size="large"
          shape="pill"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
