"use client";

import { axiosInstance } from "@/config/axios";
import { useAppDispatch } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/authSlice";
import { useEffect } from "react";

const VerifyUser = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get("/auth/verify");

        if (res?.data.success) {
          dispatch(setUser(res?.data?.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };

    verify();
  }, [dispatch]);

  return null; // no UI
};

export default VerifyUser;
