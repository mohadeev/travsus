// Import necessary hooks
'use client';

import React, { useState } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import axios from "axios"; // HTTP client

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params from URL
  const token = searchParams.get('token') || ""; // Extract the token from query params

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password match validation (local validation)
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Send a request to your API to reset the password
      const response = await axios.post("/api/user/post/update-password", {
        token, // Token from URL
        newPassword,
        confirmPassword
      });

      // If password reset is successful
      if (response.status === 200) {
        setSuccess(true);
        setError(null); // Clear any errors
        // Redirect the user to login or dashboard after password reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        // Display the backend message or a default error message
        setError(response.data.message || "Something went wrong!");
      }
    } catch (err: any) {
      // Handle errors from backend
      if (err.response && err.response.data && err.response.data.message) {
        // Use backend error message if available
        setError(err.response.data.message);
      } else {
        // Fallback error message
        setError("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div className="nc-ResetPassword">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          Reset Password
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          {/* Display error message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Display success message */}
          {success && <div className="text-green-500">Password reset successfully!</div>}

          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                New Password
              </span>
              <Input
                type="password"
                placeholder="Enter new password"
                className="mt-1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Confirm Password
              </span>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <ButtonPrimary type="submit">Reset Password</ButtonPrimary>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
