import type {
  Level,
  PracticeQuestion,
  PracticeSkill,
  PracticeSpeakingQuestion,
  PracticeTopic,
  PracticeWritingQuestion,
  SpeakingTask,
  SpeakingTaskKind,
  WritingTask,
  WritingTaskKind,
} from "@/lib/types";

export const PRACTICE_TOPICS: PracticeTopic[] = [
  "Minä ja taustani",
  "Koti ja asuminen",
  "Kauppa ja palvelut",
  "Kulttuuri",
  "Matkustaminen",
  "Terveys ja hyvinvointi",
  "Työ",
  "Ympäristö",
  "Yhteiskunta",
];

export const SPEAKING_TASK_KINDS: SpeakingTaskKind[] = ["kertominen", "tilanne", "mielipide"];

export const WRITING_TASK_KINDS: WritingTaskKind[] = ["informal", "formal", "mielipide"];

const TOPIC_SLUGS: Record<PracticeTopic, string> = {
  "Minä ja taustani": "mina-ja-taustani",
  "Koti ja asuminen": "koti-ja-asuminen",
  "Kauppa ja palvelut": "kauppa-ja-palvelut",
  Kulttuuri: "kulttuuri",
  Matkustaminen: "matkustaminen",
  "Terveys ja hyvinvointi": "terveys-ja-hyvinvointi",
  Työ: "tyo",
  Ympäristö: "ymparisto",
  Yhteiskunta: "yhteiskunta",
};

const SLUG_TO_TOPIC: Record<string, PracticeTopic> = Object.fromEntries(
  (Object.entries(TOPIC_SLUGS) as [PracticeTopic, string][]).map(([topic, slug]) => [slug, topic]),
);

export function topicSlug(topic: PracticeTopic): string {
  return TOPIC_SLUGS[topic];
}

export function topicFromSlug(slug: string): PracticeTopic | undefined {
  return SLUG_TO_TOPIC[slug];
}

export function isSpeakingTaskKind(s: string): s is SpeakingTaskKind {
  return (SPEAKING_TASK_KINDS as string[]).includes(s);
}

export function isWritingTaskKind(s: string): s is WritingTaskKind {
  return (WRITING_TASK_KINDS as string[]).includes(s);
}

function speakingHintLines(topic: PracticeTopic, taskKind: SpeakingTaskKind): string[] {
  if (taskKind === "tilanne") {
    return [
      "Mieti tilannetta lyhyesti ennen vastaamista.",
      "Ole kohtelias ja selkeä.",
    ];
  }
  if (taskKind === "mielipide") {
    return [
      "Perustele mielipiteesi esimerkillä.",
      "Mainitse vähintään yksi vastapuoli.",
    ];
  }
  return [
    `Liitä aihe "${topic}" vastaukseesi.`,
    "Rakenne: aloitus, keskusta, lopetus.",
    "Käytä esimerkkejä omasta elämästäsi.",
  ];
}

function buildSpeakingQuestion(
  topic: PracticeTopic,
  taskKind: SpeakingTaskKind,
  index: number,
): PracticeSpeakingQuestion {
  const slug = TOPIC_SLUGS[topic];
  const id = `sp-${slug}-${taskKind}-${index}`;

  if (taskKind === "kertominen") {
    return {
      id,
      skill: "speaking",
      topic,
      taskKind,
      title: `${topic} — kertominen`,
      instructions:
        "Kerro aiheesta yhtäjaksoisesti. Voit tehdä muistiinpanoja valmistautumisen aikana, mutta älä kirjoita kokonaisia lauseita.",
      prompt: `AIHE: ${topic}\n\nKerro aiheesta vähintään pari minuuttia. Kuvaa tilannetta, merkitystä sinulle ja mitä aiot tehdä jatkossa.`,
      hints: speakingHintLines(topic, taskKind),
      prep_time_seconds: 60,
      speak_time_seconds: 105,
    };
  }

  if (taskKind === "tilanne") {
    return {
      id,
      skill: "speaking",
      topic,
      taskKind,
      title: `${topic} — tilanne`,
      instructions: "Lue tilanne ja vastaa lyhyesti ja luontevasti.",
      prompt: `Tilanne (aihepiiri: ${topic}): Olet kaupassa ja tuote on viallinen. Selitä asia myyjälle ja pyydät hyvitystä.`,
      hints: speakingHintLines(topic, taskKind),
      prep_time_seconds: 20,
      speak_time_seconds: 30,
    };
  }

  return {
    id,
    skill: "speaking",
    topic,
    taskKind,
    title: `${topic} — mielipide`,
    instructions: "Esitä perusteltu mielipide annettuun väitteeseen.",
    prompt: `Väite (liittyen aiheeseen ${topic}): Hallituksen pitäisi tukea enemmän paikallisia palveluita. Oletko samaa mieltä? Miksi tai miksi et?`,
    hints: speakingHintLines(topic, taskKind),
    prep_time_seconds: 120,
    speak_time_seconds: 120,
  };
}

