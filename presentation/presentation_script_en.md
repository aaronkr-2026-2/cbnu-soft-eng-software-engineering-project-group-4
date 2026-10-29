# AI Language Village — Complete Presentation Script (English)

**Course:** Software Engineering Capstone Project  
**Team:** Group 4 (Chungbuk National University — CBNU)  
**Project Title:** AI Language Village: An Immersive 3D Virtual Environment for Spoken English Acquisition Powered by Autonomous Generative AI Agents  
**Target Duration:** 10–12 minutes + Live Demonstration & Q&A  

---

## Slide 1: Cover Slide & Title

### Slide Content:
- **Title:** AI Language Village
- **Subtitle:** Autonomous Generative AI NPCs in an Immersive 3D World for Real-Time Spoken English Acquisition
- **Institution:** Chungbuk National University (CBNU) · Software Engineering Capstone
- **Group:** Group 4
- **Tech Stack Badges:**
  - ⚛️ React 19
  - 🌐 Three.js & React Three Fiber
  - ⚡ Vite 8
  - 🧠 Groq Cloud API (`openai/gpt-oss-120b`)
  - 🎙️ Web Speech API (STT & TTS)
  - 🔥 Firebase Auth & Cloud Firestore

### Presenter Script (Verbal Delivery):
> *"Good morning, esteemed professors, evaluators, and fellow students. We are Group 4, and today we are thrilled to present our software engineering capstone project: **AI Language Village**.*  
> *AI Language Village is a browser-based, interactive 3D virtual environment designed to revolutionize how people acquire spoken English. Rather than tapping through multiple-choice questions or memorizing grammar rules in isolation, learners step into an open 3D village, explore real-world buildings, and hold spontaneous, hands-free voice conversations with intelligent AI characters—receiving comprehensive, diagnostic spoken feedback upon completing each mission.*  
> *Let us walk you through the motivation, architectural design, technical challenges, and live demonstration of our platform."*

---

## Slide 2: Executive Summary & Project Vision

### Slide Content:
- **Core Vision:** Bridging the chasm between passive grammar comprehension and active spoken fluency through low-stakes spatial immersion.
- **Key Engineering Pillars:**
  - 🏙️ **Embodied 3D Spatial Presence:** 12 interactive facilities across commercial, civic, healthcare, and academic districts.
  - 🤖 **Persona-Driven Generative Agents:** 12 distinct AI NPCs with prompt-engineered backstories, specialized vocabularies, and dynamic responses.
  - 🎙️ **Zero-Friction Voice Pipeline:** In-browser Web Speech STT, ultra-low-latency Groq LLM inference, and synchronized TTS avatar animations.
  - 📊 **Contextual Spoken Evaluation:** Specialized speaking examiner filtering speech-to-text noise while diagnosing real grammar, syntax, and politeness mistakes.
  - 🏆 **Gamified Learner Progression:** CEFR-aligned leveling (A1 to C1), dynamic XP algorithms, streak tracking, and interactive MiniMap radar.

### Presenter Script (Verbal Delivery):
> *"The vision behind AI Language Village is simple yet transformative: to eradicate the speaking barrier in language education. Most learners spend years studying vocabulary and grammar, yet freeze when asked to order coffee or report a lost item in English.*  
> *We solved this by synthesizing four foundational pillars: high-performance 3D spatial simulation in the browser, autonomous generative AI agents with unscripted dialogue capabilities, a real-time speech pipeline operating with sub-second latency, and an objective post-mission diagnostic examiner.*  
> *Together, these create an environment where learners can make mistakes freely, build genuine communicative confidence, and track their measurable progress."*

---

## Slide 3: The Problem: The "Silent English" Crisis

### Slide Content:
- **The Core Dilemma:** High test scores, zero conversational confidence.
- **Key Pain Points:**
  - 😰 **High Affective Filter & Speaking Anxiety:** 74% of language students cite fear of public embarrassment and peer judgment as their greatest impediment to speaking.
  - 📚 **Decontextualized Mobile Apps:** Platforms like Duolingo or Quizlet emphasize gamified flashcards and multiple-choice buttons. They completely lack spatial context and spontaneous discourse.
  - 💸 **Prohibitive Private Tutoring Costs:** 1-on-1 sessions with native English tutors cost $30–$60 per hour, making daily conversational practice economically out of reach for most students.
  - ⏳ **Lack of Safe, Repetitive Simulation:** Outside the classroom, learners rarely encounter low-stakes environments where they can repeatedly practice authentic daily scenarios.

