import json
import httpx
from app.config import settings


async def generate(prompt: str, model: str | None = None) -> str:
    model = model or settings.ollama_model_generate
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            f"{settings.ollama_base_url}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
        )
        resp.raise_for_status()
        return resp.json()["response"]


async def generate_json(prompt: str, model: str | None = None) -> dict:
    """Generate and parse a JSON response from Ollama."""
    raw = await generate(prompt, model)
    # Extract JSON block if wrapped in markdown
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()
    return json.loads(raw)


# ── Prompt builders ──────────────────────────────────────────────────────────

YKI_TOPICS = [
    "Minä ja taustani",
    "Koti ja asuminen",
    "Kauppa ja palvelut",
    "Kulttuuri",
    "Matkustaminen",
    "Terveys ja hyvinvointi",
    "Työ",
    "Ympäristö",
    "Yhteiskunta",
]


def speaking_generate_prompt(level: str, task_type: str, topic: str | None = None) -> str:
    import random
    chosen_topic = topic if topic in YKI_TOPICS else random.choice(YKI_TOPICS)
    base = (
        f"Olet YKI-suomen kielen koelaatija. Taso: {level}. "
        f"Aihe: {chosen_topic}. Palauta VAIN JSON, ei selityksiä.\n\n"
    )

    if task_type == "kertominen":
        return base + """\
Luo KERTOMINEN-tehtävä: kokelas puhuu yhtäjaksoisesti annetusta aiheesta 1,5–2 minuuttia.
Rakenne: pääotsikko + 4–5 apukysymystä bullet-pisteinä.

{
  "title": "Lyhyt konkreettinen aihe (esim. 'Kotini' tai 'Tärkein henkilö elämässäni')",
  "instructions": "Kerro aiheesta. Voit tehdä muistiinpanoja valmistautumisen aikana, mutta älä kirjoita kokonaisia lauseita.",
  "prompt": "PÄÄOTSIKKO ISOLLA",
  "hints": ["apukysymys 1?", "apukysymys 2?", "apukysymys 3?", "apukysymys 4?"],
  "prep_time_seconds": 60,
  "speak_time_seconds": 105
}"""

    if task_type == "keskustelu":
        return base + """\
Luo KESKUSTELU-tehtävä: simuloitu dialogi, jossa kokelas vastaa nauhoitettuihin vuorosanoihin.
TÄRKEÄÄ: Kaikki kysymykset JA otsikko TÄYTYY liittyä yllä annettuun aiheeseen. Älä kopioi esimerkkejä.
- Merkitse haastattelijan vuorosanot kolmella tähdellä: ***
- Lisää hakasulkeisiin ohje kokelaalle: [Vastaa myöntävästi] / [Kerro kokemuksistasi] jne.
- Tee 4–6 vuoroparia, vastaamisaikaa 20–30 sekuntia per vuoro

{
  "title": "Otsikko joka kuvaa annettua aihetta",
  "instructions": "Sinulle esitetään kysymyksiä. Vastaa luontevasti jokaiseen vuorosanaan. Käytä täytesanoja kuten tota, niinku.",
  "prompt": "*** [Avauskysymys annetusta aiheesta] [Ohje kokelaalle]\\n\\n*** [Toinen kysymys samasta aiheesta] [Ohje]\\n\\n*** [Kolmas kysymys] [Ohje]\\n\\n*** [Neljäs kysymys] [Ohje]",
  "hints": ["Kuuntele tarkkaan ennen kuin vastaat", "Voit käyttää konditionaalia: voisin, haluaisin"],
  "prep_time_seconds": 0,
  "speak_time_seconds": 30
}"""

    if task_type == "tilanne":
        return base + """\
Luo TILANNE-tehtävä: lyhyt spontaani reaktio sosiaaliseen tilanteeseen.
- Tilanne on konkreettinen ja arkinen (kauppa, lääkäri, naapuri, toimisto)
- Kokelaalla on 20 sekuntia lukea ja 10–30 sekuntia vastata

{
  "title": "Tilanteen otsikko (esim. 'Reklamaatio kaupassa')",
  "instructions": "Lue tilanne ja reagoi suomeksi luontevasti. Käytä tilanteen mukaista kohteliaisuutta.",
  "prompt": "Konkreettinen tilannekuvaus: missä olet, kenen kanssa puhut, mitä sinun pitää sanoa tai tehdä.",
  "hints": ["Käytä konditionaalia kohteliaisuuteen: voisitteko, saisinko"],
  "prep_time_seconds": 20,
  "speak_time_seconds": 30
}"""

    if task_type == "mielipide":
        return base + """\
Luo MIELIPIDE-tehtävä: kokelas perustelee kantansa annetusta yhteiskunnallisesta väittämästä.
- Väittämä on konkreettinen ja ajankohtainen
- Lisää 2–3 syventävää kysymystä jotka ohjaavat laajempaan pohdintaan

{
  "title": "Mielipidetehtävä",
  "instructions": "Lue väittämä ja mieti kantasi. Perustele mielipiteesi ja pohdi asiaa eri näkökulmista. Voit olla väittämän puolesta tai vastaan.",
  "prompt": "Väittämä: '...'\\n\\nPohdittavaksi: Miten tämä vaikuttaa yksilöön? Entä yhteiskuntaan? Onko muita ratkaisuja?",
  "hints": ["Aloita esittämällä oma kantasi selkeästi", "Anna konkreettisia esimerkkejä", "Pohdi myös vastakkaista näkökulmaa"],
  "prep_time_seconds": 120,
  "speak_time_seconds": 120
}"""

    # fallback
    return base + f"""Luo puhumiskoe tehtävä, tyyppi: {task_type}.
{{
  "title": "Otsikko", "instructions": "Ohjeet", "prompt": "Tehtävä",
  "hints": [], "prep_time_seconds": 60, "speak_time_seconds": 90
}}"""


