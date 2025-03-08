import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Video,
  AlertTriangle,
  Users,
  Smile,
  Home,
  Zap,
  Shield
} from "lucide-react";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Check if the user is not logged in and redirect to home page
  if (!user) {
    redirect("/"); // Redirect to home if user is not logged in
  }

  const features = [
    {
      title: "AI-Powered SOS Alerts",
      description: "Automatically detects distress and triggers SOS alerts via voice command or gesture, notifying contacts and authorities instantly.",
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      route: "/location"
    },
    {
      title: "Smart Wearable Technology",
      description: "Discreet smartwatch with communication features for direct contact with emergency services, ensuring help is always close.",
      icon: <Video className="h-8 w-8 text-red-400" />,
      route: "/mcu"
    },
    {
      title: "Direction Notifier",
      description: "Utilizes Google Maps for safe routing, providing alerts and alternative paths to avoid high-risk areas.",
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      route: "/features/direction-notifier"
    },
    {
      title: "AI Chatbot Support",
      description: "24/7 AI powered conversation for grievance Registering",
      icon: <Users className="h-8 w-8 text-primary" />,
      route: "/grievance",
    },
    {
      title: "Safe Travels",
      description: "AI-driven safety checks and real-time ratings for ride-sharing and public transport users.",
      icon: <Smile className="h-8 w-8 text-pink-400" />,
      route: "/features/safe-travels"
    },
    {
      title: "Mobile App Integration",
      description: "Central hub for live tracking, resource connections, and automated incident reporting.",
      icon: <Home className="h-8 w-8 text-orange-400" />,
      route: "/features/mobile-app"
    },
    {
      title: "Social Media Analyzer",
      description: "A tool designed to scrutinize social media accounts and identify potentially harmful or abnormal behavior.",
      icon: <Zap className="h-8 w-8 text-green-400" />,
      route: "/analyzer"
    },
    {
      title: "Enhanced Safety",
      description: "Combines advanced tech for personal safety and promotes social change to improve community security.",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      route: "/features/enhanced-safety"
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Link href={feature.route} key={index}>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;