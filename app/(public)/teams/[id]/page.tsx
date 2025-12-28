"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TeamDetailPage() {
	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-2xl font-bold mb-6">Team Name</h1>
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="fixtures">Fixtures</TabsTrigger>
					<TabsTrigger value="standings">Standings</TabsTrigger>
					<TabsTrigger value="players">Players</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Overview</h2>
						<p>Team details, history, and summary will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="fixtures">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Fixtures</h2>
						<p>Upcoming and past matches for this team will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="standings">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Standings</h2>
						<p>Team's position in the league or tournament will appear here.</p>
					</div>
				</TabsContent>
				<TabsContent value="players">
					<div className="bg-white rounded-lg p-6 shadow">
						<h2 className="text-lg font-semibold mb-2">Players</h2>
						<p>List of players in this team will appear here.</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
