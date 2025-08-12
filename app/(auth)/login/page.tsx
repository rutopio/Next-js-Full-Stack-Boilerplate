"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon, LockKeyholeIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

const loginFormSchema = z.object({
  email: z
    .email({
      message: "Invalid email",
    })
    .min(1, { message: "Email is required." }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { mutate: loginMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("result", result);

      if (!response.ok || result.success === false) {
        throw new Error(`Invalid email or password (${response.status})`);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Login successful, redirecting to dashboard...");
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation(data);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="flex min-w-lg flex-col gap-8"
        >
          <div className="text-center text-2xl font-semibold">Login</div>

          <div className="space-y-2">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer ps-9"
                        type="text"
                        placeholder="user@example.com"
                        maxLength={100}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <MailIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer ps-9"
                        type="password"
                        placeholder="Please enter your password"
                        maxLength={60}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <LockKeyholeIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-foreground/80 mt-2 flex items-center justify-center space-x-2 text-center text-sm">
            <div>Don&apos;t have an account?</div>
            <Link href="/signup">
              <span className="text-primary font-semibold hover:underline">
                Click to Sign up
              </span>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
