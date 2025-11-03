import type { Post } from "../types";

export const DEFAULT_POSTS: Post[] = [
  {
    id: "1",
    title: "A Productive Day at Work",
    content: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager. It's always satisfying when you can exceed expectations and contribute meaningfully to your team's success.",
    excerpt: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
    category: 1,
    date: "2025-02-25",
    image: "/Auth/Image (4).png",
    likes: 15,
    comments: [
      { id: "c1", text: "Great job! Keep up the good work!", author: "John", date: "2025-02-25", postId: "1" },
      { id: "c2", text: "That's impressive! What strategies did you use?", author: "Sarah", date: "2025-02-25", postId: "1" }
    ],
  },
  {
    id: "2",
    title: "My First Job Interview Experience",
    content: "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident. The interviewer made me feel comfortable, and I was able to showcase my skills and experiences effectively. Here's what I learned from the experience...",
    excerpt: "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident.",
    category: 2,
    date: "2025-02-24",
    image: "/Auth/Image.png",
    likes: 23,
    comments: [
      { id: "c3", text: "We've all been there! Hope you get the job!", author: "Mike", date: "2025-02-24", postId: "2" },
      { id: "c4", text: "Interviews get easier with practice. You did great!", author: "Emma", date: "2025-02-24", postId: "2" }
    ],
  },
  {
    id: "3",
    title: "Overthinking Everything",
    content: "Lately, I have been overthinking everything, from small decisions to bigger life choices. I know I should trust myself more. It's a common challenge in today's fast-paced world, but I'm learning to take things one step at a time.",
    excerpt: "Lately, I have been overthinking everything, from small decisions to bigger life choices. I know I should trust myself more.",
    category: 3,
    date: "2025-02-23",
    image: "/Auth/Image (1).png",
    likes: 45,
    comments: [
      { id: "c5", text: "I can totally relate to this. Take it one day at a time!", author: "Lisa", date: "2025-02-23", postId: "3" },
      { id: "c6", text: "Try meditation, it helps with overthinking.", author: "David", date: "2025-02-23", postId: "3" }
    ],
  },
  {
    id: "4",
    title: "How collaboration makes us better designers",
    content: "Collaboration can make our teams stronger, and our work more impactful. When designers work together, they bring different perspectives and skills to the table, resulting in more innovative and user-friendly solutions.",
    excerpt: "Collaboration can make our teams stronger, and our work more impactful.",
    category: 2,
    date: "2025-02-16",
    image: "/Auth/Image (6).png",
    likes: 67,
    comments: [
      { id: "c7", text: "This really resonates with our team's experience!", author: "Alex", date: "2025-02-16", postId: "4" },
      { id: "c8", text: "Great insights on team collaboration!", author: "Maria", date: "2025-02-16", postId: "4" }
    ],
  },
  {
    id: "5",
    title: "Our top 10 Javascript frameworks to use",
    content: "JavaScript frameworks make development easy with extensive features and functionalities. In this post, we'll explore the top 10 frameworks that are shaping modern web development.",
    excerpt: "JavaScript frameworks make development easy with extensive features and functionalities.",
    category: 2,
    date: "2025-02-15",
    image: "/Auth/Image (1).png",
    likes: 89,
    comments: [
      { id: "c9", text: "React is definitely my favorite!", author: "James", date: "2025-02-15", postId: "5" },
      { id: "c10", text: "Would love to see a comparison between Vue and React", author: "Anna", date: "2025-02-15", postId: "5" }
    ],
  },
  {
    id: "6",
    title: "Podcast: Creating a better CX Community",
    content: "Starting a community doesn't need to be complicated, but how do you get started? This post explores the key steps to building a thriving customer experience community.",
    excerpt: "Starting a community doesn't need to be complicated, but how do you get started?",
    category: 4,
    date: "2025-02-05",
    image: "/Auth/Image (2).png",
    likes: 34,
    comments: [
      { id: "c11", text: "This podcast was super helpful for our startup!", author: "Thomas", date: "2025-02-05", postId: "6" },
      { id: "c12", text: "Great tips for community building!", author: "Sophie", date: "2025-02-05", postId: "6" }
    ],
  }
];