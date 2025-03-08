import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Globe, Zap, Users } from "lucide-react"

export default function Dashboard() {
  const features = [
    {
      title: "Real-time Analytics",
      description: "Track your website's performance with up-to-the-minute data and insights.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
    },
    {
      title: "Global CDN",
      description: "Lightning-fast content delivery to users worldwide with our robust CDN.",
      icon: <Globe className="h-8 w-8 text-primary" />,
    },
    {
      title: "Instant Deployment",
      description: "Push your changes and see them live in seconds with our rapid deployment system.",
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
    {
      title: "Collaborative Workspace",
      description: "Work seamlessly with your team using our integrated collaboration tools.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-wrap gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="flex-grow flex-shrink-0 basis-[calc(50%-12px)] sm:basis-[calc(33.333%-16px)] lg:basis-[calc(25%-18px)] hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {feature.icon}
                <span>{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}