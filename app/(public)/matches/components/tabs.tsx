"use client"

import { useState } from "react"

interface TabsProps {
  onTabChange?: (tab: string) => void
}

export default function Tabs({ onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState("live")

  const tabs = [
    { id: "live", label: "Live" },
    { id: "upcoming", label: "Upcoming" },
    { id: "finished", label: "Finished" },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="flex gap-2 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
            activeTab === tab.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
