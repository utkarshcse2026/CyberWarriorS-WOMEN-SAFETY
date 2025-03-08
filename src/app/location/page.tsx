'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, UserPlus, AlertTriangle, Search } from "lucide-react"
import Papa from 'papaparse'
import { db } from '../../lib/firebase'
import { collection, addDoc, getDocs } from "firebase/firestore"

interface Contact {
  id: string
  name: string
  mobile: string
  isEmergency: boolean
}

const handleSOS = async () => {
  console.log("handleSOS called"); // Log the call
  if (location) {
    const mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    console.log(`SOS: User's location: ${mapLink}`);

    try {
      console.log("Attempting to save SOS request to Firestore"); // Log before saving
      await addDoc(collection(db, 'sosRequests'), {
        // name: userName,  // Make sure userName and userEmail are defined
        // email: userEmail,
        location: mapLink,
        timestamp: new Date(),
      });
      console.log("SOS request saved to Firestore successfully.");
    } catch (error) {
      console.error("Error saving SOS request to Firestore:", error);
      setError("Failed to save SOS request.");
    }
  } else {
    console.log("Location not available for SOS");
  }
};


const LocationPage: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'isEmergency'>>({ name: '', mobile: '' })
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isContactListOpen, setIsContactListOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'emergencyContacts'))
        const fetchedContacts: Contact[] = []
  
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          
          if (data.contacts && Array.isArray(data.contacts)) {
            data.contacts.forEach((contact: any, index: number) => {
              if (contact.name && contact.mobile) {
                fetchedContacts.push({
                  id: `${doc.id}-${index}`, // Unique ID for each contact
                  name: contact.name,
                  mobile: contact.mobile,
                  isEmergency: false, // Assuming that isEmergency is not stored, you can modify this based on your logic
                })
              }
            })
          }
        })
  
        setContacts(fetchedContacts)
        console.log('Contacts fetched from Firestore:', fetchedContacts)
      } catch (error) {
        console.error('Error fetching contacts from Firestore:', error)
        setError('Failed to load contacts from Firestore')
      }
    }
  
    fetchContacts()
  }, [])
  

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          setError(null)
        },
        (err) => {
          setError(err.message)
          setLocation(null)
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedContacts = results.data.map((row: any, index: number) => ({
            id: index.toString(),
            name: row.name || '',
            mobile: row.mobile || '',
          }))
          setContacts(parsedContacts)
          setIsContactListOpen(true)
        },
        error: (err) => {
          console.error('Error parsing contact file:', err)
          setError('Failed to parse contact file')
        }
      })
    }
  }

  const handleAddContact = async () => {
    if (newContact.name && newContact.mobile) {
      try {
        // Save the new contact to Firestore
        const docRef = await addDoc(collection(db, "emergencyContacts"), {
          name: newContact.name,
          mobile: newContact.mobile,
          isEmergency: false,
          timestamp: new Date(),
        })
        
        console.log("Contact added to Firestore with ID:", docRef.id)
  
        // Add the new contact to the local state
        setContacts((prevContacts) => [
          ...prevContacts,
          { ...newContact, id: docRef.id, isEmergency: false }
        ])
        
        // Reset the form
        setNewContact({ name: '', mobile: '' })
        setIsAddContactOpen(false)
      } catch (error) {
        console.error("Error adding contact to Firestore:", error)
        setError("Failed to add contact")
      }
    }
  }

  const handleSOS = () => {
    if (location) {
      const mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      console.log(`SOS: User's location: ${mapLink}`)
      const emergencyContacts = contacts.filter(contact => contact.isEmergency)
      console.log('Emergency contacts to notify:', emergencyContacts)
    } else {
      console.log("Location not available for SOS")
    }
  }

  const toggleEmergencyContact = (id: string) => {
    setContacts(contacts.map(contact =>
      contact.id === id ? { ...contact, isEmergency: !contact.isEmergency } : contact
    ))
  }

  const filteredContacts = contacts.filter(contact =>
    (contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || contact.mobile?.includes(searchTerm))
  )

  const saveEmergencyContacts = async () => {
    const emergencyContacts = contacts.filter(c => c.isEmergency)
    
    try {
      // Save emergency contacts to Firestore
      await addDoc(collection(db, "emergencyContacts"), {
        contacts: emergencyContacts.map(contact => ({
          name: contact.name,
          mobile: contact.mobile
        })),
        timestamp: new Date()
      })
      console.log("Emergency contacts saved successfully.")
      setIsContactListOpen(false)
    } catch (error) {
      console.error("Error saving emergency contacts:", error)
      setError("Failed to save emergency contacts.")
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Location and Contacts</h1>
      
      <div className="space-y-4">
        <Button onClick={getLocation}>Get Location</Button>
        
        {location && (
          <div className="bg-muted p-2 rounded">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
        
        {error && <p className="text-red-500">Error: {error}</p>}
        
        <div className="flex space-x-2">
          <Button variant="outline" className="w-1/2">
            <label htmlFor="file-upload" className="cursor-pointer flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload Contacts
            </label>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.vcf"
            onChange={handleUpload}
            className="hidden"
          />
          
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-1/2">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={newContact.mobile}
                    onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddContact}>Save Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Button onClick={handleSOS} variant="destructive" className="w-full">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Send SOS
        </Button>
        
        <Dialog open={isContactListOpen} onOpenChange={setIsContactListOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Emergency Contacts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search contacts"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={contact.isEmergency}
                      onCheckedChange={() => toggleEmergencyContact(contact.id)}
                    />
                    <Label htmlFor={`contact-${contact.id}`}>
                      {contact.name} ({contact.mobile})
                    </Label>
                  </div>
                ))}
              </ScrollArea>
              <Button onClick={saveEmergencyContacts}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display the saved contacts */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Saved Contacts</h2>
        {contacts.length > 0 ? (
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.id} className="border p-2 rounded">
                <p><strong>Name:</strong> {contact.name || 'N/A'}</p>
                <p><strong>Mobile:</strong> {contact.mobile || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contacts saved yet.</p>
        )}
      </div>  
    </div>
  )
}

export default LocationPage