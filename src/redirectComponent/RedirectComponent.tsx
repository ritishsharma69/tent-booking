import React, { useState, useEffect } from "react";
import { useTentContext } from "../store/Store";
import Loader from "./Loader";

const RedirectComponent: React.FC = () => {
  const { otpResponseData } = useTentContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!otpResponseData || typeof otpResponseData !== "object") {
      console.error("otpResponseData is not an object:", otpResponseData);
      return;
    }

    const timer = setTimeout(() => {
      // Create a form element
      const form = document.createElement("form");
      form.method = "POST";
      form.action = otpResponseData.action || "https://example.com";

      // Add data as hidden inputs
      Object.entries(otpResponseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      // Append the form to the body and submit it
      document.body.appendChild(form);
      form.submit();

      // Cleanup
      document.body.removeChild(form);
    }, 2000); // 2 seconds delay

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [otpResponseData]); // Dependency array includes otpResponseData

  // return null; // This component doesn't render anything visible
  return isLoading ? <Loader /> : null;
};

export default RedirectComponent;
