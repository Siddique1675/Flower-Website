export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  content: string; // Markdown formatted content
  image: string; // File URL or base64 data
  tags: string[];
  aestheticColor: string; // Hex color for highlights
  likes: number;
  comments: Comment[];
  careWatering?: string;
  careLight?: string;
  careSoil?: string;
  isAiGenerated?: boolean;
}

export interface FlowerAdvisorResult {
  botanicalName: string;
  family: string;
  nativeRegion: string;
  symbolicMeaning: string;
  seasonalCare: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  companionPlants: string[];
  toxicToPets: string;
  expertAdvice: string;
}
