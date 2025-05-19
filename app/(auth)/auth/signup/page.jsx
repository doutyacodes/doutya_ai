"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, UserIcon, LockIcon, Phone, UserPlus, Mail } from "lucide-react";


const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  mobile: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(100),
  confirmPassword: z.string().min(6, { message: "Confirm password is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SignupUser = async (data) => {
    const response = await fetch(`/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData, status: response.status } };
    }

    return { data: await response.json() };
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = data;
      // Send signup request
      const response = await SignupUser(signupData);
      if (response.data.token) {
        localStorage.setItem('user_token', response.data.token);
        toast.success("Account created successfully!");
        const redirectPath = sessionStorage.getItem("temp_redirect");
        if (redirectPath) {
          sessionStorage.removeItem("temp_redirect");
          router.replace(redirectPath);
        } else {
          router.replace("/news");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-red-800 p-6">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-white/10 mb-3">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
            <p className="text-red-100 mt-1">Join our community today</p>
          </div>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Enter your full name" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Choose a unique username" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Enter your mobile number" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Create password" 
                          className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirm</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Confirm password" 
                          className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )} />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 font-medium rounded-md transition-all duration-200 mt-2"
              >
                {isSubmitting ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-red-800 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}