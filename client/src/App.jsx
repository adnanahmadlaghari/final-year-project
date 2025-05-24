import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async() => {
      try {
        setLoading(true)
        const response = await apiClient.get(GET_USER_INFO, {withCredentials: true});
        if(response.status === 200 && response.data.id){
          useAppStore.getState().setUserInfo(response.data)
        }else{
          useAppStore.getState().setUserInfo(undefined)
        }
        // console.log({response})
      } catch (error) {
        console.log(error)
        useAppStore.getState().setUserInfo(undefined)
      }finally{
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData();
    }else{
      setLoading(false);
    }
  },[userInfo, setUserInfo])

  if(loading){
    return <div>loading...</div>
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
