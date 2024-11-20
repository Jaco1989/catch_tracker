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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  registerSchema,
  userRoles,
  type RegisterFormValues,
} from "./validation";
import { signUp } from "./actions";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleApplication: "USER",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsPending(true);
      const result = await signUp(data);

      if (result?.error) {
        toast.error(result.error);
        if (result.error.includes("Username")) {
          form.setError("username", {
            message: result.error,
          });
        } else if (result.error.includes("Email")) {
          form.setError("email", {
            message: result.error,
          });
        }
        return;
      }

      toast.success("Registration successful! Please wait for approval.");
      router.push("/register-pending-message");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Create an Account 🚀</h1>
          <p className="text-gray-500">
            Please fill in the details below to register
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      {...field}
                      autoComplete="username"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                      autoComplete="email"
                      disabled={isPending}
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
                      autoComplete="new-password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      autoComplete="new-password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleApplication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What role are you applying for?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/([A-Z])/g, " $1").trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-red-500 hover:text-red-600 underline"
                      >
                        terms and conditions
                      </Link>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
