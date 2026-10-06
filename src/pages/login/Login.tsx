import { Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Checkbox } from "../../components/ui/checkbox";
import { CustomInput } from "../../components/customInput";
import { useEffect, useState } from "react";
import { loginSchema, signupSchema } from "../../validation/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useSignup } from "../../hook/useAuth";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const schema = isLogin ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset();
  }, [isLogin, reset]);
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const onSubmit = async (values: any) => {
    if (isLogin) {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } else {
      await signupMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    }
  };

  return (
    <section className="min-h-[calc(100vh-128px)] bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-center lg:justify-between gap-16">
        {/* Left Side */}
        <div className="hidden lg:flex flex-1 max-w-xl flex-col">
          <span className="mb-6 w-fit rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-[#2563EB]">
            Dynamic Form Builder
          </span>

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Build beautiful forms
            <br />
            without writing code.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#757681]">
            Create surveys, registrations, quizzes and workflows with an
            intuitive drag-and-drop builder. Collect responses, automate
            processes and analyze data from one place.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
              <span className="text-slate-700">Drag & Drop Form Builder</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
              <span className="text-slate-700">Conditional Logic</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
              <span className="text-slate-700">Team Collaboration</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
              <span className="text-slate-700">Analytics Dashboard</span>
            </div>
          </div>
        </div>

        {/* Login Card */}

        <Card className="w-full max-w-md rounded-2xl border border-slate-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="mt-3 text-[#757681]">
                {isLogin
                  ? "Login to your account to manage your forms."
                  : "Create your account to start building forms."}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  isLogin ? "bg-white shadow text-[#2563EB]" : "text-[#757681]"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  !isLogin ? "bg-white shadow text-[#2563EB]" : "text-[#757681]"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
              {!isLogin && (
                <CustomInput
                  label="Full Name"
                  placeholder="John Doe"
                  iconLeft={<User size={18} />}
                  {...register("name")}
                  error={errors.name?.message}
                />
              )}
              <CustomInput
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                iconLeft={<Mail size={18} />}
                {...register("email")}
                error={errors.email?.message}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>

                  {isLogin && (
                    <button
                      type="button"
                      className="text-sm text-[#2563EB] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <CustomInput
                  type="password"
                  placeholder="••••••••"
                  iconLeft={<Lock size={18} />}
                  showPasswordToggle
                  {...register("password")}
                  error={errors.password?.message}
                />

                {!isLogin && (
                  <div className="mt-2">
                    <CustomInput
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      iconLeft={<Lock size={18} />}
                      showPasswordToggle
                      {...register("confirmPassword")}
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-start gap-2">
                  <Checkbox id="remember" />

                  <label htmlFor="remember" className="text-sm text-[#757681]">
                    Remember me
                  </label>
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending || signupMutation.isPending}
                className="
    group
    h-12
    w-full
    rounded-xl
    bg-[#2563EB]
    text-white
    shadow-md
    transition-all
    duration-300
    hover:bg-[#1D4ED8]
    hover:shadow-lg
    active:scale-[0.98]
    disabled:cursor-not-allowed
    disabled:opacity-70
  "
              >
                {loginMutation.isPending || signupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {isLogin ? "Login" : "Create Account"}

                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              <Separator />

              <p className="text-center text-sm text-[#757681]">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-semibold text-[#2563EB] hover:underline"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