### Presenter Script (Verbal Delivery):
> *"Why do so many students struggle to speak English despite years of formal education? Applied linguistics identifies two primary bottlenecks: the **Affective Filter** and **Decontextualization**.*  
> *When a student speaks to a human teacher or peer, psychological anxiety often triggers hesitation and fear of error. Meanwhile, popular language apps turn learning into casual mobile games with tap-to-select exercises—completely detached from real communicative pressure.*  
> *Private 1-on-1 tutors provide conversational practice, but at $30 to $60 an hour, daily immersion is impossible for the average student. Our project directly bridges this gap by creating an unlimited, accessible, judgment-free virtual training ground."*

---

## Slide 4: The Solution: Spatial Immersion + Conversational AI

### Slide Content:
- **Game Engine + Generative AI = An Anxiety-Free Speaking Sandbox**
- **How It Solves the Problem:**
  - 🎮 **Spatial Embodiment:** Navigating a 3D physical world activates cognitive spatial memory, anchoring vocabulary to situational visual contexts.
  - 🤖 **Dynamic Unscripted Dialogue:** Powered by Groq's ultra-fast LLM inference, NPCs do not follow rigid dialogue trees; they comprehend any natural phrasing and respond authentically.
  - 🛡️ **Psychological Safety:** AI characters never judge, grow impatient, or rush the user. Students can repeat scenarios dozens of times until fluent.
  - 🎯 **Task-Based Language Teaching (TBLT):** Every location provides an authentic mission objective—ordering specific foods, opening bank accounts, reporting lost belongings.
  - 📝 **Native Diagnostic Feedback:** Feedback is provided in the learner's native language (Uzbek/Korean), pinpointing exact spoken mistakes with corrected alternatives.

### Presenter Script (Verbal Delivery):
> *"Our solution combines game engine mechanics with cutting-edge conversational artificial intelligence. In AI Language Village, users inhabit a 3D avatar, stroll through city streets, and physically step inside buildings.*  
> *Research in cognitive science proves that spatial immersion dramatically enhances memory retention—when you physically walk into a cafe and speak to a barista, your brain attaches the dialogue to a spatial anchor.*  
> *Because our characters are powered by state-of-the-art LLMs rather than static script trees, the learner can speak naturally. And critically, because they are talking to an AI, the affective filter vanishes. They can stutter, make grammatical blunders, and retry without fear."*

---

## Slide 5: The User Journey & Core Gameplay Loop

### Slide Content:
- **The 5-Step Interaction Loop:**
  1. 🚶 **Open-World Exploration:** Navigate freely using WASD and mouse controls; track objectives with the HUD and real-time MiniMap radar.
  2. 🚪 **Facility Transition:** Approach any of the 12 village buildings and press `[E]` to seamlessly enter the indoor interior.
  3. 📜 **Mission Briefing:** Review the assigned situational task card (e.g., *"Ask about opening a savings account and inquire about international transfer fees"*).
  4. 💬 **Live Spoken Exchange:** Press `[F]` to activate voice recognition. Speak naturally into the microphone; the NPC listens, thinks, and responds with audio and synchronized talking animations.
  5. 🏆 **Diagnostic Evaluation & Progression:** Press `[E]` at the exit door; the AI Examiner analyzes the entire conversation, calculates an accuracy score, details errors, and awards XP.

### Presenter Script (Verbal Delivery):
> *"Let's examine the end-to-end user experience. The learner's journey follows five intuitive steps.*  
> *First, they explore the village using standard WASD movement and a smooth third-person camera, oriented by a live MiniMap radar. Second, approaching any doorway prompts an interaction key—pressing **E** smoothly transitions the camera indoors.*  
> *Third, a clear mission briefing card appears with a specific situational objective. Fourth, the student presses **F** to converse hands-free via microphone. The character reacts in real time with synthetic voice and synchronized mouth movement.*  
> *Finally, walking to the exit door triggers our intelligent Examiner, which delivers a thorough diagnostic performance report and awards experience points toward their next proficiency level."*

---

## Slide 6: Urban Architecture: 12 Interactive Facilities Across 4 Districts

