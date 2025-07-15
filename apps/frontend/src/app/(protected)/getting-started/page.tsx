"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { axiosInstance } from "@/config/axios";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function GettingStartedPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const addContact = async () => {
    if (!currentContact.name) {
      toast.error("Name is Required");
      return;
    }
    if (!currentContact.phone && !currentContact.email) {
      toast.error("Email or Phone is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/person", currentContact);

      if (res?.data?.success) {
        setContacts((prev) => [...prev, res?.data?.person]);
        setCurrentContact({ name: "", email: "", phone: "" });
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/person/${id}`);

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleFinish = () => {
    // Save contacts and redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">Promptiva</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {"Let's get you started!"}
          </h1>
          <p className="text-gray-600">
            Add some people you frequently communicate with
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Known People</CardTitle>
            <CardDescription>
              Add contacts with their name and either email or phone number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={currentContact.name}
                onChange={(e) =>
                  setCurrentContact((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={currentContact.email}
                  onChange={(e) =>
                    setCurrentContact((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={currentContact.phone}
                  onChange={(e) =>
                    setCurrentContact((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <Button
              onClick={addContact}
              className="w-full flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {loading ? "Adding Contact..." : "Add Contact"}
            </Button>
          </CardContent>
        </Card>

        {contacts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Contacts ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600 space-x-2">
                        {contact.email && (
                          <Badge variant="secondary">{contact.email}</Badge>
                        )}
                        {contact.phone && (
                          <Badge variant="outline">{contact.phone}</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(contact.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Skip for now
          </Button>
          <Button onClick={handleFinish} disabled={contacts.length === 0}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