function buildWritingQuestion(
  topic: PracticeTopic,
  taskKind: WritingTaskKind,
  index: number,
): PracticeWritingQuestion {
  const slug = TOPIC_SLUGS[topic];
  const id = `wr-${slug}-${taskKind}-${index}`;

  if (taskKind === "informal") {
    return {
      id,
      skill: "writing",
      topic,
      taskKind,
      title: `${topic} — epävirallinen viesti`,
      instructions: "Kirjoita lyhyt viesti ystävälle tai tutulle.",
      prompt: `Kirjoita viesti, jossa kerrot lyhyesti jotain aiheesta "${topic}" ja kutsut kaverin kahville viikonloppuna.`,
      min_words: 80,
      max_words: 150,
    };
  }

  if (taskKind === "formal") {
    return {
      id,
      skill: "writing",
      topic,
      taskKind,
      title: `${topic} — virallinen kirje`,
      instructions: "Kirjoita asiallinen sävy ja selkeä rakenne.",
      prompt: `Kirjoita virallinen sähköposti palveluntarjoajalle: haluat reklamoida palvelua, joka liittyy aiheeseen "${topic}". Pyydä korjausta tai hyvitystä.`,
      min_words: 80,
      max_words: 150,
    };
  }

  return {
    id,
    skill: "writing",
    topic,
    taskKind,
    title: `${topic} — mielipide`,
    instructions: "Kirjoita perusteltu mielipide.",
    prompt: `Kirjoita mielipidekirjoitus aiheesta "${topic}": valitse yksi näkökulma ja perustele sitä esimerkeillä.`,
    min_words: 80,
    max_words: 150,
  };
}

function buildPool(): PracticeQuestion[] {
  const out: PracticeQuestion[] = [];
  for (const topic of PRACTICE_TOPICS) {
    let si = 0;
    for (const taskKind of SPEAKING_TASK_KINDS) {
      si += 1;
      out.push(buildSpeakingQuestion(topic, taskKind, si));
    }
    let wi = 0;
    for (const taskKind of WRITING_TASK_KINDS) {
      wi += 1;
      out.push(buildWritingQuestion(topic, taskKind, wi));
    }
  }
  return out;
}

export const practiceQuestions: PracticeQuestion[] = buildPool();

export function speakingTaskFromPractice(
  q: PracticeSpeakingQuestion,
  level: Level,
): SpeakingTask {
  return {
    title: q.title,
    instructions: q.instructions,
    prompt: q.prompt,
    hints: q.hints,
    prep_time_seconds: q.prep_time_seconds,
    speak_time_seconds: q.speak_time_seconds,
    task_type: q.taskKind,
    level,
  };
}

export function writingTaskFromPractice(q: PracticeWritingQuestion, level: Level): WritingTask {
  return {
    title: q.title,
    instructions: q.instructions,
    prompt: q.prompt,
    min_words: q.min_words,
    max_words: q.max_words,
    writing_type: q.taskKind,
    level,
  };
}

export function getTopicsForSkill(skill: PracticeSkill): PracticeTopic[] {
  const topics = new Set<PracticeTopic>();
  for (const q of practiceQuestions) {
    if (q.skill === skill) topics.add(q.topic);
  }
  return PRACTICE_TOPICS.filter((t) => topics.has(t));
}

export function getTaskKindsForTopic(
  skill: PracticeSkill,
  topicSlug: string,
): SpeakingTaskKind[] | WritingTaskKind[] {
  const topic = topicFromSlug(topicSlug);
  if (!topic) return [];

  const kinds = new Set<string>();
  for (const q of practiceQuestions) {
    if (q.skill === skill && q.topic === topic) kinds.add(q.taskKind);
  }

  if (skill === "speaking") {
    return SPEAKING_TASK_KINDS.filter((k) => kinds.has(k));
  }
  return WRITING_TASK_KINDS.filter((k) => kinds.has(k));
}

export function getQuestionsForTopicAndKind(
  skill: PracticeSkill,
  topicSlug: string,
  taskKind: string,
): PracticeQuestion[] {
  const topic = topicFromSlug(topicSlug);
  if (!topic) return [];

  return practiceQuestions.filter((q) => {
    if (q.skill !== skill || q.topic !== topic) return false;
    if (skill === "speaking") return isSpeakingTaskKind(taskKind) && q.taskKind === taskKind;
    return isWritingTaskKind(taskKind) && q.taskKind === taskKind;
  });
}

export function getQuestionById(id: string): PracticeQuestion | undefined {
  return practiceQuestions.find((q) => q.id === id);
}
