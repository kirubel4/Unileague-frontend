"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TournamentDetailPage() {
	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-2xl font-bold mb-6">Tournament Name</h1>
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="fixtures">Fixtures</TabsTrigger>
					<TabsTrigger value="standings">Standings</TabsTrigger>
					<TabsTrigger value="result">Result</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Overview</h2>
						<p>Details about the tournament, description, dates, etc.</p>
					</div>
				</TabsContent>
				<TabsContent value="fixtures">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Fixtures</h2>
						<p>List of matches and schedule will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="standings">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Standings</h2>
						<p>Table of team standings will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="result">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Result</h2>
						<p>Result of the tournament</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
