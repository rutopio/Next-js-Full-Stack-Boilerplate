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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

const signUpFormSchema = z
  .object({
    email: z
      .email({
        message: "Invalid email",
      })
      .min(1, { message: "Email is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: "Password must contain at least one letter and one number.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const { mutate: signupMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData: SignUpFormValues) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.message === "email_already_exists") {
          throw new Error("This email has already been registered.");
        }
        throw new Error(result.message || "Sign up failed");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Sign up successful, redirecting to dashboard...");
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signupMutation(data);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSubmit)}
          className="flex min-w-lg flex-col gap-8"
        >
          <div className="text-center text-2xl font-semibold">Sign Up</div>

          <div className="space-y-2">
            <FormField
              control={signUpForm.control}
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
              control={signUpForm.control}
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
                  <FormDescription className="text-muted-foreground text-xs">
                    Password must be at least 8 characters, and contain numbers
                    and letters.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={signUpForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer ps-9"
                        type="password"
                        placeholder="Please enter your password again"
                        maxLength={60}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <LockKeyholeIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                  <FormDescription className="text-muted-foreground text-xs">
                    Confirm password must be the same as the password.
                  </FormDescription>
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
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Signing up...
              </>
            ) : (
              <>Sign Up</>
            )}
          </Button>
          <div className="text-foreground/80 mt-2 flex items-center justify-center space-x-2 text-center text-sm">
            <div>Already have an account?</div>
            <Link href="/login">
              <span className="text-primary font-semibold hover:underline">
                Back to Login
              </span>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
