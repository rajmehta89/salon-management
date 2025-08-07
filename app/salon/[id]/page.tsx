"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Phone, Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock salon data
const salonData = {
  id: 1,
  name: "Elite Hair Studio",
  location: "123 Downtown Street, City Center",
  rating: 4.8,
  reviews: 156,
  phone: "+1 234-567-8900",
  images: [
    "/modern-hair-salon.png",
    "/placeholder-poi05.png",
    "/salon-reception.png"
  ],
  description: "Elite Hair Studio is a premium salon offering cutting-edge hair services in a luxurious environment. Our experienced stylists are trained in the latest techniques and trends.",
  amenities: ["WiFi", "AC", "Parking", "Card Payment", "Sanitized"],
  workingHours: {
    monday: "9:00 AM - 8:00 PM",
    tuesday: "9:00 AM - 8:00 PM",
    wednesday: "9:00 AM - 8:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 9:00 PM",
    saturday: "8:00 AM - 9:00 PM",
    sunday: "10:00 AM - 6:00 PM"
  },
  staff: [
    {
      id: 1,
      name: "Sarah Johnson",
      speciality: "Hair Coloring & Styling",
      experience: "8 years",
      rating: 4.9,
      image: "/female-hair-stylist.png"
    },
    {
      id: 2,
      name: "Mike Chen",
      speciality: "Men's Cuts & Beard Styling",
      experience: "6 years",
      rating: 4.7,
      image: "/male-barber.png"
    },
    {
      id: 3,
      name: "Emma Davis",
      speciality: "Hair Treatment & Care",
      experience: "10 years",
      rating: 4.8,
      image: "/female-hair-specialist.png"
    }
  ],
  services: [
    { name: "Men's Haircut", price: "₹500", duration: "30 min" },
    { name: "Women's Haircut", price: "₹800", duration: "45 min" },
    { name: "Hair Coloring", price: "₹1500", duration: "120 min" },
    { name: "Hair Styling", price: "₹600", duration: "45 min" },
    { name: "Hair Treatment", price: "₹1200", duration: "90 min" },
    { name: "Beard Trim", price: "₹300", duration: "20 min" }
  ],
  reviews: [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Excellent service! Sarah did an amazing job with my hair color.",
      date: "2 days ago",
      service: "Hair Coloring"
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      comment: "Great atmosphere and professional staff. Will definitely come back.",
      date: "1 week ago",
      service: "Women's Haircut"
    }
  ]
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
]

export default function SalonDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedService, setSelectedService] = useState("")
  const [selectedStaff, setSelectedStaff] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const router = useRouter()

  const handleBooking = () => {
    if (selectedService && selectedStaff && selectedDate && selectedTime) {
      // Mock booking logic
      alert("Booking confirmed! You will receive a confirmation email shortly.")
      setBookingDialogOpen(false)
      router.push("/customer/bookings")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SalonBook</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/customer/bookings" className="text-gray-600 hover:text-primary">My Bookings</Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-primary">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Salon Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={salonData.images[selectedImage] || "/placeholder.svg"}
                alt={salonData.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {salonData.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${salonData.name} ${index + 1}`}
                  className={`h-24 object-cover rounded cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Salon Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{salonData.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{salonData.rating}</span>
                    <span className="ml-1">({salonData.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{salonData.location}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{salonData.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {salonData.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{salonData.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Open until 8:00 PM</span>
              </div>
            </div>

            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Book Your Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Service</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {salonData.services.map((service, index) => (
                          <SelectItem key={index} value={service.name}>
                            {service.name} - {service.price} ({service.duration})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Staff</label>
                    <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a stylist" />
                      </SelectTrigger>
                      <SelectContent>
                        {salonData.staff.map((staff) => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name} - {staff.speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleBooking} 
                    className="w-full"
                    disabled={!selectedService || !selectedStaff || !selectedDate || !selectedTime}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Our Team</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {salonData.services.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{service.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salonData.staff.map((staff) => (
                <Card key={staff.id}>
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={staff.image || "/placeholder.svg"} alt={staff.name} />
                      <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold mb-1">{staff.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{staff.speciality}</p>
                    <p className="text-sm text-gray-500 mb-2">{staff.experience} experience</p>
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{staff.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {salonData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.service} • {review.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hours" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(salonData.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
