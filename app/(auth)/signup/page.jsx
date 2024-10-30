"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken"; // Import jwt

// Define Zod schema for validation
const childSchema = z.object({
  name: z.string().min(1, { message: "Child's name is required." }),
  gender: z.enum(['male', 'female', 'other'], { message: "Select a gender." }),
  age: z.any()
    .min(2, { message: "Age must be at least 2." })
    .max(10, { message: "Age must be at most 10." }), // Age must be between 2 and 10
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  children: z.array(childSchema).min(1, { message: "At least one child is required." }), // At least one child
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export function Signup() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      children: [{ name: "", gender: 'male', age: 2 }], // Default child with minimum age
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check local storage for the token
    if (token) {
      try {
        // Verify the token (ensure it's valid and not expired)
        const decoded = jwt.decode(token); // Decode without verifying for client-side check
        if (decoded) {
          // User is logged in, redirect to the desired page (e.g., homepage)
          router.push("/"); // Redirect to home or another page
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [router]);

  const onSubmit = async (data) => {
    try {
      // Call SignUpUser from GlobalApi and wait for response
      const response = await GlobalApi.SignUpUser(data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.replace("/");
      }
      toast.success("Account created successfully!");
    } catch (error) {
      // Display error toast with the error message
      toast.error(
        error.response?.data?.message || "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e5f9f] via-[#40cb9f] to-[#1e5f9f] text-gray-800 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-xl p-6 shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-semibold text-center mb-4">Sign Up</h1>
        <p className="text-center mb-6">Create an account to get started</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="yourusername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="mobile" render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Children Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Children</h2>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-4">
                  <FormField control={form.control} name={`children.${index}.name`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child&apos;s Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Child's Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`children.${index}.gender`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full border rounded p-2 bg-white">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`children.${index}.age`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={2} max={10} placeholder="Child's Age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="button" onClick={() => remove(index)} variant="outline" className="mt-2">Remove Child</Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ name: "", gender: 'male', age: 2 })} className="mt-4">
                Add Another Child
              </Button>
            </div>

            <Button type="submit" className="w-full bg-[#1e5f9f] text-white">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
