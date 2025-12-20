export type House = "Gryffindor" | "Slytherin" | "Hufflepuff" | "Ravenclaw";

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    house: House;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What drives you most when starting a new project?",
    options: [
      { text: "The challenge and pushing my limits", house: "Gryffindor" },
      { text: "The potential impact and recognition", house: "Slytherin" },
      { text: "Helping others and making a difference", house: "Hufflepuff" },
      { text: "Learning something new and solving complex problems", house: "Ravenclaw" },
    ],
  },
  {
    id: 2,
    question: "How do you approach collaboration?",
    options: [
      { text: "I take the lead and inspire others to follow", house: "Gryffindor" },
      { text: "I strategize and position myself for the best outcome", house: "Slytherin" },
      { text: "I ensure everyone's voice is heard and contribute equally", house: "Hufflepuff" },
      { text: "I focus on the technical aspects and share knowledge", house: "Ravenclaw" },
    ],
  },
  {
    id: 3,
    question: "When facing a difficult bug or problem, you:",
    options: [
      { text: "Dive in headfirst and figure it out as I go", house: "Gryffindor" },
      { text: "Find the most efficient workaround", house: "Slytherin" },
      { text: "Ask for help and work through it together", house: "Hufflepuff" },
      { text: "Research thoroughly and analyze all possibilities", house: "Ravenclaw" },
    ],
  },
  {
    id: 4,
    question: "What's your ideal project outcome?",
    options: [
      { text: "Something bold that breaks new ground", house: "Gryffindor" },
      { text: "A successful product that gains traction", house: "Slytherin" },
      { text: "A tool that genuinely helps people", house: "Hufflepuff" },
      { text: "An elegant solution to a complex problem", house: "Ravenclaw" },
    ],
  },
  {
    id: 5,
    question: "How do you handle failure?",
    options: [
      { text: "Learn from it and try again with more courage", house: "Gryffindor" },
      { text: "Analyze what went wrong and pivot strategically", house: "Slytherin" },
      { text: "Seek support and improve with the team", house: "Hufflepuff" },
      { text: "Study the failure deeply to understand the root cause", house: "Ravenclaw" },
    ],
  },
  {
    id: 6,
    question: "What's your preferred way to learn?",
    options: [
      { text: "Jump in and learn by doing", house: "Gryffindor" },
      { text: "Learn what's most useful for my goals", house: "Slytherin" },
      { text: "Learn alongside others in a supportive environment", house: "Hufflepuff" },
      { text: "Deep dive into documentation and theory", house: "Ravenclaw" },
    ],
  },
  {
    id: 7,
    question: "What motivates you to keep building?",
    options: [
      { text: "The thrill of creating something daring", house: "Gryffindor" },
      { text: "The potential for success and influence", house: "Slytherin" },
      { text: "The joy of helping and connecting with others", house: "Hufflepuff" },
      { text: "The pursuit of knowledge and mastery", house: "Ravenclaw" },
    ],
  },
];

export function calculateHouse(answers: House[]): House {
  const houseCounts: Record<House, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
  };

  // Count occurrences of each house
  answers.forEach((house) => {
    houseCounts[house]++;
  });

  // Find the house with the most votes
  let maxCount = 0;
  let selectedHouse: House = "Gryffindor";

  (Object.keys(houseCounts) as House[]).forEach((house) => {
    if (houseCounts[house] > maxCount) {
      maxCount = houseCounts[house];
      selectedHouse = house;
    }
  });

  return selectedHouse;
}

export const houseDescriptions: Record<House, string> = {
  Gryffindor:
    "Bold and daring, you're driven by courage and the thrill of pushing boundaries. You take on challenges head-first and inspire others with your fearless approach to building.",
  Slytherin:
    "Ambitious and strategic, you're focused on achieving your goals and making an impact. You know how to position yourself for success and aren't afraid to take calculated risks.",
  Hufflepuff:
    "Loyal and collaborative, you believe in the power of community and helping others. You build with empathy and ensure everyone's voice is heard in your projects.",
  Ravenclaw:
    "Curious and analytical, you're driven by the pursuit of knowledge and elegant solutions. You love diving deep into problems and creating innovative, well-thought-out projects.",
};

export const houseColors: Record<House, string> = {
  Gryffindor: "from-red-600 to-yellow-500",
  Slytherin: "from-green-600 to-emerald-500",
  Hufflepuff: "from-yellow-600 to-amber-500",
  Ravenclaw: "from-blue-600 to-cyan-500",
};
