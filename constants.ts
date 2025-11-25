import { Devotional } from './types';

export const ADMIN_EMAIL = "admin@grace.com";

export const MOCK_DEVOTIONALS: Devotional[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: "Morning Stillness",
    category: "Peace",
    content: "In the quiet of the morning, before the world wakes up, there is a peace that surpasses all understanding. Take a moment to breathe and center yourself today. The rush of the day will come, but this moment is yours.",
    imageUrl: "https://picsum.photos/800/400?random=1"
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    title: "Strength in Weakness",
    category: "Courage",
    content: "Sometimes we feel like we need to carry the weight of the world on our shoulders. True strength comes from acknowledging our limits and asking for help when we need it.",
    imageUrl: "https://picsum.photos/800/400?random=2"
  },
  {
    id: '3',
    date: "2023-12-25",
    title: "A Season of Joy",
    category: "Celebration",
    content: "Joy is not the absence of suffering, but the presence of hope. Let us celebrate the small wins today.",
    imageUrl: "https://picsum.photos/800/400?random=3"
  }
];