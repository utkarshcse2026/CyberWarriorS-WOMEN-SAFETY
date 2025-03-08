'use client'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Cog, PlayCircle } from "lucide-react";

export default function CCTVAnalysis() {
  const router = useRouter();
  
  const changePage = () => {
    // Ideally, change this to a route within your Next.js app
    router.push("http://127.0.0.1:5500/womensafety/src/cctv_model/index.html"); // Example route in Next.js app
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AEGIS AI CCTV Analysis</h1>
        <p className="text-xl text-muted-foreground">
          Advanced surveillance analysis for enhanced security and insights
        </p>
      </header>

      <div className="flex justify-center mb-12">
        <Button size="lg" onClick={changePage} className="text-lg px-8 py-6">
          <PlayCircle className="mr-2 h-6 w-6" /> Start Analysing 
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="mr-2 h-6 w-6" />
              Best Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Large-scale public event security monitoring</li>
              <li>Retail loss prevention and customer behavior analysis</li>
              <li>Industrial safety compliance and hazard detection</li>
              <li>Smart city traffic management and urban planning</li>
              <li>Critical infrastructure protection and anomaly detection</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Proper Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Security professionals and law enforcement agencies</li>
              <li>Retail and business operations managers</li>
              <li>Industrial safety officers and compliance managers</li>
              <li>Urban planners and city administrators</li>
              <li>Critical infrastructure operators and security teams</li>
              <li>Event organizers and venue management personnel</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cog className="mr-2 h-6 w-6" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Connect AEGIS AI to your existing CCTV infrastructure</li>
              <li>Our advanced AI algorithms process video feeds in real-time</li>
              <li>Machine learning models detect and classify objects, people, and behaviors</li>
              <li>Anomaly detection flags unusual patterns or potential security threats</li>
              <li>Real-time alerts are sent to designated personnel for immediate action</li>
              <li>Comprehensive analytics and reports are generated for long-term insights</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          AEGIS AI: Empowering security professionals with cutting-edge CCTV analysis technology.
          <br />
          Start your journey towards enhanced surveillance and data-driven security today.
        </p>
      </div>
    </div>
  );
}