### Slide Content:
- **Comprehensive Urban Simulation:**
  - 🏪 **Commercial District:**
    - *Village Shop:* Purchasing groceries, asking quantities, checking prices.
    - *Language Cafe:* Ordering coffee, custom milk/sugar preferences, pastry orders.
  - 🏛️ **Civic & Public Services:**
    - *Village Bank:* Account creation, international wire transfers, debit cards.
    - *Police Station:* Reporting stolen/lost property, filing statements, emergency numbers.
    - *Community Center:* Resident registration certificates, local community events.
  - 🏥 **Healthcare & Hospitality:**
    - *Village Hospital:* Doctor consultations, appointment booking, medical triage.
    - *Village Hotel:* Room reservations, check-in/check-out procedures, amenities.
  - 🎓 **Education & Career Campus:**
    - *Language School:* English proficiency classes, curriculum schedules, leveling.
    - *Study Center:* Tutoring sessions, study strategies, vocabulary acquisition tips.
    - *Career Support Center:* Job interview preparation, resume reviews, part-time work.
    - *Village Library:* Borrowing books, research guidance, library card issuance.
    - *Multi-Purpose Hall & Activity Center:* Community workshops, cultural activities.

### Presenter Script (Verbal Delivery):
> *"Rather than limiting our simulation to one or two basic stores, we engineered a complete village infrastructure consisting of 12 distinct facilities grouped into four specialized districts.*  
> *The Commercial District covers everyday commerce at the shop and cafe. The Civic District prepares learners for administrative realities—handling banking transactions, filing a police report for a lost phone, or registering at a community center.*  
> *The Healthcare and Hospitality District covers vital travel and emergency situations like medical triage and hotel reservations. Finally, the Education and Career Campus prepares students for professional life, including job interview simulations and academic tutoring.*  
> *Each facility features custom 3D interiors, dedicated lighting, and collision boundaries."*

---

## Slide 7: Character Personas & Autonomous AI Agents

### Slide Content:
- **12 Tailored AI Personas with Distinct Personalities:**
  - 🏪 **Jack (Shopkeeper):** Cheerful, fast-paced, checks stock, suggests items.
  - ☕ **Mia (Barista):** Warm, inviting, asks about coffee roasts, sizes, and snacks.
  - 🏨 **Emma (Hotel Receptionist):** Polished, hospitable, details room types and amenities.
  - 🏥 **Sarah (Hospital Receptionist):** Calm, empathetic, assists with triage and doctors.
  - 🏦 **David (Bank Officer):** Professional, precise financial terminology, explains fees.
  - 👮 **Officer Alex (Police Officer):** Structured, reassuring, collects incident details.
  - 🏫 **Teacher Olivia (Language Teacher):** Patient, articulates clearly, pedagogical focus.
  - 📖 **Tutor Daniel (Study Mentor):** Analytical, provides actionable language study habits.
  - 💼 **James (Career Advisor):** Encouraging, conducts mock interview questioning.
  - 📚 **Emily (Librarian):** Quiet, organized, guides catalog searches and book loans.
  - 🏛️ **Mina & Yuri / Hana (Community Staff):** Informative, explains municipal services.
- **Prompt Engineering Architecture:** Constrained system prompts, conversational memory buffer (last 4 turns), zero markdown leakage, natural spoken sentence length (1–2 sentences).

### Presenter Script (Verbal Delivery):
> *"Every building in AI Language Village is staffed by an autonomous AI agent with a custom-engineered persona.*  
> *For example, Jack in the village shop is energetic and casual, while David at the bank uses precise, professional banking vocabulary. Sarah at the hospital speaks with calm empathy, and James at the career center challenges the user with realistic job interview questions.*  
> *Through careful system prompt engineering, each agent is constrained to 1 to 2 conversational sentences, avoiding overwhelming blocks of text. We maintain a rolling 4-message context memory buffer so characters recall what the user just said while keeping inference latency under 600 milliseconds."*

---

## Slide 8: Task-Based Learning & 48+ Situational Missions

