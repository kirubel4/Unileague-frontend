// lib/mockData.ts
export interface Game {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: "Home" | "Away";
  status: "upcoming" | "in-progress" | "completed";
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  isAvailable: boolean;
}

export interface Lineup {
  gameId: string;
  startingPlayers: Player[];
  benchPlayers: Player[];
  captainId: string;
  submitted: boolean;
}

export interface TeamImage {
  id: string;
  url: string;
  title: string;
  description: string;
  uploadedBy: string;
  date: string;
  tags: string[];
}

export const mockGames: Game[] = [
  {
    id: "1",
    opponent: "United FC",
    date: "2024-01-15",
    time: "19:00",
    location: "Main Stadium",
    type: "Home",
    status: "upcoming",
  },
  {
    id: "2",
    opponent: "City Rovers",
    date: "2024-01-22",
    time: "15:00",
    location: "Away Ground",
    type: "Away",
    status: "upcoming",
  },
  {
    id: "3",
    opponent: "Athletic Club",
    date: "2024-01-29",
    time: "20:00",
    location: "Main Stadium",
    type: "Home",
    status: "upcoming",
  },
];

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "John Smith",
    number: 1,
    position: "Goalkeeper",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Mike Johnson",
    number: 4,
    position: "Defender",
    isAvailable: true,
  },
  {
    id: "3",
    name: "David Lee",
    number: 5,
    position: "Defender",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Chris Brown",
    number: 6,
    position: "Midfielder",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Alex Turner",
    number: 7,
    position: "Midfielder",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Sam Wilson",
    number: 9,
    position: "Forward",
    isAvailable: true,
  },
  {
    id: "7",
    name: "James Miller",
    number: 10,
    position: "Forward",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Robert Davis",
    number: 11,
    position: "Midfielder",
    isAvailable: true,
  },
  {
    id: "9",
    name: "Thomas White",
    number: 12,
    position: "Defender",
    isAvailable: false,
  },
  {
    id: "10",
    name: "Daniel Moore",
    number: 13,
    position: "Goalkeeper",
    isAvailable: true,
  },
  {
    id: "11",
    name: "Paul Taylor",
    number: 14,
    position: "Midfielder",
    isAvailable: true,
  },
  {
    id: "12",
    name: "Kevin Clark",
    number: 15,
    position: "Forward",
    isAvailable: true,
  },
];

export const mockTeamImages: TeamImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop",
    title: "Championship Celebration",
    description: "Celebrating our regional championship win",
    uploadedBy: "Coach Johnson",
    date: "2024-01-05",
    tags: ["celebration", "championship", "team"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w-800&auto=format&fit=crop",
    title: "Training Session",
    description: "Intense training session before the big game",
    uploadedBy: "Assistant Coach",
    date: "2024-01-08",
    tags: ["training", "practice", "preparation"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop",
    title: "Team Building",
    description: "Team building activities at the retreat",
    uploadedBy: "Coach Johnson",
    date: "2024-01-10",
    tags: ["team-building", "bonding", "retreat"],
  },
];
