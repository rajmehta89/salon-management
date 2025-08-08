"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
import { Textarea } from "@/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [userType, setUserType] = useState("customer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    salonName: "",
    address: "",
    description: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType, ...formData }),
      })

      const data = await response.json()
        localStorage.setItem('salonId', data.salonId)
        
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setSuccess("Registration successful!")
      setTimeout(() => {
        if (userType === "customer") {
          router.push("/customer/dashboard")
        } else {
          router.push("/salon-owner/dashboard")
        }
      }, 1500)
    } catch (err: any) {
      setError(err.message || "An error occurred during registration")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join SalonBook today</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            <Tabs value={userType} onValueChange={setUserType} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="salon">Salon Owner</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{userType === "salon" ? "Owner Name" : "Full Name"}</Label>
                <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                />
              </div>

              {userType === "salon" && (
                  <div className="space-y-2">
                    <Label htmlFor="salonName">Salon Name</Label>
                    <Input
                        id="salonName"
                        placeholder="Enter salon name"
                        value={formData.salonName}
                        onChange={(e) => handleInputChange("salonName", e.target.value)}
                        required
                    />
                  </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                />
              </div>

              {userType === "salon" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Salon Address</Label>
                      <Textarea
                          id="address"
                          placeholder="Enter complete address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Salon Description</Label>
                      <Textarea
                          id="description"
                          placeholder="Describe your salon"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                      />
                    </div>
                  </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}