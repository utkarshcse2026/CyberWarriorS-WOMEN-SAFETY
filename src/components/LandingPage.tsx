'use client'
import React, { useState } from 'react'
import { redirect } from "next/navigation";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FloatingNav } from "./ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { TypewriterEffect } from "./ui/typewriter-effect";

import { useRouter } from 'next/navigation' 
import { 
  Heart, Activity, Video, Moon, AlertTriangle, Brain, 
  Users, TrendingUp, DollarSign, Smile, Stethoscope, Home,
  Zap, Shield, Clock, Smartphone, Clipboard, HeartPulse
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ZAxis
} from 'recharts'


export default function LandingPage() {


  const [email, setEmail] = useState('')
  const router = useRouter()
  

  const icuPerformanceData = [
    { day: 1, traditional: 70, criticalLink: 85 },
    { day: 2, traditional: 72, criticalLink: 87 },
    { day: 3, traditional: 68, criticalLink: 90 },
    { day: 4, traditional: 75, criticalLink: 92 },
    { day: 5, traditional: 71, criticalLink: 89 },
    { day: 6, traditional: 73, criticalLink: 91 },
    { day: 7, traditional: 69, criticalLink: 93 },
  ]
  const handledash =()=>{
    router.push("/dashboard");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Demo requested for:', email)
    setEmail('')
  }

  const marketGrowthData = [
    { year: 2020, value: 100 },
    { year: 2021, value: 150 },
    { year: 2022, value: 220 },
    { year: 2023, value: 310 },
    { year: 2024, value: 450 },
  ]

  const efficiencyData = [
    { name: 'Traditional ICU', value: 30 },
    { name: 'CriticalLink ICU', value: 70 },
  ]

  const patientMetricsData = [
    { time: '00:00', After: 72, Before: 37},
    { time: '04:00', After: 68, Before: 36 },
    { time: '08:00', After: 70, Before: 44},
    { time: '12:00', After: 75, Before: 30},
    { time: '16:00', After: 73, Before: 32},
    { time: '20:00', After: 71, Before: 39 },
  ]

  const sleepPatternData = [
    { time: '22:00', action: 0, victim : 0, attacker: 100 },
    { time: '23:00', action: 20, victim: 70, attacker: 10 },
    { time: '00:00', action: 60, victim: 35, attacker: 5 },
    { time: '01:00', action: 80, victim: 15, attacker: 5 },
    { time: '02:00', action: 70, victim: 25, attacker: 5 },
    { time: '03:00', action: 50, victim: 45, attacker: 5 },
    { time: '04:00', action : 30, victim: 60, attacker: 10 },
    { time: '05:00', action: 10, victim: 70, attacker: 20 },
    { time: '06:00', action: 0, victim: 30, attacker: 70 },
  ]

  const icuImpactData = [
    { metric: 'Patient Recovery Rate', traditional: 70, criticalLink: 85 },
    { metric: 'Average ICU Stay (days)', traditional: 7, criticalLink: 5 },
    { metric: 'Early Complication Detection', traditional: 60, criticalLink: 90 },
    { metric: 'Patient Satisfaction', traditional: 75, criticalLink: 95 },
    { metric: 'Cost Reduction (%)', traditional: 0, criticalLink: 30 },
  ]

  const emergencyResponseData = [
    { scenario: 'Cardiac Event', responseTime: 2.5 },
    { scenario: 'Respiratory Distress', responseTime: 1.8 },
    { scenario: 'Sudden BP Drop', responseTime: 1.5 },
    { scenario: 'Abnormal Lab Results', responseTime: 3.2 },
    { scenario: 'Patient Fall', responseTime: 1.2 },
  ]

  const costReductionData = [
    { category: 'Staff Optimization', reduction: 25 },
    { category: 'Early Intervention', reduction: 35 },
    { category: 'Reduced Length of Stay', reduction: 20 },
    { category: 'Preventive Care', reduction: 15 },
    { category: 'Efficient Resource Use', reduction: 30 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];


    const words = [
      { text: "AEGIS " ,className:"text-blue-500 dark:text-blue-500"},
      {text:"AI:",className:"text-blue-500 dark:text-blue-500"},
      { text: "Your" },
      { text: "Smart" },
      { text: "Guardian" },
      { text: "for" },
      { text: "Every" },
      { text: "Step" }
    ];
  return (
    
    <div className="flex flex-col min-h-screen font-sans ">
        <div className="relative  w-full">
          <FloatingNav navItems={navItems} />
        </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      {/* <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold">CriticalLink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#analytics">
            Analytics
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#impact">
            Impact
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#faq">
            FAQ
          </Link>
        </nav>
      </header> */}
      <main className="flex-1 text-gray-700">
      <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-600 dark:text-neutral-200 text-2xl mb-10">
      AI AllTogether for a Safer Tomorrow
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={handledash}>
          Get Started 
        </button>

      </div>
    </div>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32  bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Link href="/location">
            <FeatureCard
  icon={<Activity className="h-8 w-8 text-blue-600" />}
  title="AI-Powered SOS Alerts"
  description="Automatically detects distress and triggers SOS alerts via voice command or gesture, notifying contacts and authorities instantly."
/>
</Link>
<Link href="/mcu">
<FeatureCard
  icon={<Video className="h-8 w-8 text-red-400" />}
  title="Smart Wearable Technology"
  description="Discreet smartwatch with communication features for direct contact with emergency services, ensuring help is always close."
/>
</Link>
<Link href="/integrate">
<FeatureCard
  icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
  title="Direction Notifier"
  description="Utilizes Google Maps for safe routing, providing alerts and alternative paths to avoid high-risk areas."
/>
</Link>
<Link href="/grievance">
<FeatureCard
  icon={<Users className="h-8 w-8 text-primary" />}
  title="AI Chatbot Support"
  description="24/7 AI powered conversation for grievance Registering"
/>
</Link>
<Link href="/authoritykiosk">
<FeatureCard
  icon={<Users className="h-8 w-8 text-primary" />}
  title="Police-Dashboard"
  description="Police-Dashboard"
/>
</Link>



<FeatureCard
  icon={<Home className="h-8 w-8 text-orange-400" />}
  title="Mobile App Integration"
  description="Central hub for live tracking, resource connections, and automated incident reporting."
/>
<Link href="/analyzer">
<FeatureCard
  icon={<Zap className="h-8 w-8 text-green-400" />}
  title="Social Media Analyzer "
  description="A Social Media Analyzer for Suspicious Activity Detection is a tool designed to scrutinize social media accounts and identify potentially harmful or abnormal behavior."
/>
</Link>
<FeatureCard
  icon={<Shield className="h-8 w-8 text-red-500" />}
  title="Enhanced Safety"
  description="Combines advanced tech for personal safety and promotes social change to improve community security."
/>

            </div>
          </div>
        </section>

        <section id="analytics" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-4">
              <span className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
                Our Imapact
              </span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Here are some stats
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-center">Before vs Now Women security  </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="After" stroke="#8884d8" name="Heart Rate" />
                    <Line type="monotone" dataKey="Before" stroke="#82ca9d" name="Breathing Rate" />

                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-center">CCTV analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sleepPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="action" stackId="1" stroke="#8884d8" fill="#8884d8" name="action" />
                    <Area type="monotone" dataKey="victim" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="victim" />
                    <Area type="monotone" dataKey="attacker" stackId="1" stroke="#ffc658" fill="#ffc658" name="attacker" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>


          </div>
        </section>

        

        
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Aegis AI, and how does it help improve personal safety?</AccordionTrigger>
                <AccordionContent>
                Aegis AI uses AI-driven technology to analyze risks, send out emergency alerts, and connect you with trusted contacts or nearby users for quick assistance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the SOS alert system work?</AccordionTrigger>
                <AccordionContent>
                When the SOS button is triggered, the app sends your real-time location, along with an alert message, to your trusted contacts and any Aegis AI users in the vicinity. 
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How does Aegis AI detect and notify users about potential risks?</AccordionTrigger>
                <AccordionContent>
                Aegis AI uses AI-powered algorithms and real-time data to assess the user's environment, identifying potential threats such as entering high-risk areas, nearby criminal activities, or other safety hazards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use Aegis AI even if I don’t have access to the internet?</AccordionTrigger>
                <AccordionContent>
                Yes, Aegis AI is designed to offer limited functionality even in offline mode. 
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-100 via-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Contact Us 
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                To resolve any issue feel free to contact us 
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">Request Demo</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-400">© 2056 CriticalLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white">
      <div className="mb-3 p-2 bg-primary/10 rounded-full">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <p className="text-lg mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  )
}
