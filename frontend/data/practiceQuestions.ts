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

/** Kertominen prompts from Kertominen_yki.md */
type KertominenPrompt = {
  title: string;
  prompt: string;
  hints: readonly string[];
};

const SPEAKING_KERTOMINEN: Record<PracticeTopic, readonly KertominenPrompt[]> = {
  "Minä ja taustani": [
    {
      title: "Minulle tärkeä paikka",
      prompt: "Kerro, mikä on sinulle tärkeä paikka.",
      hints: [
        "Missä se on?",
        "Miksi se on sinulle tärkeä?",
        "Kenen kanssa käyt siellä?",
        "Mitä siellä voi tehdä?",
        "Millainen paikka se on?",
      ],
    },
    {
      title: "Miten vietän vapaa-aikaa",
      prompt: "Kerro, miten vietät vapaa-aikaa.",
      hints: [
        "Mikä sinua kiinnostaa? Miksi?",
        "Mitä tykkäät tehdä vapaa-ajalla?",
        "Onko sinulla harrastuksia?",
        "Miten ja missä rentoudut parhaiten?",
      ],
    },
    {
      title: "Hieno päivä elämässäni",
      prompt: "Kerro hienosta päivästä elämässäsi.",
      hints: [
        "Mikä oli erityisen hieno päivä elämässäsi?",
        "Mitä silloin tapahtui? Mitä teit?",
        "Mikä teki päivästä erityisen?",
        "Kenen kanssa olit?",
      ],
    },
  ],
  "Koti ja asuminen": [
    {
      title: "Elämäni paras koti",
      prompt: "Kerro, mikä on paras koti, jossa olet koskaan asunut.",
      hints: [
        "Missä se on? Milloin asuit siellä?",
        "Millainen paikka se on?",
        "Miksi se on mielestäsi paras koti, jossa olet koskaan asunut?",
        "Mikä tekee kodista hyvän?",
      ],
    },
    {
      title: "Hyvä asuinalue",
      prompt: "Kerro, millainen on mielestäsi hyvä asuinalue.",
      hints: [
        "Mitä alueella täytyy olla, jotta se olisi hyvä asuinalue?",
        "Mitä palveluita hyvällä asuinalueella on?",
        "Millaiset liikenneyhteydet ovat hyvät?",
        "Mikä tekee asuinalueesta hyvän?",
        "Mikä on sinulle tärkeää, kun valitset asuinaluetta?",
      ],
    },
    {
      title: "Naapurit",
      prompt: "Kerro suhteestasi naapureihin.",
      hints: [
        "Tunnetko naapurisi?",
        "Onko sinulle tärkeää tutustua naapureihin?",
        "Onko sinulla joskus ollut erityisen hyvä tai erityisen huono naapuri?",
        "Miksi hän oli hyvä tai huono naapuri?",
        "Mitä taloyhtiöt voivat tehdä, jotta naapurit oppisivat tuntemaan toisensa paremmin ja asuinalueet olisivat yhteisöllisempiä?",
      ],
    },
  ],
  "Kauppa ja palvelut": [
    {
      title: "Tärkeä palvelu tai yritys",
      prompt: "Kerro sinulle tärkeästä palvelusta tai yrityksestä.",
      hints: [
        "Missä se sijaitsee?",
        "Kuinka usein käyt siellä tai käytät palvelua?",
        "Miksi se on sinulle tärkeä?",
        "Mikä on paras asia tässä paikassa? Miksi?",
      ],
    },
    {
      title: "Huono kokemus asiakaspalvelusta",
      prompt: "Kerro asiakaspalvelutilanteesta, joka meni jollain tavalla pieleen.",
      hints: [
        "Mitä tapahtui? Miksi kokemus oli huono?",
        "Mitä asiakaspalvelun olisi pitänyt tehdä toisella tavalla?",
      ],
    },
    {
      title: "Arkeni palvelut",
      prompt: "Kerro asuinalueesi palveluista.",
      hints: [
        "Missä kaupoissa käyt tai mitä palveluita käytät säännöllisesti?",
        "Mitä palveluita asuinalueellasi on?",
        "Puuttuuko jotain? Mitä palveluita käytät verkossa?",
        "Mitkä palvelut ovat sinulle kaikkein tärkeimpiä? Miksi?",
        "Mitä palveluita pitäisi olla jokaisen kodin lähellä?",
      ],
    },
  ],
  Kulttuuri: [
    {
      title: "Julkkis",
      prompt: "Kerro sinulle tärkeästä julkkiksesta eli julkisuuden henkilöstä.",
      hints: [
        "Kuka hän on? Mitä hän tekee? Miksi hän on kuuluisa?",
        "Ketkä ovat hänen fanejaan? Miksi hän on sinulle tärkeä?",
        "Pitäisikö muidenkin ihmisten seurata häntä? Miksi?",
      ],
    },
    {
      title: "Juhla",
      prompt: "Kerro sinulle tärkeästä juhlasta.",
      hints: [
        "Mikä juhla se on? Milloin, miten ja miksi tätä juhlaa vietetään?",
        "Miten itse vietät tätä juhlaa?",
        "Miksi se on sinulle tärkeä?",
        "Kenelle muulle se on tärkeä juhla?",
        "Millainen historia ja yhteiskunnallinen merkitys tällä juhlalla on?",
      ],
    },
    {
      title: "Viihde",
      prompt:
        "Kerro elokuvasta, tv-ohjelmasta, kirjasta, radio-ohjelmasta tai podcastista, jonka parissa viihdyt.",
      hints: [
        "Millainen se on?",
        "Mistä se kertoo?",
        "Milloin katsot, kuuntelet tai luet sitä?",
        "Miksi se on sinulle tärkeä?",
        "Kenelle suosittelisit sitä?",
      ],
    },
  ],
  Matkustaminen: [
    {
      title: "Tärkeä matka",
      prompt: "Kerro sinulle tärkeästä matkasta.",
      hints: [
        "Mistä mihin matkustit ja milloin?",
        "Miksi matkustit?",
        "Kenen kanssa matkustit?",
        "Millainen matka oli?",
        "Miksi matka oli sinulle tärkeä?",
      ],
    },
    {
      title: "Matkustamisen merkitys minulle",
      prompt: "Kerro, mitä matkustaminen merkitsee sinulle.",
      hints: [
        "Matkustatko usein vapaa-ajalla tai töissä? Miksi yleensä matkustat?",
        "Millä kulkuvälineellä matkustat mieluiten?",
        "Pidätkö matkustamisesta? Miksi?",
        "Mitä hyviä ja huonoja puolia matkustamisessa on sinulle? Entä muille ihmisille?",
      ],
    },
    {
      title: "Lomamatka, joka meni pieleen",
      prompt: "Kerro lomamatkasta, joka meni jollain tavalla pieleen.",
      hints: [
        "Miksi lomamatka oli epäonnistunut?",
        "Milloin matkustit, mihin ja kenen kanssa?",
        "Mitä ongelmia matkalla oli? Miten ongelmat olisi voinut korjata?",
        "Matkustaisitko tähän paikkaan uudestaan? Miksi?",
      ],
    },
  ],
  "Terveys ja hyvinvointi": [
    {
      title: "Hyvinvoinnista huolehtiminen",
      prompt: "Kerro, miten pidät huolta hyvinvoinnistasi.",
      hints: [
        "Miten pidät huolta hyvinvoinnistasi?",
        "Mikä auttaa sinua voimaan hyvin?",
        "Haluaisitko muuttaa elämäntapojasi jotenkin? Miksi?",
      ],
    },
    {
      title: "Suomalainen terveydenhuolto",
      prompt: "Kerro omista kokemuksistasi suomalaisessa terveydenhuollossa.",
      hints: [
        "Oletko käynyt Suomessa esimerkiksi lääkärissä, neuvolassa tai apteekissa? Millainen kokemus se oli?",
        "Oletko huomannut eroja suomalaisen terveydenhuollon ja muiden sinulle tuttujen maiden välillä? Millaisia?",
      ],
    },
    {
      title: "Hyvä lääkäri",
      prompt: "Kerro, millainen on mielestäsi hyvä lääkäri.",
      hints: [
        "Onko sinulla joskus ollut erityisen hyvä lääkäri? Miksi hän oli mielestäsi hyvä lääkäri?",
        "Millainen on mielestäsi hyvä lääkäri? Mitä hän tekee?",
        "Millainen ihminen hän on? Mitä hän ei tee?",
        "Mitä tarvitaan, jotta lääkäri voi tehdä työnsä hyvin?",
      ],
    },
  ],
  Työ: [
    {
      title: "Hyvä esihenkilö",
      prompt: "Kerro, millainen on mielestäsi hyvä esihenkilö.",
      hints: [
        "Onko sinulla tai läheiselläsi joskus ollut erityisen hyvä esihenkilö? Millainen ihminen hän oli?",
        "Millaisia asioita hyvä esihenkilö tekee?",
        "Millaiset ihmiset ovat yleensä hyviä esihenkilöitä?",
        "Mitkä ominaisuudet tekevät ihmisestä hyvän esihenkilön? Miksi?",
      ],
    },
    {
      title: "Tärkeä työ tai työpaikka",
      prompt: "Kerro työstä tai työpaikasta, joka on sinulle tärkeä.",
      hints: [
        "Onko sinulla tai läheiselläsi joskus ollut työ tai työpaikka, joka oli sinulle erityisen tärkeä?",
        "Mitkä työt tai ammatit ovat sinulle erityisen tärkeitä? Miksi?",
        "Millaista on mielestäsi tärkeä työ?",
      ],
    },
    {
      title: "Unelma-ammatti tai -työpaikka",
      prompt: "Kerro, millainen on unelmatyöpaikkasi.",
      hints: [
        "Millainen työ sopii sinulle?",
        "Millaisesta työstä pidät?",
        "Millaisessa ympäristössä haluat olla töissä?",
        "Haluatko työskennellä esimerkiksi toimistossa, ulkona, sairaalassa tai kahvilassa? Miksi?",
        "Jos voisit valita itsellesi minkä tahansa ammatin tai työpaikan, minkä valitsisit? Miksi?",
      ],
    },
  ],
  Ympäristö: [
    {
      title: "Tärkeä paikka luonnossa",
      prompt: "Kerro sinulle tärkeästä paikasta luonnossa.",
      hints: [
        "Millainen paikka se on? Miksi se on sinulle tärkeä?",
        "Mitä teet siellä?",
        "Mitä tämä paikka merkitsee sinulle?",
      ],
    },
    {
      title: "Luonnon merkitys",
      prompt: "Kerro, mitä luonto merkitsee sinulle.",
      hints: [
        "Vietätkö paljon aikaa luonnossa?",
        "Onko sinulla harrastuksia, joita harrastat luonnossa tai muuten ulkona? Millaisessa paikassa asut?",
        "Millaiset mahdollisuudet sinulla on liikkua luonnossa?",
        "Haluaisitko asua lähellä luontoa, jos voisit valita vapaasti?",
        "Tykkäätkö olla lähellä luontoa?",
      ],
    },
    {
      title: "Lemmikit",
      prompt: "Kerro, mitä lemmikit merkitsevät sinulle.",
      hints: [
        "Onko sinulla lemmikki, tai onko sinulla joskus ollut sellainen? Millainen lemmikki sinulla on tai on ollut?",
        "Onko perheelläsi tai ystävilläsi lemmikkejä? Millaisia lemmikkejä?",
        "Onko jonkun toisen ihmisen lemmikkieläin joskus ärsyttänyt tai häirinnyt sinua? Miksi?",
        "Haluaisitko lemmikin? Miksi? Miksi et?",
        "Pidätkö eläimistä? Haluatko viettää aikaa niiden kanssa?",
      ],
    },
  ],
  Yhteiskunta: [
    {
      title: "Suomeen muuttaminen",
      prompt: "Kerro siitä, kun muutit Suomeen.",
      hints: [
        "Milloin muutit Suomeen tai haluaisitko muuttaa Suomeen? Miksi?",
        "Millaista Suomeen muuttaminen oli tai millaista odotat sen olevan?",
        "Mikä oli tai on helppoa tai vaikeaa muuttamisessa?",
        "Mitä olisit halunnut tietää tai mitä haluaisit tietää ennen Suomeen muuttamista?",
      ],
    },
    {
      title: "Kieleni suomalaisessa yhteiskunnassa",
      prompt: "Kerro, mitä kieliä puhut arjessasi.",
      hints: [
        "Mitä kieliä puhut Suomessa?",
        "Puhutko eri ihmisten kanssa ja eri tilanteissa eri kieliä?",
        "Oletko joskus käyttänyt tulkkia? Missä tilanteessa?",
        "Mitä kieltä tai mitä kieliä puhut silloin, kun asioit eri viranomaisten kanssa?",
        "Miten kommunikaatio eri viranomaisten kanssa on sujunut?",
      ],
    },
    {
      title: "Kokemukseni koulusta Suomessa ja muualla",
      prompt: "Kerro kokemuksiasi eri maiden koulutusjärjestelmistä.",
      hints: [
        "Minkä ikäisenä aloitit koulun?",
        "Missä kävit koulua?",
        "Minkä ikäisenä koulu yleensä aloitetaan maassa, jossa aloitit koulun? Onko se myöhemmin vai aikaisemmin kuin Suomessa?",
        "Kuinka kauan lapset yleensä käyvät koulua maassa, jossa itse kävit koulua?",
        "Millaisia kokemuksia sinulla on suomalaisesta koulutusjärjestelmästä?",
        "Mitä eroja ja yhtäläisyyksiä on suomalaisen koulutusjärjestelmän ja muiden maiden koulutusjärjestelmien välillä?",
      ],
    },
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
    return SPEAKING_KERTOMINEN[topic].map((item, i) => {
      const index = i + 1;
      return {
        id: `sp-${slug}-kertominen-${index}`,
        skill: "speaking",
        topic,
        taskKind: "kertominen",
        title: item.title,
        instructions:
          "Kerro aiheesta yhtäjaksoisesti. Voit tehdä muistiinpanoja valmistautumisen aikana, mutta älä kirjoita kokonaisia lauseita.",
        prompt: item.prompt,
        hints: [...item.hints],
        prep_time_seconds: 60,
        speak_time_seconds: 105,
      };
    });
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