### Slide Content:
- **Pedagogical Alignment:** Task-Based Language Teaching (TBLT) mapped to CEFR Levels (A1 to C1).
- **Curated Mission Examples Across Levels:**
  - 🟢 **A1–A2 (Beginner):**
    - *Shop:* "Buy exactly 2 bottles of water and 1 apple."
    - *Cafe:* "Order 1 hot Americano and 1 croissant with milk on the side."
  - 🟡 **B1 (Intermediate):**
    - *Hotel:* "Book a single room for two nights and inquire what time breakfast is served."
    - *Bank:* "Ask about opening a checking account and what identification documents are required."
    - *Police:* "Report a lost black smartphone and ask how to obtain an official police report."
  - 🔴 **B2–C1 (Upper Intermediate / Advanced):**
    - *Career Center:* "Explain your past work experience, answer interview questions, and ask about job training programs."
    - *Study Center:* "Discuss your language learning challenges and request a personalized weekly study schedule."
- **Dynamic Scenario Generation:** Extensible JSON mission matrices allow instructors to add hundreds of new scenarios without modifying code.

### Presenter Script (Verbal Delivery):
> *"To ensure pedagogical rigor, all interactions are structured around the Task-Based Language Teaching methodology and aligned with the Common European Framework of Reference for Languages (CEFR).*  
> *Rather than engaging in aimless small talk, the learner is challenged with over 48 structured situational missions ranging from beginner A1 to advanced C1.*  
> *At beginner levels, tasks focus on everyday transactions like ordering food and specifying quantities. At intermediate levels, students must navigate administrative procedures such as opening a bank account or filing a police statement. At advanced levels, they tackle complex communicative goals like answering behavioral job interview questions.*  
> *Instructors can easily add or customize missions through modular JSON configuration files."*

---

## Slide 9: The End-to-End Real-Time AI & Voice Pipeline

### Slide Content:
```
[User Spoken Voice]
       │
       ▼ (Continuous Audio Stream)
[Web Speech API: SpeechRecognition (en-US)]
       │
       ▼ (Transcribed Spoken Text)
[App State Controller (App.jsx)]
       │ (Combines: System Prompt + History Buffer + Mission Goal)
       ▼
[Groq Cloud LLM API: openai/gpt-oss-120b] (Avg Latency: ~480ms)
       │
       ▼ (Natural Spoken English Response)
┌──────────────────────┴──────────────────────┐
▼                                             ▼
[Web Speech API: SpeechSynthesis]    [3D Avatar Animation Hook]
(Audio Output via System Speaker)    (isTalking = true, Head/Mouth Sync)
```
- **Performance Highlights:**
  - Sub-600ms round-trip latency from speech end to NPC audio playback.
  - Zero server hosting overhead for audio capture or speech synthesis.
  - Resilient API error handling with automated fallback dialogues.

### Presenter Script (Verbal Delivery):
> *"Now let's examine the technical heart of our system: the multimodal AI pipeline.*  
> *When the user speaks into their microphone, the browser's native Web Speech Recognition API converts audio into text in real time. This text is packaged with the NPC's system prompt and the recent conversational history.*  
> *We selected Groq Cloud API running the massive `gpt-oss-120b` open-source model. Because Groq uses specialized Tensor Streaming Processor hardware, inference takes less than 500 milliseconds—an order of magnitude faster than conventional cloud LLMs.*  
> *The generated text is immediately converted to speech via the browser's SpeechSynthesis engine while simultaneously triggering a reactive 3D animation hook on the character's skeletal model, creating realistic mouth and head movement synchronized with the voice."*

---

## Slide 10: Intelligent Spoken Language Examiner

### Slide Content:
- **Speech-to-Text Aware Diagnostic Rubric:**
  - 🎙️ **Zero Penalty for STT Artifacts:** Microphones do not output capital letters or punctuation marks (e.g. *"i want to buy two apples"*). The examiner explicitly disregards casing and punctuation, preventing false negatives.
  - 🎯 **Mission Goal Validation:** Validates whether the student successfully negotiated all required items, quantities, and queries.
  - 🔍 **Syntactic & Lexical Error Analysis:** Detects genuine subject-verb disagreement, incorrect pluralization, awkward collocations, and lack of courtesy markers.
- **Strict JSON Response Schema:**
  ```json
  {
    "score": 88,
    "completed": true,
    "mistakes": [
      "Siz aytdingiz: 'give me two apple' ➔ To'g'risi: 'Could I have two apples, please?' (Izoh: ko'plikda -s qo'shiladi, so'rov muloyimroq bo'ladi)"
    ],
    "feedback": "Vazifani a'lo darajada bajardingiz! Muloyim iboralardan foydalanishda davom eting."
  }
  ```
