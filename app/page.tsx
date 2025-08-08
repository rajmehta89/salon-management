"use client"

import { useState } from "react"
import { Search, MapPin, Star, Clock, Users } from 'lucide-react'
import { Button } from "@/ui/button";
import { Input } from "@/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Badge } from "@/ui/badge"

import Link from "next/link"

// Mock data
const featuredSalons = [
  {
    id: 1,
    name: "Elite Hair Studio",
    location: "Downtown, City Center",
    rating: 4.8,
    reviews: 156,
    image: "/modern-hair-salon.png",
    services: ["Haircut", "Coloring", "Styling"],
    price: "₹500-2000",
    distance: "0.5 km"
  },
  {
    id: 2,
    name: "Glamour Lounge",
    location: "Mall Road, Sector 15",
    rating: 4.6,
    reviews: 89,
    image: "/luxury-salon-interior.png",
    services: ["Haircut", "Beard Trim", "Facial"],
    price: "₹300-1500",
    distance: "1.2 km"
  },
  {
    id: 3,
    name: "Style Central",
    location: "Park Street, Block A",
    rating: 4.7,
    reviews: 203,
    image: "/trendy-hair-salon.png",
    services: ["Haircut", "Coloring", "Treatment"],
    price: "₹400-1800",
    distance: "2.1 km"
  }
]

const popularServices = [
  { name: "Haircut", icon: "✂️" },
  { name: "Hair Coloring", icon: "🎨" },
  { name: "Beard Trim", icon: "🧔" },
  { name: "Hair Styling", icon: "💇" },
  { name: "Hair Treatment", icon: "🧴" },
  { name: "Facial", icon: "✨" }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">SalonBook</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="text-gray-600 hover:text-primary">Find Salons</Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-primary">Login</Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Book Your Perfect
            <span className="text-primary"> Salon Experience</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and book appointments at the best hair salons near you. 
            Professional stylists, convenient booking, amazing results.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search salons or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Enter location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Link href="/search">
                <Button className="w-full h-10">
                  Search Salons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold">{service.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Salons Near You</h2>
            <Link href="/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSalons.map((salon) => (
              <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={salon.image || "/placeholder.svg"}
                    alt={salon.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-white text-gray-800">
                    {salon.distance}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{salon.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{salon.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{salon.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {salon.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{salon.price}</span>
                    <Link href={`/salon/${salon.id}`}>
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Search & Discover</h3>
              <p className="text-gray-600">Find the perfect salon near you based on location, services, and reviews.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Book Appointment</h3>
              <p className="text-gray-600">Choose your preferred service, stylist, and time slot that works for you.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Enjoy Service</h3>
              <p className="text-gray-600">Relax and enjoy professional service from experienced stylists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SalonBook</span>
              </div>
              <p className="text-gray-400">Your trusted partner for salon bookings and beauty services.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search">Find Salons</Link></li>
                <li><Link href="/auth/login">Login</Link></li>
                <li><Link href="/auth/register">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Salon Owners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/salon-owner/register">Register Salon</Link></li>
                <li><Link href="/salon-owner/login">Salon Login</Link></li>
                <li><Link href="/salon-owner/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SalonBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