def speaking_evaluate_prompt(
    transcript: str,
    task_type: str,
    level: str,
    task_prompt: str = "",
    turn_transcripts: list | None = None,
) -> str:
    if task_type == "keskustelu" and turn_transcripts:
        qa_lines = "\n".join(
            f"Kysymys {i+1}: {t['question']}\nVastaus {i+1}: {t['answer'] or '(ei vastausta)'}"
            for i, t in enumerate(turn_transcripts)
        )
        context = (
            f"Keskustelutehtävä — kysymys-vastaus-parit:\n{qa_lines}\n\n"
            "TÄRKEÄÄ: Arvioi VAIN kokelaan vastaukset (Vastaus 1, 2, …). "
            "Haastattelijan kysymykset ovat tehtävänantoa, ei kokelaan puhetta.\n"
        )
        # Only pass the user's answers to the transcript section
        eval_text = "\n".join(
            f"Vastaus {i+1}: {t['answer'] or '(ei vastausta)'}"
            for i, t in enumerate(turn_transcripts)
        )
    elif task_type == "keskustelu" and task_prompt:
        context = (
            f"Keskustelutehtävän rakenne (haastattelijan kysymykset):\n\"\"\"{task_prompt}\"\"\"\n"
            "Huom: Nauhoituksessa kuuluu VAIN kokelas. Arvioi vastauksia suhteessa yllä oleviin kysymyksiin.\n"
        )
        eval_text = transcript
    elif task_prompt:
        context = f"Tehtävä: {task_prompt}\n"
        eval_text = transcript
    else:
        context = ""
        eval_text = transcript

    return f"""Olet YKI-arvioija. Arvioi seuraava suomenkielinen puhesuoritus.
Tehtävätyyppi: {task_type}, taso: {level}
{context}
Kokelas puhuu:
\"\"\"{eval_text}\"\"\"

Palauta VAIN JSON-muodossa:
{{
  "score": 0-5,
  "levelEstimate": "A1|A2|B1|B2|C1",
  "feedback": {{
    "strengths": ["vahvuus1"],
    "improvements": ["kehityskohde1"],
    "grammarCorrections": [{{"original": "...", "corrected": "...", "explanation": "..."}}],
    "betterExpressions": [{{"original": "...", "better": "...", "explanation": "..."}}]
  }}
}}"""


def writing_generate_prompt(level: str, writing_type: str, topic: str | None = None) -> str:
    import random
    chosen_topic = topic if topic in YKI_TOPICS else random.choice(YKI_TOPICS)
    return f"""Olet YKI-suomen kielen koelaatija. Luo yksi kirjoitustehtävä tasolla {level}.
Kirjoitustyyppi: {writing_type}
Aihe: {chosen_topic}

Palauta VAIN JSON-muodossa:
{{
  "title": "Tehtävän otsikko",
  "instructions": "Ohjeet kokelaille",
  "prompt": "Kirjoitustehtävä",
  "min_words": 80,
  "max_words": 150
}}"""


def writing_evaluate_prompt(text: str, prompt_text: str, level: str) -> str:
    return f"""Olet YKI-arvioija. Arvioi seuraava kirjoitettu teksti.
Tehtävä: {prompt_text}
Taso: {level}

Teksti:
\"\"\"{text}\"\"\"

Arvioi seuraavat kriteerit ja palauta VAIN JSON:
{{
  "score": 0-5,
  "levelEstimate": "A1|A2|B1|B2|C1",
  "feedback": {{
    "grammar": "arvio kieliopista",
    "vocabulary": "arvio sanastosta",
    "register": "arvio rekisteristä",
    "structure": "arvio rakenteesta",
    "cohesion": "arvio sidoksisuudesta",
    "taskCompletion": "arvio tehtävän suorittamisesta",
    "corrections": [{{"original": "...", "corrected": "...", "explanation": "..."}}]
  }}
}}"""


def vocabulary_generate_prompt(level: str, theme: str) -> str:
    return f"""Olet suomen kielen opettaja. Luo 10 YKI-tasoista sanastoa.
Taso: {level}, Teema: {theme}

Palauta VAIN JSON-muodossa:
{{
  "words": [
    {{
      "word": "suomenkielinen sana",
      "translation": "englanninkielinen käännös",
      "example_sentence": "esimerkkilause suomeksi",
      "synonyms": "synonyymit pilkulla erotettuna"
    }}
  ]
}}"""