- **Pedagogical Feedback Structure:** *Spoken Utterance* ➔ *Natural Native-like Correction* ➔ *Grammar Rule Explanation in Learner's Language*.

### Presenter Script (Verbal Delivery):
> *"A critical innovation of our project is the Intelligent Spoken Language Examiner.*  
> *Standard grammar tools like Grammarly fail catastrophically on spoken transcripts because speech-to-text algorithms omit capital letters and periods. An ordinary AI examiner would unfairly deduct points for lowercase letters.*  
> *We engineered a dedicated evaluation prompt with a temperature of 0.2 that strictly ignores casing and punctuation. It focuses purely on authentic spoken grammar, vocabulary appropriateness, and whether the mission goals were met.*  
> *The output is returned as pure JSON, presenting the student with an objective score from 0 to 100, a completion badge, and detailed error cards explaining what they said, what a native speaker would say, and the grammatical reasoning in their native language."*

---

## Slide 11: Gamification, Authentication & Learner Progression

### Slide Content:
- **Cloud-Backed Student Progress Architecture:**
  - 🔐 **Firebase Authentication:** Secure email/password login, automatic session restoration, and cross-session persistence.
  - 🎯 **Onboarding & Level Placement:** Self-selected CEFR target levels (A1 to C1), study motivations, and avatar customization.
  - ⚡ **Dynamic XP & Leveling Engine:**
    - Base mission completion XP (50 XP).
    - Accuracy score multiplier (up to +100 XP for scores ≥ 90%).
    - Streak bonuses for continuous daily engagement.
  - 🗺️ **Interactive MiniMap Radar:** Live top-down 2D radar displaying player coordinates, orientation heading, 12 facility landmarks, and click-to-teleport capabilities.
  - 📊 **Comprehensive Progress Panel Modal:** Detailed analytics showing overall average score, facility mastery percentages, total XP, current CEFR rank, and a chronological archive of past mistakes for targeted review.

### Presenter Script (Verbal Delivery):
> *"To ensure long-term retention and motivation, we implemented a full gamification and cloud profile infrastructure.*  
> *Upon first signing in via Firebase Auth, the learner completes an onboarding questionnaire selecting their current proficiency level, study goals, and character avatar.*  
> *Every completed mission calculates dynamic experience points based on accuracy and task complexity, driving progress along an exponential leveling curve. An interactive top-down MiniMap tracks the player's real-time position and allows quick-travel across districts.*  
> *Learners can open their Progress Dashboard at any moment to view overall mastery, check their streak, and review their personal mistake history—creating an ideal loop for spaced repetition."*

---

## Slide 12: System Architecture & Technical Stack

### Slide Content:
- **Three-Tier Modular Architecture:**
  - **Tier 1: UI & Presentation Layer (React 19 & HTML5 Overlay):**
    - HUD navigation, real-time MiniMap radar, mission prompt cards, floating dialogue window, diagnostic evaluation modal, progress panel.
  - **Tier 2: Core State & Simulation Controller (`App.jsx`):**
    - Centralized location management, dialog state machine, camera focus points, proximity triggers, Groq API client, STT/TTS coordination.
  - **Tier 3: 3D Scene Graph (Three.js & React Three Fiber):**
    - `VillageCanvas`, procedural road/sidewalk grids, directional lighting with optimized shadow bias, vehicular traffic loop, 12 building components with AABB collision boxes.
  - **Tier 4: Cloud & Multimodal Infrastructure:**
    - Groq Cloud API (`openai/gpt-oss-120b`), Web Speech API, Firebase Auth & Firestore.

### Presenter Script (Verbal Delivery):
> *"AI Language Village is built upon a clean, decoupled four-tier architecture.*  
> *At the top is the UI Overlay built in React 19, managing the HUD, dialogue cards, and progress modals without blocking 3D rendering.*  
> *At the center is our App State Controller, which coordinates player positions, proximity thresholds, dialogue state machines, and API calls.*  
> *Beneath that is the 3D Scene Graph running on Three.js and React Three Fiber. It handles our environment meshes, moving car traffic, building geometries, and a custom GTA-style third-person camera controller.*  
> *Finally, our cloud tier connects to Groq for ultra-low latency intelligence and Firebase for cloud persistence. Everything runs directly inside modern web browsers with zero installation."*

---

