"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormValues, loginSchema } from "./validation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsPending(true);
      console.log("Form data:", data);
      // Add your login logic here
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Welcome to CatchTrack! 👋</h1>
          <p className="text-gray-500">
            Please sign-in to your account and start the adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="nazmie@catchtrack.co.za"
                      {...field}
                      disabled={isPending}
                      autoComplete="email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isPending}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-500">
                      Remember me
                    </FormLabel>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Forgot password?
                  </Link>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-500">
                New on our platform?{" "}
                <Link
                  href="/register"
                  className="text-red-500 hover:text-red-600 font-medium underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
