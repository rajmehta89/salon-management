"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Star, Phone, User } from 'lucide-react'
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import Link from "next/link"

// Mock customer data
const customerBookings = [
  {
    id: 1,
    salonName: "Elite Hair Studio",
    service: "Hair Coloring",
    staff: "Sarah Johnson",
    date: "2024-01-15",
    time: "2:30 PM",
    status: "confirmed",
    price: "₹1500",
    address: "123 Downtown Street, City Center",
    phone: "+1 234-567-8900"
  },
  {
    id: 2,
    salonName: "Glamour Lounge",
    service: "Haircut",
    staff: "Mike Chen",
    date: "2024-01-10",
    time: "3:00 PM",
    status: "completed",
    price: "₹800",
    address: "Mall Road, Sector 15",
    phone: "+1 234-567-8901"
  },
  {
    id: 3,
    salonName: "Style Central",
    service: "Hair Treatment",
    staff: "Emma Davis",
    date: "2024-01-20",
    time: "11:00 AM",
    status: "pending",
    price: "₹1200",
    address: "Park Street, Block A",
    phone: "+1 234-567-8902"
  }
]

const favoritesSalons = [
  {
    id: 1,
    name: "Elite Hair Studio",
    rating: 4.8,
    location: "Downtown, City Center",
    image: "/modern-hair-salon.png"
  },
  {
    id: 2,
    name: "Glamour Lounge",
    rating: 4.6,
    location: "Mall Road, Sector 15",
    image: "/placeholder-siny3.png"
  }
]

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "completed":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SalonBook</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-lg font-semibold">My Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="outline" size="sm">Find Salons</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your bookings and discover new salons</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Salons</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,400</div>
              <p className="text-xs text-muted-foreground">With offers & discounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="space-y-6">
              {customerBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{booking.salonName}</h3>
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{booking.service} with {booking.staff}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {booking.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {booking.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary mb-2">
                          {booking.price}
                        </div>
                        <div className="flex space-x-2">
                          {booking.status === "confirmed" && (
                            <>
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                          )}
                          {booking.status === "pending" && (
                            <Button size="sm">
                              Confirm
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesSalons.map((salon) => (
                <Card key={salon.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={salon.image || "/placeholder.svg"}
                      alt={salon.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{salon.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{salon.location}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/salon/${salon.id}`} className="flex-1">
                        <Button size="sm" className="w-full">Book Now</Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/user-profile-illustration.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">John Doe</h3>
                    <p className="text-gray-600">john.doe@email.com</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="John Doe"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input 
                      type="email" 
                      defaultValue="john.doe@email.com"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue="+1 234-567-8900"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date of Birth</label>
                    <input 
                      type="date" 
                      defaultValue="1990-01-01"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
