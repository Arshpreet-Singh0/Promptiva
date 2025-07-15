"use client";

import { useAppSelector } from "@/store/hooks";
import { Button } from "../ui/button";
import Link from "next/link";

const Options = () => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);

  return (
    <>
      {isAuthenticated ? (
        <>
        <Link href="/dashboard">
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Dashboard
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/signin">
            <Button
              variant="ghost"
              className="hover:scale-105 transition-transform duration-200"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default Options;
