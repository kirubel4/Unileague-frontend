// app/lineup/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

import { mockGames } from "../mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LineupPage = () => {
  return (
    <div className="flex flex-1">
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lineup Management
              </h1>
              <p className="text-gray-600 mt-2">
                Select your starting lineup for upcoming games and submit for
                approval
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Games
              </h2>
              <div className="text-sm text-gray-500">
                {mockGames.length} games scheduled
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGames.map((game) => (
                <Card
                  key={game.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            game.type === "Home"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {game.type}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {game.status}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      vs {game.opponent}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(game.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{game.time}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{game.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link href={`/coach/lineup/${game.id}`}>
                        <Button className="w-full" size="lg">
                          <Users className="w-4 h-4 mr-2" />
                          Select Lineup
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LineupPage;
