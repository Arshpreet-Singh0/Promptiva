"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Zap, Plus, X, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { axiosInstance } from "@/config/axios";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function AddPeoplePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);

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
      setLoading1(true);
      const res = await axiosInstance.post("/person", currentContact, {
        withCredentials : true
      });

      if (res?.data?.success) {
        setContacts((prev) => [...prev, res?.data?.person]);
        setCurrentContact({ name: "", email: "", phone: "" });
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axiosInstance.get("/person");

        if (res.data?.success) {
          setContacts(res?.data?.people);
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold">Promptiva</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Your Contacts</h1>
          <p className="text-gray-600">
            Add and manage people you communicate with
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Contact</CardTitle>
              <CardDescription>
                Add a person with their name and contact information
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
              <Button
                onClick={addContact}
                className="w-full flex justify-center items-center"
                disabled={loading}
              >
                {loading1 ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {loading1 ? "Adding Contact..." : "Add Contact"}
              </Button>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Contacts ({contacts.length})</CardTitle>
              <CardDescription>Manage your existing contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600 space-x-2 mt-1">
                        {contact.email && (
                          <Badge variant="secondary" className="text-xs">
                            {contact.email}
                          </Badge>
                        )}
                        {contact.phone && (
                          <Badge variant="outline" className="text-xs">
                            {contact.phone}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(contact.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {!loading && contacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500"></div>
                )}
                {loading && (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
