export type House = "KERNEL" | "FRACTAL" | "SIGNAL" | "VECTOR";

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
    question: "When you get a new idea, your first instinct is to…",
    options: [
      { text: "Start experimenting immediately and see what happens", house: "KERNEL" },
      { text: "Break it down and understand the core logic first", house: "FRACTAL" },
      { text: "Imagine how it could be communicated or shaped creatively", house: "SIGNAL" },
      { text: "Share it with someone to refine it together", house: "VECTOR" },
    ],
  },
  {
    id: 2,
    question: "Your motivation drops hardest when…",
    options: [
      { text: "You’re forced to wait or move slowly", house: "KERNEL" },
      { text: "Things feel unclear or poorly thought out", house: "FRACTAL" },
      { text: "The work feels dull or meaningless", house: "SIGNAL" },
      { text: "You feel isolated or unheard", house: "VECTOR" },
    ],
  },
  {
    id: 3,
    question: "If a project is failing, you usually…",
    options: [
      { text: "Try new approaches rapidly until something clicks", house: "KERNEL" },
      { text: "Analyze what went wrong before touching anything", house: "FRACTAL" },
      { text: "Reframe the idea or change how it’s presented", house: "SIGNAL" },
      { text: "Ask for feedback and outside perspectives", house: "VECTOR" },
    ],
  },
  {
    id: 4,
    question: "How do you learn something best?",
    options: [
      { text: "By doing it, messing up, and fixing it", house: "KERNEL" },
      { text: "By understanding the theory and structure first", house: "FRACTAL" },
      { text: "By explaining it or turning it into a story", house: "SIGNAL" },
      { text: "By discussing it with others", house: "VECTOR" },
    ],
  },
  {
    id: 5,
    question: "You’re most proud of work that…",
    options: [
      { text: "Exists because you made it real", house: "KERNEL" },
      { text: "Is logically solid and well thought out", house: "FRACTAL" },
      { text: "Makes people feel or think differently", house: "SIGNAL" },
      { text: "Brings people together or helps others succeed", house: "VECTOR" },
    ],
  },
  {
    id: 6,
    question: "Your biggest strength in a team is…",
    options: [
      { text: "Getting things done", house: "KERNEL" },
      { text: "Planning and problem-solving", house: "FRACTAL" },
      { text: "Communication and creativity", house: "SIGNAL" },
      { text: "Coordination and leadership", house: "VECTOR" },
    ],
  },
  {
    id: 7,
    question: "You lose interest in projects when…",
    options: [
      { text: "There’s too much talking and not enough action", house: "KERNEL" },
      { text: "Decisions are made without reasoning", house: "FRACTAL" },
      { text: "There’s no room for creativity", house: "SIGNAL" },
      { text: "Collaboration breaks down", house: "VECTOR" },
    ],
  },
  {
    id: 8,
    question: "When working alone, you tend to…",
    options: [
      { text: "Move fast and figure things out on the way", house: "KERNEL" },
      { text: "Plan carefully before acting", house: "FRACTAL" },
      { text: "Explore ideas freely without rigid structure", house: "SIGNAL" },
      { text: "Eventually seek input from others", house: "VECTOR" },
    ],
  },
  {
    id: 9,
    question: "Success, to you, feels like…",
    options: [
      { text: "Seeing something functional that didn’t exist before", house: "KERNEL" },
      { text: "Solving a complex problem correctly", house: "FRACTAL" },
      { text: "Creating something meaningful or impactful", house: "SIGNAL" },
      { text: "Helping a group move forward together", house: "VECTOR" },
    ],
  },
  {
    id: 10,
    question: "If you had one weekend free, you’d most likely…",
    options: [
      { text: "Build or prototype something new", house: "KERNEL" },
      { text: "Research or deeply learn a topic", house: "FRACTAL" },
      { text: "Write, design, or create content", house: "SIGNAL" },
      { text: "Organize or collaborate with others", house: "VECTOR" },
    ],
  },
];

export function calculateHouse(answers: House[]): House {
  const houseCounts: Record<House, number> = {
    KERNEL: 0,
    FRACTAL: 0,
    SIGNAL: 0,
    VECTOR: 0,
  };

  answers.forEach((house) => {
    houseCounts[house]++;
  });

  let maxCount = 0;
  let selectedHouse: House = "KERNEL";

  (Object.keys(houseCounts) as House[]).forEach((house) => {
    if (houseCounts[house] > maxCount) {
      maxCount = houseCounts[house];
      selectedHouse = house;
    }
  });

  return selectedHouse;
}

export const houseDescriptions: Record<House, string> = {
  KERNEL:
    "Builders at heart. You thrive on execution, speed, and turning ideas into real, working systems.",
  FRACTAL:
    "Deep thinkers and architects. You value structure, logic, and solving problems the right way.",
  SIGNAL:
    "Creative communicators. You shape ideas into stories, designs, and messages that resonate.",
  VECTOR:
    "Connectors and leaders. You amplify impact by bringing people together and aligning momentum.",
};

export const houseColors: Record<House, string> = {
  KERNEL: "from-orange-600 to-red-500",
  FRACTAL: "from-indigo-600 to-purple-500",
  SIGNAL: "from-pink-600 to-rose-500",
  VECTOR: "from-emerald-600 to-teal-500",
};
