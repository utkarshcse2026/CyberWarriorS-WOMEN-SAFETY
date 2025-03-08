import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Component() {
  const features = [
    { name: "SOS Triggering", description: "Quickly send distress signals in emergency situations" },
    { name: "Mic Recording", description: "Capture audio for various applications" },
    { name: "Screen Notification Display", description: "Show important alerts and messages" },
    { name: "Wi-Fi Connectivity", description: "Connect to wireless networks for IoT applications" },
    { name: "GPIO Pins", description: "Interface with various sensors and actuators" },
    { name: "Low Power Consumption", description: "Ideal for battery-powered projects" },
    { name: "Arduino IDE Compatible", description: "Easy programming using familiar tools" },
    { name: "Built-in USB-TTL", description: "Simplify PC connections and programming" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">NodeMCU Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>NodeMCU Chip</CardTitle>
            <CardDescription>Powerful and versatile IoT platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src="/nodemcu.jpg"
              alt="NodeMCU Chip"
              width={480}
              height={480}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>Explore the capabilities of NodeMCU</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{feature.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}