## Slide 13: Technical Challenges Overcome & Engineering Highlights

### Slide Content:
- **Key Engineering Hurdles & Solutions:**
  - 🛠️ **Challenge 1: STT Transcription Anomalies vs. Strict LLM Grading**
    - *Problem:* Web speech omits capital letters and commas; LLMs flagged lowercase words as spelling errors.
    - *Solution:* Engineered a zero-penalty spoken rubric instructing the examiner model to evaluate solely spoken syntax and lexical semantics.
  - 🛠️ **Challenge 2: LLM JSON Hallucinations & Markdown Backticks**
    - *Problem:* Cloud LLMs occasionally wrap JSON in markdown blocks (` ```json `), crashing standard `JSON.parse()`.
    - *Solution:* Implemented multi-stage regex sanitization with resilient schema validation and automatic fallback structures.
  - 🛠️ **Challenge 3: Seamless Outdoor-to-Indoor Camera Navigation**
    - *Problem:* Moving between open village streets and tight facility interiors caused camera clipping and disorientation.
    - *Solution:* Created a dual-mode camera controller that lerps spherical coordinates (radius, theta, phi) smoothly based on active location bounds.
  - 🛠️ **Challenge 4: 3D Model Performance & Asset Footprint**
    - *Problem:* Rendering 12 facilities, interior furniture, cars, and animated avatars risked severe frame drops on low-end hardware.
    - *Solution:* Implemented geometric instancing for traffic vehicles, tuned `shadow-bias` to prevent shadow acne, and leveraged React `Suspense` for asynchronous asset streaming.

### Presenter Script (Verbal Delivery):
> *"During development, our team solved several challenging technical engineering problems.*  
> *First, we resolved the STT anomaly issue by decoupling spoken grammar evaluation from typographic conventions, ensuring fair and accurate scoring.*  
> *Second, because LLMs occasionally wrap JSON in markdown code blocks, we engineered a regex extraction pipeline that guarantees parse safety even if the model hallucinates formatting.*  
> *Third, transitioning a 3D camera from open outdoor roads into tight indoor shop spaces often causes clipping through walls. We resolved this with a spherical coordinate interpolation algorithm that smoothly transitions camera distance and angles.*  
> *Finally, we optimized 3D rendering performance using geometry instancing and React Suspense, maintaining a steady 60 frames per second on standard consumer laptops."*

---

## Slide 14: Project Metrics & Quantitative Milestones

### Slide Content:
- **Key Codebase & Performance Statistics:**
  - 💻 **2,400+ Lines** of high-performance state & simulation code in `App.jsx`.
  - 🧱 **26 Modular 3D Components** built with Three.js & React Three Fiber.
  - 🏛️ **12 Fully Modeled Interactive Facilities** with dedicated interiors and exteriors.
  - 🤖 **12 Unique Autonomous AI Personas** with specialized system prompts.
  - 🎯 **48+ Structured CEFR Situational Missions** spanning levels A1 to C1.
  - ⚡ **~480ms Average LLM Round-Trip Latency** via Groq Cloud API.
  - 🎮 **Solid 60 FPS** WebGL rendering performance on modern browsers.
  - 💰 **$0 Audio Infrastructure Cost** by leveraging native browser Web Speech API.

### Presenter Script (Verbal Delivery):
> *"Looking at the project by the numbers: our codebase encompasses over 2,400 lines of core simulation logic, 26 modular 3D components, 12 fully modeled facilities, and 12 distinct AI agents.*  
> *We have mapped out over 48 structured situational missions. In performance benchmarks, our Groq LLM integration delivers answers in approximately 480 milliseconds—well below the human threshold for conversational awkwardness.*  
> *The 3D canvas maintains a consistent 60 frames per second, and because we utilized the native Web Speech API, audio processing carries zero external cloud server expense."*

---

## Slide 15: Product Roadmap & Future Milestones

### Slide Content:
- **The Evolution Path:**
  - ✅ **Phase 1: Foundation & Core Experience (Completed / Current)**
    - 3D Village open world, 12 facilities, 12 AI NPCs, hands-free voice STT/TTS, AI Examiner, Firebase Auth, and XP progress tracking.
  - 🚀 **Phase 2: Phonetic Analysis & Social Co-Op (Q2 2027)**
    - Phoneme-level pronunciation scoring using the WebAudio API; peer-to-peer multiplayer conversational co-op in 3D.
  - 🔒 **Phase 3: Security & Performance Optimization (Q3 2027)**
    - Serverless backend API proxy for token protection; Draco/Meshopt 3D compression reducing asset payload under 50 MB; Mobile PWA support.
  - 🏫 **Phase 4: Institutional & Multi-Language Deployment (Q4 2027)**
    - Teacher analytics dashboard for university courses; custom curriculum scenario builder; expansion into learning Korean, Japanese, and Spanish.

### Presenter Script (Verbal Delivery):
> *"Looking toward the future, our development roadmap is structured into four strategic phases.*  
> *Phase 1 is complete: we have a fully functional 3D world with 12 facilities, intelligent voice dialogue, automated evaluation, and cloud persistence.*  
> *In Phase 2, we plan to implement phoneme-level pronunciation scoring using the WebAudio API, along with multiplayer roleplay so students can practice together.*  
> *In Phase 3, we will deploy a serverless security proxy for API protection and compress 3D assets via Draco compression for instant loading on mobile browsers.*  
> *Finally, in Phase 4, we aim to deliver an institutional dashboard for university language departments and expand our curriculum to support foreign students learning Korean and Japanese."*

---

## Slide 16: Conclusion & Live Demonstration

### Slide Content:
- **AI Language Village: Speaking Practice Without Fear.**
- **Key Takeaways:**
  - 🌟 Transforms passive vocabulary memorization into active, embodied spatial conversation.
  - ⚡ Ultra-low latency conversational AI eliminates hesitation and builds real-world confidence.
  - 📈 Actionable diagnostic feedback in the learner's native tongue accelerates proficiency.
- **Live Demo Sequence:**
  1. Login & Onboarding Profile
  2. Village Exploration & MiniMap Radar Navigation
  3. Cafe & Career Center Mission Walkthrough
  4. Live Spoken Voice Exchange with Mia & James
  5. Automated Spoken Evaluation Report & XP Gain
- **GitHub Repository & Local Run Command:**
  - `$ npm install && npm run dev`
- **Thank You! Questions & Discussion 🙌**

### Presenter Script (Verbal Delivery):
> *"In conclusion, AI Language Village demonstrates how software engineering, 3D graphics, and modern generative AI can converge to solve one of the most persistent challenges in global education: the confidence gap in spoken language.*  
> *By providing students with an immersive, responsive, and completely judgment-free environment, we make fluency attainable for everyone, anywhere, at any time.*  
> *Now, we would like to invite you into the village for a live interactive demonstration. We will walk up to the cafe, order in English using the microphone, and examine the real-time AI evaluation report.*  
> *Thank you for your time and attention. We now welcome any questions you may have."*

---

## Evaluator Q&A Preparation Guide

### Anticipated Questions & Answers:

1. **Q: Why did you choose the Web Speech API over server-side speech recognition like Whisper?**  
   *A:* The Web Speech API executes locally inside the browser. This eliminates network audio upload latency (saving 1.5–2 seconds per round trip), produces zero hosting bandwidth costs, and guarantees user privacy since raw voice data never leaves the client's device. For future phases where phonetic accuracy is paramount, we plan to offer a hybrid option with Whisper.

2. **Q: How does the AI examiner handle pronunciation or accents?**  
   *A:* Currently, the Web Speech API's acoustic model transcribes speech based on standard English phonetic dictionaries. If pronunciation is severely impaired, transcription fails or produces garbled text, which our examiner flags. In Phase 2, we are integrating the WebAudio API to analyze pitch, duration, and formant contours for dedicated phoneme-level pronunciation feedback.

3. **Q: What prevents the LLM from outputting offensive or inappropriate content to students?**  
   *A:* We implement a dual defense layer. First, each NPC prompt has strict system role constraints prohibiting non-educational topics and enforcing polite conversational etiquette. Second, we keep `temperature` at 0.8 for roleplay and 0.2 for evaluation, minimizing hallucination while keeping characters focused solely on their assigned facility tasks.

4. **Q: What happens if a user speaks in a language other than English?**  
   *A:* The Web Speech API is explicitly initialized with `lang: 'en-US'`. If the user speaks another language, the speech recognizer either filters it out as noise or produces low-confidence phonemes that prompt the NPC to politely say: *"I'm sorry, I didn't quite catch that. Could you please repeat that in English?"*
