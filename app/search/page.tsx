"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const services = ["Haircut", "Coloring", "Styling", "Treatment", "Beard Trim", "Facial", "Massage", "Shave"];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [openNow, setOpenNow] = useState(false);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch('/api/salons');
        if (!res.ok) throw new Error('Failed to fetch salons');
        const data = await res.json();
        setSalons(data);
      } catch (err) {
        setError('Error fetching salons');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.services?.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesServices = selectedServices.length === 0 ||
        selectedServices.some(service => salon.services?.includes(service));
    const matchesOpenNow = !openNow || salon.openNow;

    return matchesSearch && matchesServices && matchesOpenNow;
  });

  const sortedSalons = [...filteredSalons].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return parseFloat(a.distance) - parseFloat(b.distance);
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  const FilterContent = () => (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <div className="space-y-2">
            {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices([...selectedServices, service]);
                        } else {
                          setSelectedServices(selectedServices.filter(s => s !== service));
                        }
                      }}
                  />
                  <label htmlFor={service} className="text-sm">{service}</label>
                </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">Under ₹500</SelectItem>
              <SelectItem value="mid">₹500 - ₹1000</SelectItem>
              <SelectItem value="premium">Above ₹1000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
              id="openNow"
              checked={openNow}
              onCheckedChange={setOpenNow}
          />
          <label htmlFor="openNow" className="text-sm">Open Now</label>
        </div>
      </div>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SalonBook</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/customer/bookings" className="text-gray-600 hover:text-primary">My Bookings</Link>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary">Login</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
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
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                />
              </div>
              <Button className="w-full">Search</Button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="hidden lg:block w-80 bg-white rounded-lg border p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedServices([]);
                  setPriceRange("all");
                  setOpenNow(false);
                }}>
                  Clear All
                </Button>
              </div>
              <FilterContent />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{sortedSalons.length} salons found</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="space-y-6">
                {sortedSalons.map((salon) => (
                    <Card key={salon._id || salon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-80">
                          <img
                              src={salon.image || "/placeholder.svg"}
                              alt={salon.name}
                              className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{salon.name}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{salon.location}</span>
                                <span className="mx-2">•</span>
                                <span className="text-sm">{salon.distance}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{salon.rating}</span>
                                <span className="text-gray-600 text-sm">({salon.reviews})</span>
                              </div>
                              <div className="text-sm text-gray-600">{salon.price}</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {salon.services?.map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${salon.openNow ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm text-gray-600">
                              {salon.openNow ? 'Open Now' : 'Closed'}
                            </span>
                              </div>
                              <span className="text-sm text-gray-600">
                            Next: {salon.nextSlot}
                          </span>
                            </div>
                            <Link href={`/salon/${salon._id || salon.id}`}>
                              <Button>View Details</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}