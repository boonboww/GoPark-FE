"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
    profilePicture: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === "profilePicture" && files && files[0]) {
      // upload file as Base64 (demo purpose)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/signup", formData);
      const token = res.data?.token;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      router.push("/account/login?success=1");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        typeof (err as any).response?.data?.message === "string"
      ) {
        setError((err as any).response.data.message);
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Your name"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="0123456789"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
