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

/** Tilanne prompts from tilanne_questions.md */
const SPEAKING_TILANNE_PROMPTS: Record<PracticeTopic, readonly string[]> = {
  "Minä ja taustani": [
    "Ystäväsi kertoo, että hänen isänsä on kuollut. Ystävä on todella surullinen. Mitä sanot?",
    "Olet ystävän luona kylässä. Ystävä tarjoaa sinulle ruokaa tai juomaa, jota et voi syödä / juoda (keksi itse, miksi). Kieltäydy kohteliaasti.",
    "Ystävä tulee sinun luo kylään. Hänellä on sinulle todella iso ja kallis lahja. Mitä sanot?",
    "Sinulla ja ystävälläsi oli edellisenä päivänä riita jostain pienestä asiasta. Soitat ystävällesi ja haluat sopia. Jätä ääniviesti ystävälle.",
    "Näet kaupungilla vanhan ystäväsi, jota et ole nähnyt pitkään aikaan. Mitä sanot hänelle?",
  ],
  "Koti ja asuminen": [
    "Sinun auto on mennyt rikki ja tarvitset kyydin ystävältä (keksi itse mihin ja milloin).",
    "Haluat palkata siivoojan kotiin. Kerro ystävällesi, miksi et enää halua siivota itse.",
    "Etsit uutta asuntoa. Välittäjä kysyy, mikä on sinulle tärkeää asuinympäristössä. Mitä sanot?",
  ],
  "Kauppa ja palvelut": [
    "Menet kahvilaan, mutta kaikki pöydät ovat likaisia. Valita asiasta tarjoilijalle.",
    "Olet ostanut Ikeasta lampun, joka on pudonnut katosta alas. Valita asiasta Ikeaan ja vaadi korvausta.",
    "Ravintolassa on todella hidas palvelu. Valita asiasta tarjoilijalle.",
  ],
  Kulttuuri: [
    "Menet häihin, mutta unohdit ostaa häälahjan. Mitä sanot hääparille?",
    "Luet kirjaa kirjastossa, kun joku puhuu kovaan ääneen puhelimessa. Huomauta hänelle asiasta.",
  ],
  Matkustaminen: [
    "Neuvo ystävä sinun kotiin bussilla.",
    "Olet junassa. Sinulla on paikkalippu, mutta joku istuu siinä. Mitä sanot?",
  ],
  "Terveys ja hyvinvointi": [
    "Olet nähnyt auto-onnettomuuden. Poliisi kysyy sinulta, mitä tapahtui. Vastaa poliisille.",
    "Olet sopinut ystävän kanssa jotain, mutta olet sairas ja et voi tavata.",
  ],
  Työ: [
    "Sinun palkassa on virhe. Soitat palkanlaskijalle.",
    "Olet saanut uuden työpaikan ja sinun täytyy irtisanoutua. Kerro pomolle tilanne.",
  ],
  Ympäristö: [
    "Löydät sohvan, jääkaapin ja paljon roskapusseja metsästä. Soitat kaatopaikalle ja kerrot tilanteesta.",
    "Ulkomailla asuva ystäväsi kysyy sinulta, millainen on Suomen luonto. Mitä sanot?",
  ],
  Yhteiskunta: [
    "Näet kadulla, että kaksi poikaa kiusaa koulukaveria. Mene väliin ja kerro pojille, miksi ei saa kiusata.",
    "Olet joutunut rikoksen uhriksi. Ilmoita asiasta poliisille.",
  ],
};

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
): PracticeSpeakingQuestion[] {
  const slug = TOPIC_SLUGS[topic];

  if (taskKind === "tilanne") {
    return SPEAKING_TILANNE_PROMPTS[topic].map((prompt, i) => {
      const index = i + 1;
      return {
        id: `sp-${slug}-tilanne-${index}`,
        skill: "speaking",
        topic,
        taskKind: "tilanne",
        title: index > 1 ? `${topic} — tilanne ${index}` : `${topic} — tilanne`,
        instructions: "Lue tilanne ja vastaa lyhyesti ja luontevasti.",
        prompt,
        hints: speakingHintLines(topic, "tilanne"),
        prep_time_seconds: 20,
        speak_time_seconds: 30,
      };
    });
  }

  if (taskKind === "kertominen") {
    return [
      {
        id: `sp-${slug}-kertominen-1`,
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
      },
    ];
  }

  return [
    {
      id: `sp-${slug}-mielipide-1`,
      skill: "speaking",
      topic,
      taskKind: "mielipide",
      title: `${topic} — mielipide`,
      instructions: "Esitä perusteltu mielipide annettuun väitteeseen.",
      prompt: `Väite (liittyen aiheeseen ${topic}): Hallituksen pitäisi tukea enemmän paikallisia palveluita. Oletko samaa mieltä? Miksi tai miksi et?`,
      hints: speakingHintLines(topic, "mielipide"),
      prep_time_seconds: 120,
      speak_time_seconds: 120,
    },
  ];
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
    for (const taskKind of SPEAKING_TASK_KINDS) {
      out.push(...buildSpeakingQuestion(topic, taskKind));
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
