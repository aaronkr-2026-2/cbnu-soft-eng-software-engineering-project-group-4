# AI Language Village — Taqdimot matni

Har bir slayd uchun ikki qism bor:
- **Slaydda** — ekranda yozilgan matn
- **Gapiriladi** — taqdimot paytida aytiladigan nutq (taxminan 30–60 soniya)

Umumiy davomiyligi: taxminan 8–10 daqiqa + demo.

---

## 1-slayd. Muqova

**Slaydda:**
- Software Engineering · Group 4
- **AI Language Village**
- 3D qishloqda sun'iy intellekt NPC'lar bilan jonli ovozli suhbat orqali ingliz tilini o'rganish platformasi.
- React Three Fiber · Groq LLM · Speech-to-Text · Text-to-Speech

**Gapiriladi:**
> Assalomu alaykum! Biz 4-guruhmiz va bugun sizga **AI Language Village** loyihamizni taqdim etamiz. Bu — brauzerda ishlaydigan 3D o'yin bo'lib, unda foydalanuvchi sun'iy intellektga ega personajlar bilan ingliz tilida jonli, ovozli suhbat qiladi va oxirida o'z nutqi bo'yicha baho oladi.

---

## 2-slayd. Muammo

**Slaydda:** Til o'rganuvchilar gapirishdan qo'rqishadi
- 😰 **Amaliyot yetishmaydi** — Grammatikani bilish mumkin, lekin real vaziyatda (do'kon, kafe) gapirish imkoniyati juda kam.
- 📚 **Zerikarli darsliklar** — Odatiy ilovalar test va kartochkalardan iborat — kontekst va immersiya yo'q.
- 🧑‍🏫 **Qimmat repetitor** — Shaxsiy fikr-mulohaza olish uchun ustoz kerak — bu qimmat va har doim ham mavjud emas.

**Gapiriladi:**
> Ko'pchilik ingliz tili grammatikasini biladi, lekin gapirishga kelganda qiynaladi. Sababi — amaliyot yo'q. Mavjud ilovalar asosan test va so'z kartochkalaridan iborat, real hayotiy vaziyat yo'q. Xatolarni tushuntirib beradigan repetitor esa qimmat. Biz shu muammoni hal qilmoqchi bo'ldik.

---

## 3-slayd. Yechim

**Slaydda:** O'yin + AI = xavfsiz amaliyot maydoni
- 🏘️ **Immersiv 3D qishloq** — Foydalanuvchi o'z personaji bilan ko'cha, do'kon va kafe bo'ylab erkin yuradi.
- 🤖 **AI NPC'lar** — Sotuvchi Jack va barista Mia har qanday savolga tabiiy ingliz tilida javob beradi.
- 🎯 **Missiyalar** — Har bir binoda aniq vazifa, masalan: "2 ta suv va 1 ta olma sotib oling".
- 📊 **O'zbek tilida baholash** — Chiqishda AI suhbatni tahlil qiladi: ball, xatolar va to'g'ri variantlar.

**Gapiriladi:**
> Bizning yechimimiz — o'yin va sun'iy intellektni birlashtirish. Foydalanuvchi 3D qishloqda yuradi, do'kon yoki kafega kiradi va u yerdagi AI personaj bilan gaplashadi. Har bir joyda aniq missiya bor. Eng muhimi — chiqishda AI suhbatni tahlil qilib, xatolarni **o'zbek tilida** tushuntirib beradi. Bu yerda xato qilishdan qo'rqmasa bo'ladi.

---

## 4-slayd. Qanday ishlaydi?

**Slaydda:**
1. 🚶 **Sayr** — WASD + sichqoncha
2. 🚪 **Kirish** — eshik oldida `E`
3. 📜 **Missiya** — vazifa kartasi ochiladi
4. 💬 **Suhbat** — `F`: ovoz yoki matn
5. 🏆 **Natija** — chiqishda AI baholaydi

**Gapiriladi:**
> Foydalanuvchi yo'li besh qadamdan iborat. Avval WASD tugmalari va sichqoncha bilan qishloq bo'ylab yuradi. Eshik oldiga kelib **E** tugmasini bosadi va binoga kiradi. Ekranda missiya chiqadi. Keyin NPC oldida **F** ni bosib suhbatni boshlaydi — mikrofon orqali gapirishi yoki yozishi mumkin. Chiqish eshigida yana **E** bosilganda AI natijani ko'rsatadi.

---

## 5-slayd. Missiyalar

**Slaydda:** Ikki joy — ikki xarakter

**🏪 Village Shop · Jack** — jonli, quvnoq do'kondor
- 🎯 Buy 2 bottles of water and 1 apple
- Jack: "Hello! Welcome to our village shop. What can I get for you today?"
- Siz: "Could I have two bottles of water and an apple, please?"

**☕ Language Cafe · Mia** — samimiy, do'stona barista
- 🎯 Order 1 hot Americano and 1 croissant
- Mia: "Hi there! Welcome to the Language Cafe. What can I brew for you today?"
- Siz: "I'd like a hot Americano and a croissant, please."

**Gapiriladi:**
> Hozircha ikkita joy bor. Do'konda sotuvchi **Jack** — u quvnoq xarakterli; vazifa: 2 ta suv va 1 ta olma sotib olish. Kafeda barista **Mia** — vazifa: 1 ta issiq Americano va 1 ta kruassan buyurtma qilish. Har bir personajning o'z xarakteri bor va u har qanday gapga tabiiy javob beradi — tayyor skript emas.

---

## 6-slayd. AI pipeline

**Slaydda:** Ovozdan ovozgacha — real vaqtda
1. 🎙️ **Speech-to-Text** — Web Speech API (en-US)
2. 🧠 **Groq LLM** — gpt-oss-120b, oxirgi 4 xabar konteksti
3. 🔊 **Text-to-Speech** — speechSynthesis, NPC animatsiyasi bilan
4. 📋 **Examiner AI** — JSON baholash, temperature 0.2

*(Kod namunasi: NPC uchun system prompt va Groq API chaqiruvi)*

**Gapiriladi:**
> Texnik tomondan suhbat to'rt bosqichda ishlaydi. Foydalanuvchi gapiradi — brauzerning Web Speech API'si ovozni matnga aylantiradi. Matn Groq bulut xizmatidagi **gpt-oss-120b** modeliga yuboriladi; model personaj roli va oxirgi to'rtta xabarni hisobga olib javob yozadi. Javob yana ovozga aylantiriladi va NPC gapirayotgandek animatsiya qiladi. Chiqishda esa alohida "imtihonchi" prompt butun suhbatni baholaydi.

---

## 7-slayd. Aqlli baholash

**Slaydda:** Imtihonchi AI o'zbek tilida tushuntiradi
- ✓ **Og'zaki nutqqa moslashgan** — katta harf va tinish belgilari xato hisoblanmaydi.
- ✓ **Missiya bajarilganini** tekshiradi (to'g'ri mahsulot va miqdor).
- ✓ **Real grammatik xatolar**: "I wants", "two apple" → to'g'ri varianti bilan.
- ✓ Natija qat'iy **JSON** formatda: score, completed, mistakes, feedback.

*Namuna oyna:* 🎉 Vazifa Bajarildi! · 88% · "Siz aytdingiz: 'give me two apple' ➔ To'g'risi: 'Could I have two apples, please?'"

**Gapiriladi:**
> Baholash tizimi og'zaki nutq uchun moslangan: mikrofon katta harf va nuqta qo'ymaydi, shuning uchun bular xato hisoblanmaydi. AI missiya bajarilganini va haqiqiy grammatik xatolarni tekshiradi. Natija JSON formatda qaytadi va ekranda ball, xatolar ro'yxati va umumiy xulosa ko'rinadi. Har bir xato uchun "siz aytdingiz — to'g'risi — izoh" formatida o'zbekcha tushuntirish beriladi. *(Bu yerdagi oyna — namuna.)*

---

## 8-slayd. Texnologiyalar

**Slaydda:** Zamonaviy web stack
- ⚛ **React 19** — UI holati, modallar, chat oynasi
- **Three.js + React Three Fiber** — 3D sahna, soyalar, animatsiya
- **@react-three/drei** — useGLTF, useAnimations yordamchilari
- ⚡ **Vite 8** — tezkor dev-server va HMR
- **Groq Cloud API** — openai/gpt-oss-120b, juda tez LLM inferensi
- 🎙 **Web Speech API** — STT + TTS, brauzerning o'zida

**Gapiriladi:**
> Loyiha to'liq web texnologiyalarda qurilgan, hech narsa o'rnatish shart emas. Interfeys — React 19. 3D sahna — Three.js va uning React uchun o'rami React Three Fiber, 3D modellarni yuklash uchun drei kutubxonasi. Yig'ish vositasi — Vite. Sun'iy intellekt uchun Groq tanladik, chunki u juda tez javob beradi — suhbat uchun bu muhim. Ovoz bilan ishlash esa brauzerning o'zidagi Web Speech API orqali.

---

## 9-slayd. Arxitektura

**Slaydda:** Komponentlar tuzilishi
- **UI qatlami:** boshqaruv eslatmasi, missiya kartasi, chat oynasi, natija hisoboti
- **App.jsx — markaziy holat:** currentLocation, dialogState, activeMission, exitEvaluation, playerRef, cameraAnglesRef
- **3D qatlam (VillageCanvas):** Environment, Traffic, Shop · Cafe, Player, CameraController

**Gapiriladi:**
> Arxitektura uch qismdan iborat. Markazda **App.jsx** — u o'yinchi qayerdaligini, dialog holatini, missiyani va baholashni boshqaradi hamda AI'ga so'rov yuboradi. Chap tomonda — 3D ustidagi HTML interfeys. O'ng tomonda — VillageCanvas ichidagi 3D komponentlar: atrof-muhit, harakatlanuvchi mashinalar, do'kon va kafe, o'yinchi va kamera. Har bir komponent o'z vazifasiga ega, bu kodni kengaytirishni osonlashtiradi.

---

## 10-slayd. Loyiha raqamlarda

**Slaydda:**
- **1708** qator kod · **7** ta 3D komponent · **15** ta GLB 3D model · **2** ta AI NPC
- *Papka tuzilishi:* public/models, src/App.jsx, src/components/r3f/…
- **Muhim texnik yechimlar:**
  - Binolar uchun AABB kolliziya (BUILDINGS_CONFIG)
  - Har bir mashina uchun mustaqil klon va avto-masshtab
  - NPC gapirganda isTalking animatsiyasi
  - Shadow acne'siz yorug'lik (shadow-bias)
  - Suspense orqali modellarni xavfsiz yuklash

**Gapiriladi:**
> Raqamlarda: taxminan 1700 qator kod, 7 ta 3D komponent, 15 ta 3D model va 2 ta AI personaj. Bir nechta qiziq texnik yechimlar bor: o'yinchi binolar devoridan o'tib ketmasligi uchun oddiy to'rtburchak kolliziya; har bir mashina bitta modeldan klonlanadi va avtomatik masshtablanadi; NPC gapirayotganda animatsiya o'ynaydi; modellar Suspense orqali yuklanadi, shuning uchun sahna yuklanish paytida buzilmaydi.

---

## 11-slayd. Qiyinchiliklar

**Slaydda:** Muammolar va yechimlar
- 🎤 **STT xatolari** — mikrofon matnida katta harf va tinish yo'q → baholash promptida ularni e'tiborsiz qoldirish.
- 🧾 **LLM javob formati** — model ba'zan markdown qaytaradi → JSON-only prompt, tozalash va xavfsiz fallback.
- 📷 **Kamera va o'tishlar** — ichkari/tashqari o'tishda kamera chalkashardi → har joy uchun alohida burchak va masofa.
- 📦 **Og'ir modellar** — GLB fayllar jami ~490 MB → reja: Draco/Meshopt siqish, LOD, lazy-loading.
- 🔐 **API kalit xavfsizligi** — kalit hozir frontendda → reja: serverless proxy orqali.
- 🌐 **Brauzer mosligi** — Web Speech API asosan Chrome/Edge'da → matnli chat zaxira varianti mavjud.

**Gapiriladi:**
> Ish davomida bir qancha muammolarga duch keldik. Birinchidan, AI dastlab mikrofon matnidagi kichik harflarni xato deb hisoblardi — buni promptda qoida bilan hal qildik. Ikkinchidan, model ba'zan JSON o'rniga markdown qaytarardi — javobni tozalaymiz va xatolik bo'lsa zaxira natija ko'rsatamiz. Hali hal qilinmagan ikki muammo ham bor: 3D modellar juda og'ir, taxminan 490 megabayt, va API kalit hozir frontend kodida turibdi. Ikkalasi ham keyingi bosqich rejasida.

---

## 12-slayd. Yo'l xaritasi

**Slaydda:** Keyingi bosqichlar
- ✅ **Hozir — MVP:** 3D qishloq, 2 ta AI NPC, ovozli suhbat, AI baholash
- **Bosqich 2 — Kontent:** bank, shifoxona, aeroport; darajalar (A1 → C1); yangi missiyalar
- **Bosqich 3 — Progress:** login va profil, ball tarixi va XP, talaffuz tahlili
- **Bosqich 4 — Masshtab:** backend proxy, optimallashgan modellar, mobil versiya

**Gapiriladi:**
> Hozir bizda ishlaydigan MVP bor. Keyingi bosqichda yangi joylar — bank, shifoxona, aeroport — va A1 dan C1 gacha qiyinlik darajalarini qo'shmoqchimiz. Uchinchi bosqichda foydalanuvchi profili, natijalar tarixi va talaffuz tahlili. To'rtinchi bosqichda esa xavfsizlik uchun backend, modellarni yengillashtirish va mobil versiya.

---

## 13-slayd. Rahmat

**Slaydda:**
- Demo vaqti
- **Rahmat!**
- Savollaringiz bo'lsa, marhamat 🙌
- `$ npm install && npm run dev`

**Gapiriladi:**
> E'tiboringiz uchun rahmat! Endi loyihani jonli ko'rsatamiz: qishloqqa kiramiz, kafeda Mia bilan gaplashamiz va chiqishda natijani ko'ramiz. Undan keyin savollaringizga javob beramiz.
