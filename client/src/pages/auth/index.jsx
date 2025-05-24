import React, { useState } from "react";
import victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const {setUserInfo} = useAppStore();
  const navigate = useNavigate()
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    } else if (password.length < 5) {
      toast.error("Passowrd at least 5 charactor");
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passowrd and must match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (validate()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if(response.status === 201){
          useAppStore.getState().setUserInfo(response.data.user);
          navigate("/profile")
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    } else if (!password.length) {
      toast.error("Passowrd is required");
      return false;
    }
    return true;
  }

  const handleLogin = async() => {
    if(validateLogin()){
      setLoading(true)
      try {
        const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials: true})
        if(response.data.user.id){
          useAppStore.getState().setUserInfo(response.data.user);
          if(response.data.user.profileSetup)navigate("/chat");
            else navigate("/profile")
        }
        // console.log(response)
      } catch (error) {
        console.log(error)
          toast.error(error.message)
      }finally{
        setLoading(false)
      }
    }
  }
  return (
    <div className="h-[100vh] w=[100vw] flex justify-center items-center">
      <div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex items-center justify-center">
              <h1 className="text-6xl md:text-6xl font-bold">Welcome</h1>
            </div>
            <p className="font-medium text-center">
              fill the details to get started with whats'up
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue={"login"}>
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  value={email}
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                  className="rounded-full"
                />
                <Input
                  value={password}
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                  className="rounded-full"
                />
                <Button className="rounded-full p-6 cursor-pointer" disabled={loading} onClick={handleLogin}>
                  {loading ? "login..." : "Login"}
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="register">
                <Input
                  value={email}
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                  className="rounded-full"
                />
                <Input
                  value={password}
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                  className="rounded-full"
                />
                <Input
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  type="password"
                  onChange={(e) => setconfirmPassword(e.target.value)}
                  className="rounded-full"
                />
                <Button
                  className="rounded-full p-6 cursor-pointer"
                  onClick={handleRegister}
                >
                  {loading ? "Creating an Account" : "Register"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <h1 className="text-6xl md:text-6xl font-bold">What's Up</h1>
        </div>
      </div>
    </div>
  );
};

export default Auth;
