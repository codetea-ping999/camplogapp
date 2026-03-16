"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApp } from "@/components/providers/app-provider";

type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn, signUp, mode: appMode } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  return (
    <Card className="w-full max-w-md p-7 md:p-8">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
          {mode === "login" ? "Welcome Back" : "Create Your Basecamp"}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
          {mode === "login" ? "Log in to CampLog" : "Sign up for CampLog"}
        </h1>
        <p className="text-sm leading-6 text-muted">
          {mode === "login"
            ? "Review past campfires, meals, and shelter setups from one place."
            : "Start capturing each trip with weather, site type, gear, and photos."}
        </p>
        {appMode === "demo" ? (
          <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent-strong">
            Demo mode is active. Try `demo@camplog.app` / `password123`.
          </div>
        ) : null}
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setSubmitting(true);
          setFormError(undefined);
          try {
            if (mode === "login") {
              await signIn(values.email, values.password);
            } else {
              await signUp(values.email, values.password, values.name);
            }
          } catch (caught) {
            setFormError(caught instanceof Error ? caught.message : "Unexpected error");
          } finally {
            setSubmitting(false);
          }
        })}
      >
        {mode === "signup" ? (
          <label className="block space-y-2">
            <span className="text-sm text-muted">Display name</span>
            <Input placeholder="Trail name" {...register("name")} />
            {errors.name ? (
              <p className="text-sm text-rose-300">{errors.name.message}</p>
            ) : null}
          </label>
        ) : null}
        <label className="block space-y-2">
          <span className="text-sm text-muted">Email</span>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? (
            <p className="text-sm text-rose-300">{errors.email.message}</p>
          ) : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Password</span>
          <Input type="password" placeholder="Minimum 6 characters" {...register("password")} />
          {errors.password ? (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          ) : null}
        </label>
        {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "Working..." : mode === "login" ? "Log In" : "Create Account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          className="font-semibold text-accent-strong transition hover:text-white"
          href={mode === "login" ? "/signup" : "/login"}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </Card>
  );
}
