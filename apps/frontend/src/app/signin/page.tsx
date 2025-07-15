"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import { axiosInstance } from "@/config/axios"
import { handleAxiosError } from "@/utils/handleAxiosError"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/slices/authSlice"

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.email.trim() || !formData.password.trim()){
        toast.error("Every field is required.");
        return;
    }
    setLoading(true);

    try {
        const res = await axiosInstance.post('/auth/login', formData);

        if(res?.data?.success){
            toast.success(res?.data?.message || "Signin Successfull.");
            dispatch(setUser(res?.data?.user));
            router.push("/dashboard")
        }
    } catch (error) {
        handleAxiosError(error);
    }finally{
        setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">Promptiva</span>
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full flex justify-center gap-2" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
