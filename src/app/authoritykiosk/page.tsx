'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BellIcon, MapPinIcon, PhoneIcon, UsersIcon, FileIcon, AlertTriangleIcon } from 'lucide-react'

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyDK9s_8Zejb9mjkFAQXCSuL6FchKQnaOnY",
  authDomain: "aegis-e265d.firebaseapp.com",
  projectId: "aegis-e265d",
  storageBucket: "aegis-e265d.appspot.com",
  messagingSenderId: "167192758124",
  appId: "1:167192758124:web:e6b6e1c83fc34d73d89549",
  measurementId: "G-7C3FQ9GS70"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

type SOSAlert = {
  id: string
  name: string
  date: string
  location: string
  files: string[]
  contactNumbers: string[]
  familyMembers: string[]
  isNew: boolean
  image: string
}

type PendingCase = {
  id: string
  name: string
  reportType: string
  date: string
  reportSummary: string
  evidenceFiles: string[]
  image: string
}

// Removed dummy data
// const dummySOSAlerts: SOSAlert[] = [ ... ]
// const dummyPendingCases: PendingCase[] = [ ... ]

export default function Component() {
  const [activeTab, setActiveTab] = useState('sos')
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([])
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch SOS Alerts from Firestore
        const sosAlertsCollection = collection(db, 'sosAlerts')
        const sosAlertsSnapshot = await getDocs(sosAlertsCollection)
        const sosAlertsData = sosAlertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SOSAlert[]

        // Fetch Pending Cases from Firestore
        const pendingCasesCollection = collection(db, 'pendingCases')
        const pendingCasesSnapshot = await getDocs(pendingCasesCollection)
        const pendingCasesData = pendingCasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PendingCase[]

        // Update state with fetched data
        setSOSAlerts(sosAlertsData)
        setPendingCases(pendingCasesData)
      } catch (error) {
        console.error('Error fetching data from Firestore:', error)
      }
    }

    fetchData()
  }, [])

  const approveCase = async (id: string) => {
    try {
      // Update the case in Firestore (e.g., mark as approved)
      const caseDocRef = doc(db, 'pendingCases', id)
      await updateDoc(caseDocRef, { approved: true })

      // Remove the case from the pendingCases state
      setPendingCases(pendingCases.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error approving case:', error)
    }
  }

  const hasNewAlerts = sosAlerts.some(alert => alert.isNew)
  const hasPendingApprovals = pendingCases.length > 0

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sos" className="relative">
            SOS Alerts
            {hasNewAlerts && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                <BellIcon className="h-4 w-4" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Approvals
            {hasPendingApprovals && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                <BellIcon className="h-4 w-4" />
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sos">
          <h2 className="text-2xl font-bold mb-4">SOS Alerts</h2>
          <ScrollArea className="h-[600px]">
            {sosAlerts.map((alert) => (
              <Card key={alert.id} className="mb-4 relative overflow-hidden">
                {alert.isNew && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                    NEW
                  </div>
                )}
                <div className="flex">
                  <div className="w-1/3">
                    <img src={alert.image} alt={alert.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-2/3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                        {alert.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" /> {alert.location} | {alert.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{alert.contactNumbers.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>{alert.familyMembers.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <div className="flex gap-2">
                          {alert.files.map((file, index) => (
                            <Avatar key={index}>
                              <AvatarImage src={file} alt={`File ${index + 1}`} />
                              <AvatarFallback>F{index + 1}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="pending">
          <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
          <ScrollArea className="h-[600px]">
            {pendingCases.map((pendingCase) => (
              <Card key={pendingCase.id} className="mb-4">
                <div className="flex">
                  <div className="w-1/3">
                    <img src={pendingCase.image} alt={pendingCase.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-2/3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {pendingCase.name}
                      </CardTitle>
                      <CardDescription>{pendingCase.reportType} - {pendingCase.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2"><strong>Report Summary:</strong> {pendingCase.reportSummary}</p>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <div className="flex gap-2">
                          {pendingCase.evidenceFiles.map((file, index) => (
                            <Avatar key={index}>
                              <AvatarImage src={file} alt={`Evidence ${index + 1}`} />
                              <AvatarFallback>E{index + 1}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => approveCase(pendingCase.id)}>Approve Case</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
