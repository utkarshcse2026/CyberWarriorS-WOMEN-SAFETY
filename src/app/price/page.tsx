"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckIcon } from "@heroicons/react/24/solid"

const pricingPlans = [
  {
    name: "Basic",
    price: 9,
    features: ["1 user", "10 projects", "5GB storage", "Basic support"],
  },
  {
    name: "Pro",
    price: 29,
    features: ["5 users", "50 projects", "100GB storage", "Priority support", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    price: 99,
    features: ["Unlimited users", "Unlimited projects", "1TB storage", "24/7 support", "Custom integrations", "Dedicated account manager"],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PricingCard({ plan, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{plan.name}</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-6">${plan.price}<span className="text-base font-normal text-gray-600">/mo</span></p>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 text-gray-600"
            >
              <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <motion.div
        className="p-4 bg-gray-50"
        animate={{ backgroundColor: isHovered ? "#EEF2FF" : "#F9FAFB" }}
        transition={{ duration: 0.2 }}
      >
        <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200">
          Choose Plan
        </button>
      </motion.div>
    </motion.div>
  )
}