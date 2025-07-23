"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Users, Settings, Send, Loader2, LogOut } from "lucide-react";
import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface History {
  id: string;
  title: string;
}

interface Message {
  id: string;
  sender: "User" | "AI";
  content: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [communicationType] = useState<"email" | "call">("email");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    try {
      setLoading(true);
      setMessages((msg) => [
        ...msg,
        {
          id: Math.random().toString(),
          sender: "User",
          content: prompt,
          timestamp: new Date(),
        },
      ]);
      const res = await axiosInstance.post(
        "/service/parse",
        { prompt, sessionId },
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res.data?.message);
        if (sessionId != res?.data?.sessionId) {
          setSessionId(res?.data?.sessionId);
        }
        setMessages((msg) => [
          ...msg,
          {
            id: Math.random().toString(),
            sender: "AI",
            content: res?.data?.response,
            timestamp: new Date(),
          },
        ]);
        setPrompt("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg: string =
          error?.response?.data?.message || "Something went wrong.";
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "AI",
            content: errorMsg,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/history", {
          withCredentials: true,
        });

        if (res?.data?.success) {
          setHistory(res?.data?.sessions);
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const fecthMessages = async () => {
      if (!sessionId) return;
      try {
        setMessageLoading(true);
        const res = await axiosInstance.get(`/history/${sessionId}`, {
          withCredentials: true,
        });

        if (res?.data?.success) {
          setMessages(res?.data?.messages);
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setMessageLoading(false);
      }
    };
    fecthMessages();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const changeSessionId = (id: string) => {
    if (sessionId != id) {
      setSessionId(id);
    }
  };

  console.log(messages);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">Promptiva</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/add-people">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add People
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 ">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contacts Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between py-2">
                  Your history
                </CardTitle>
                <CardDescription>People you communicate with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {historyLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </>
                ) : history.length > 0 ? (
                  history.map((item, idx) => (
                    <button
                      onClick={() => changeSessionId(item.id)}
                      key={idx}
                      className={`text-sm text-gray-800 ${sessionId == item.id ? "bg-gray-200" : "bg-gray-50"} hover:bg-gray-200 transition-colors duration-200 px-4 py-1 shadow-sm cursor-pointer w-full text-start`}
                    >
                      {item.title}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No history found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Prompt Panel */}
          <div className="lg:col-span-2 h-[80vh] ">
            <Card className="h-full flex justify-between">
              <CardHeader>
                <CardTitle>Create Your Message</CardTitle>
                <CardDescription>
                  Describe what and whom you want to communicate, and AI will
                  handle the rest
                </CardDescription>
              </CardHeader>
              {/* 🟡 Message History Section */}
              <div className="px-6 pb-4 flex-1 overflow-y-auto space-y-3">
                {messageLoading ? (
                  // Show 3 skeleton bubbles while loading
                  <>
                    <div className="w-3/4 bg-gray-200 rounded-lg h-6 animate-pulse mr-auto"></div>
                    <div className="w-2/3 bg-blue-200 rounded-lg h-6 animate-pulse ml-auto"></div>
                    <div className="w-1/2 bg-gray-200 rounded-lg h-6 animate-pulse mr-auto"></div>
                  </>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No messages yet.
                  </p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[80%] px-4 py-3 rounded-lg shadow text-sm whitespace-pre-wrap ${
                        msg.sender === "User"
                          ? "ml-auto bg-blue-100 text-blue-900"
                          : "mr-auto bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Prompt</label>
                  <Textarea
                    placeholder={`Describe what you want to ${communicationType === "email" ? "write" : "say"}. For example: "Send a follow-up about our meeting yesterday and ask about the project timeline to Arsh Somal"`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!prompt.trim() || loading}
                  className="w-full flex justify-center items-center"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Sending..." : "Send"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
