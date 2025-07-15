"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Users, Settings, Send, Loader2 } from "lucide-react"
import { axiosInstance } from "@/config/axios"
import { toast } from "sonner"
import { handleAxiosError } from "@/utils/handleAxiosError"

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
}

export default function DashboardPage() {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [communicationType, setCommunicationType] = useState<"email" | "call">("email");
  const [loading, setLoading] = useState(false);


  const handleSend = async() => {
    try {
        setLoading(true);
        const res = await axiosInstance.post('/service/parse', {prompt});

        if(res?.data?.success){
            toast.success(res.data?.message);
            setPrompt("");
        }
    } catch (error) {
        handleAxiosError(error);
    }finally{
        setLoading(false);
    }
  }

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
              </CardContent>
            </Card>
          </div>

          {/* Main Prompt Panel */}
          <div className="lg:col-span-2 h-[60vh] ">
            <Card className="h-full flex justify-between">
              <CardHeader>
                <CardTitle>Create Your Message</CardTitle>
                <CardDescription>Describe what and whom you want to communicate, and AI will handle the rest</CardDescription>
              </CardHeader>
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
                  {loading ? <Loader2 className="animate-spin"/> : <Send className="h-4 w-4 mr-2" />}
                  {loading ? "Sending..." : "Send"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
