"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Clock, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SalonOwnerDashboard() {
  // State for all data
  const [salonStats, setSalonStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: "₹0",
    monthlyRevenue: "₹0"
  })
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [services, setServices] = useState([])
  const [salonProfile, setSalonProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    location: ""
  })

  // Loading states
  const [loading, setLoading] = useState({
    stats: true,
    bookings: true,
    staff: true,
    services: true,
    profile: true
  })

  // Dialog states
  const [staffDialogOpen, setStaffDialogOpen] = useState(false)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)

  // Form states
  const [newStaff, setNewStaff] = useState({
    name: "",
    speciality: "",
    phone: "",
    email: "",
    status: "active"
  })
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    category: "",
    availableStaff: []
  })

  // Get salon ID from localStorage or context (you might need to adjust this)
  const getSalonId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('salonId') || '67890abcdef1234567890123' // Replace with actual salon ID
    }
    return '67890abcdef1234567890123'
  }

  // Fetch salon statistics
  const fetchSalonStats = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/salon/stats?salonId=${salonId}`)

      if (!response.ok) {
        console.warn('Stats API not available, using default values')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setSalonStats(data)
      } else {
        console.warn('Stats API returned non-JSON response')
      }
    } catch (error) {
      console.error('Error fetching salon stats:', error)
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  // Fetch upcoming bookings
  const fetchBookings = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/bookings?salonId=${salonId}&status=upcoming`)

      if (!response.ok) {
        console.warn('Bookings API not available, using empty array')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setUpcomingBookings(Array.isArray(data) ? data : [])
      } else {
        console.warn('Bookings API returned non-JSON response')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setUpcomingBookings([])
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }))
    }
  }

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/staff?salonId=${salonId}`)

      if (!response.ok) {
        console.warn('Staff API not available, using empty array')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setStaffMembers(Array.isArray(data) ? data : [])
      } else {
        console.warn('Staff API returned non-JSON response')
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
      setStaffMembers([])
    } finally {
      setLoading(prev => ({ ...prev, staff: false }))
    }
  }

  // Fetch services
  const fetchServices = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/services?salonId=${salonId}`)

      if (!response.ok) {
        console.warn('Services API not available, using empty array')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setServices(Array.isArray(data) ? data : [])
      } else {
        console.warn('Services API returned non-JSON response')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  // Fetch salon profile
  const fetchSalonProfile = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/salon/${salonId}`)

      if (!response.ok) {
        console.warn('Salon profile API not available, using default values')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setSalonProfile({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          description: data.description || "",
          location: data.location || ""
        })
      } else {
        console.warn('Salon profile API returned non-JSON response')
      }
    } catch (error) {
      console.error('Error fetching salon profile:', error)
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
    }
  }

  // Add new staff member
  const handleAddStaff = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStaff,
          salonId
        }),
      })

      if (!response.ok) {
        alert('Failed to add staff member. Please check if the API is available.')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const newStaffMember = await response.json()
        setStaffMembers(prev => [...prev, newStaffMember])
        setStaffDialogOpen(false)
        setNewStaff({ name: "", speciality: "", phone: "", email: "", status: "active" })
        alert('Staff member added successfully!')
      } else {
        alert('Unexpected response format from server')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      alert('Failed to add staff member. Please try again.')
    }
  }

  // Add new service
  const handleAddService = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          salonId,
          isActive: true,
          price: parseFloat(newService.price) || 0,
          duration: parseInt(newService.duration) || 30
        }),
      })

      if (!response.ok) {
        alert('Failed to add service. Please check if the API is available.')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const newServiceItem = await response.json()
        setServices(prev => [...prev, newServiceItem])
        setServiceDialogOpen(false)
        setNewService({ name: "", price: "", duration: "", description: "", category: "", availableStaff: [] })
        alert('Service added successfully!')
      } else {
        alert('Unexpected response format from server')
      }
    } catch (error) {
      console.error('Error adding service:', error)
      alert('Failed to add service. Please try again.')
    }
  }

  // Update salon profile
  const handleUpdateProfile = async () => {
    try {
      const salonId = getSalonId()
      const response = await fetch(`/api/salon/${salonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salonProfile),
      })

      if (!response.ok) {
        alert('Failed to update profile. Please check if the API is available.')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        alert('Profile updated successfully!')
      } else {
        alert('Profile may have been updated, but received unexpected response format')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  // Delete staff member
  const handleDeleteStaff = async (staffId) => {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return
    }

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('Failed to delete staff member. Please check if the API is available.')
        return
      }

      setStaffMembers(prev => prev.filter(staff => staff._id !== staffId))
      alert('Staff member deleted successfully!')
    } catch (error) {
      console.error('Error deleting staff:', error)
      alert('Failed to delete staff member. Please try again.')
    }
  }

  // Delete service
  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('Failed to delete service. Please check if the API is available.')
        return
      }

      setServices(prev => prev.filter(service => service._id !== serviceId))
      alert('Service deleted successfully!')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service. Please try again.')
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString()
    }
  }

  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    if (timeSlot && timeSlot.start && timeSlot.end) {
      return `${timeSlot.start} - ${timeSlot.end}`
    }
    return 'Time not set'
  }

  // Fetch all data on component mount
  useEffect(() => {
    fetchSalonStats()
    fetchBookings()
    fetchStaff()
    fetchServices()
    fetchSalonProfile()
  }, [])

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
                <span className="text-lg font-semibold">Salon Owner Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Logout</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading.stats ? "Loading..." : salonStats.totalBookings}
                </div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading.stats ? "Loading..." : salonStats.todayBookings}
                </div>
                <p className="text-xs text-muted-foreground">3 pending confirmations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading.stats ? "Loading..." : salonStats.monthlyRevenue}
                </div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading.stats ? "Loading..." : salonStats.totalRevenue}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="profile">Salon Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Manage your salon appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.bookings ? (
                      <div className="text-center py-4">Loading bookings...</div>
                  ) : upcomingBookings.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No upcoming bookings found.</div>
                  ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingBookings.map((booking) => (
                              <TableRow key={booking._id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {booking.customerName || booking.customerId?.name || 'Unknown Customer'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {booking.customerPhone || booking.customerId?.phone || 'No phone'}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{booking.serviceId?.name || booking.service || 'Unknown Service'}</TableCell>
                                <TableCell>{booking.staffId?.name || booking.staff || 'Unknown Staff'}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{formatDate(booking.bookingDate)}</div>
                                    <div className="text-sm text-gray-600">{formatTimeSlot(booking.timeSlot)}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                                    {booking.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>Manage your salon team</CardDescription>
                  </div>
                  <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="staffName">Name</Label>
                          <Input
                              id="staffName"
                              value={newStaff.name}
                              onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                              placeholder="Enter staff name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="speciality">Speciality</Label>
                          <Input
                              id="speciality"
                              value={newStaff.speciality}
                              onChange={(e) => setNewStaff({...newStaff, speciality: e.target.value})}
                              placeholder="e.g., Hair Coloring & Styling"
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffPhone">Phone</Label>
                          <Input
                              id="staffPhone"
                              value={newStaff.phone}
                              onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                              placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffEmail">Email</Label>
                          <Input
                              id="staffEmail"
                              type="email"
                              value={newStaff.email}
                              onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                              placeholder="Enter email address"
                          />
                        </div>
                        <Button onClick={handleAddStaff} className="w-full">
                          Add Staff Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading.staff ? (
                      <div className="text-center py-4">Loading staff...</div>
                  ) : staffMembers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No staff members found. Add your first staff member.</div>
                  ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Speciality</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {staffMembers.map((staff) => (
                              <TableRow key={staff._id}>
                                <TableCell className="font-medium">{staff.name}</TableCell>
                                <TableCell>{staff.speciality}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{staff.phone}</div>
                                    <div className="text-sm text-gray-600">{staff.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                                    {staff.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteStaff(staff._id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>Manage your salon services and pricing</CardDescription>
                  </div>
                  <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input
                              id="serviceName"
                              value={newService.name}
                              onChange={(e) => setNewService({...newService, name: e.target.value})}
                              placeholder="e.g., Men's Haircut"
                          />
                        </div>
                        <div>
                          <Label htmlFor="servicePrice">Price (₹)</Label>
                          <Input
                              id="servicePrice"
                              type="number"
                              value={newService.price}
                              onChange={(e) => setNewService({...newService, price: e.target.value})}
                              placeholder="e.g., 500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                          <Input
                              id="serviceDuration"
                              type="number"
                              value={newService.duration}
                              onChange={(e) => setNewService({...newService, duration: e.target.value})}
                              placeholder="e.g., 30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Textarea
                              id="serviceDescription"
                              value={newService.description}
                              onChange={(e) => setNewService({...newService, description: e.target.value})}
                              placeholder="Service description"
                              rows={3}
                          />
                        </div>
                        <Button onClick={handleAddService} className="w-full">
                          Add Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading.services ? (
                      <div className="text-center py-4">Loading services...</div>
                  ) : services.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No services found. Add your first service.</div>
                  ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Available Staff</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {services.map((service) => (
                              <TableRow key={service._id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell>₹{service.price}</TableCell>
                                <TableCell>{service.duration} min</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {service.availableStaff?.map((staff, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {staff.name}
                                        </Badge>
                                    )) || <span className="text-gray-500 text-sm">No staff assigned</span>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteService(service._id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Salon Profile</CardTitle>
                  <CardDescription>Update your salon information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading.profile ? (
                      <div className="text-center py-4">Loading profile...</div>
                  ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="salonName">Salon Name</Label>
                              <Input
                                  id="salonName"
                                  value={salonProfile.name}
                                  onChange={(e) => setSalonProfile({...salonProfile, name: e.target.value})}
                                  placeholder="Enter salon name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="salonPhone">Phone Number</Label>
                              <Input
                                  id="salonPhone"
                                  value={salonProfile.phone}
                                  onChange={(e) => setSalonProfile({...salonProfile, phone: e.target.value})}
                                  placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="salonEmail">Email</Label>
                              <Input
                                  id="salonEmail"
                                  type="email"
                                  value={salonProfile.email}
                                  onChange={(e) => setSalonProfile({...salonProfile, email: e.target.value})}
                                  placeholder="Enter email address"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="salonAddress">Address</Label>
                              <Textarea
                                  id="salonAddress"
                                  value={salonProfile.address}
                                  onChange={(e) => setSalonProfile({...salonProfile, address: e.target.value})}
                                  placeholder="Enter salon address"
                                  rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="salonDescription">Description</Label>
                              <Textarea
                                  id="salonDescription"
                                  value={salonProfile.description}
                                  onChange={(e) => setSalonProfile({...salonProfile, description: e.target.value})}
                                  placeholder="Enter salon description"
                                  rows={3}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        </div>
                      </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
