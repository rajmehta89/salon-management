"use client"

import { useState } from "react"
import { Users, Building, Calendar, DollarSign, Eye, Edit, Trash2, Ban, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Mock admin data
const adminStats = {
  totalUsers: 1250,
  totalSalons: 89,
  totalBookings: 3456,
  totalRevenue: "₹12,45,600"
}

const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    type: "customer",
    joinDate: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    name: "Sarah's Salon",
    email: "sarah@salon.com",
    type: "salon",
    joinDate: "2024-01-14",
    status: "pending"
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@email.com",
    type: "customer",
    joinDate: "2024-01-13",
    status: "active"
  }
]

const salonRequests = [
  {
    id: 1,
    salonName: "Elite Hair Studio",
    ownerName: "Sarah Johnson",
    email: "sarah@elitehair.com",
    location: "Downtown, City Center",
    requestDate: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    salonName: "Urban Cuts",
    ownerName: "Mike Chen",
    email: "mike@urbancuts.com",
    location: "Tech Park, Phase 2",
    requestDate: "2024-01-14",
    status: "approved"
  }
]

const allSalons = [
  {
    id: 1,
    name: "Elite Hair Studio",
    owner: "Sarah Johnson",
    location: "Downtown, City Center",
    rating: 4.8,
    bookings: 156,
    revenue: "₹45,600",
    status: "active"
  },
  {
    id: 2,
    name: "Glamour Lounge",
    owner: "Emma Davis",
    location: "Mall Road, Sector 15",
    rating: 4.6,
    bookings: 89,
    revenue: "₹32,400",
    status: "active"
  },
  {
    id: 3,
    name: "Style Central",
    owner: "Alex Brown",
    location: "Park Street, Block A",
    rating: 4.7,
    bookings: 203,
    revenue: "₹67,800",
    status: "suspended"
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleApproveRequest = (id: number) => {
    console.log("Approving salon request:", id)
    // Mock approval logic
  }

  const handleRejectRequest = (id: number) => {
    console.log("Rejecting salon request:", id)
    // Mock rejection logic
  }

  const handleSuspendSalon = (id: number) => {
    console.log("Suspending salon:", id)
    // Mock suspension logic
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
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Salons</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalSalons}</div>
              <p className="text-xs text-muted-foreground">5 pending approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Commission earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="salons">Salons</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                  <CardDescription>Latest users who joined the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.type === "salon" ? "default" : "secondary"}>
                            {user.type}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{user.joinDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Salon Requests</CardTitle>
                  <CardDescription>Salons waiting for approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salonRequests.filter(req => req.status === "pending").map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{request.salonName}</h4>
                            <p className="text-sm text-gray-600">{request.ownerName}</p>
                            <p className="text-sm text-gray-600">{request.location}</p>
                          </div>
                          <Badge variant="outline">{request.status}</Badge>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="salons" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Salons</CardTitle>
                  <CardDescription>Manage registered salons</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search salons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salon Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSalons.map((salon) => (
                      <TableRow key={salon.id}>
                        <TableCell className="font-medium">{salon.name}</TableCell>
                        <TableCell>{salon.owner}</TableCell>
                        <TableCell>{salon.location}</TableCell>
                        <TableCell>{salon.rating}</TableCell>
                        <TableCell>{salon.bookings}</TableCell>
                        <TableCell>{salon.revenue}</TableCell>
                        <TableCell>
                          <Badge variant={salon.status === "active" ? "default" : "destructive"}>
                            {salon.status}
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSuspendSalon(salon.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.type === "salon" ? "default" : "secondary"}>
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "outline"}>
                            {user.status}
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
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Salon Registration Requests</CardTitle>
                <CardDescription>Review and approve new salon registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salon Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salonRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.salonName}</TableCell>
                        <TableCell>{request.ownerName}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === "approved" ? "default" : "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" ? (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
