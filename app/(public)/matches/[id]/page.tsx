"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MatchDetailPage() {
	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-2xl font-bold mb-6">Match Details</h1>
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="lineups">Lineups</TabsTrigger>
					<TabsTrigger value="stats">Stats</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Overview</h2>
						<p>Match summary, score, and key events will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="lineups">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Lineups</h2>
						<p>Team lineups and formations will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="stats">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Stats</h2>
						<p>Match statistics will appear here.</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
