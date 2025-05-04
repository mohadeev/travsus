"use client"
import React, { useState } from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

const AccountPass = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch('/api/user/post/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update password.");
      } else {
        setSuccess("Password updated successfully!");
      }
    } catch (error) {
      setError("An error occurred while updating the password.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Update your password</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label>Current password</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>New password</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="pt-2">
          <ButtonPrimary type="submit">Update password</ButtonPrimary>
        </div>
      </form>
    </div>
  );
};

export default AccountPass;
