/**
 * missionsData.js
 * Central bilingual mission catalog for AI-Language-Village.
 * All missions have stable unique IDs to decouple mission logic, inventory requirements,
 * and progress persistence from UI display translations.
 */

export const MISSIONS_CATALOG = {
  Shop: [
    {
      id: "shop_001",
      facility: "Shop",
      title: { en: "🏪 Shop Mission", ko: "🏪 상점 미션" },
      scenarioContext: {
            "en": "It's an exceptionally scorching afternoon in the village. Jack has been moving heavy boxes in the back, feels parched, and talks about how refreshing ice-cold water is on hot days. He also mentions that sweet, juicy red apples just arrived from the local orchard.",
            "ko": "오늘 오후 마을에 무더위가 찾아왔습니다. 잭은 창고에서 무거운 상자들을 나르느라 땀을 흘리고 목이 마르다며, 이런 날씨엔 시원한 물이 최고라고 이야기합니다. 또한 오늘 아침 과수원에서 아삭하고 달콤한 빨간 사과가 막 들어왔다고 언급합니다."
      },
      initialGreeting: {
            "en": "Phew, it's really sweltering outside today! Welcome to the grocery store. How are you holding up in this heat?",
            "ko": "휴, 오늘 날씨가 정말 푹푹 찌네요! 식료품점에 오신 걸 환영해요. 이렇게 더운 날 어떻게 지내고 계세요?"
      },
      hiddenObjective: {
            "en": "Pick up 2 bottles of water and 1 apple from the shelves, and speak with Jack about your purchase or the weather.",
            "ko": "진열대에서 생수 2병과 사과 1개를 골라 가방에 담고, 잭과 구매나 날씨에 대해 자연스럽게 대화하세요."
      },
      evaluationCriteria: {
            "en": "Player speaks politely to Jack in the target language and collects 2 water bottles and 1 apple.",
            "ko": "학습자가 목표 언어로 잭과 정중하게 대화하고 생수 2병과 사과 1개를 소지함."
      },
      text: {
        en: "Buy 2 bottles of water and 1 apple.",
        ko: "생수 2병과 사과 1개를 구매하세요."
      },
      goal: {
        en: "Buy exactly 2 bottles of water and 1 apple.",
        ko: "생수 정확히 2병과 사과 1개를 구매하세요."
      },
      requiredItems: { water_bottle: 2, apple: 1 }
    },
    {
      id: "shop_002",
      facility: "Shop",
      title: { en: "🏪 Shop Mission", ko: "🏪 상점 미션" },
      scenarioContext: {
            "en": "Jack is putting together healthy morning snack packages for the village school trip. He mentions that crisp apples paired with fresh cold milk provide the best morning energy for travelers.",
            "ko": "잭은 마을 학교 소풍에 보낼 건강한 아침 간식 꾸러미를 정리하고 있습니다. 신선한 사과와 차가운 우유를 곁들이면 여행길에 든든하고 상쾌한 아침 에너지가 된다고 이야기합니다."
      },
      initialGreeting: {
            "en": "Good morning! The store is bustling with snack preparation today. Looking for something refreshing?",
            "ko": "좋은 아침이에요! 오늘 간식 준비로 매장이 아주 활기차네요. 상쾌하고 신선한 것 찾으시나요?"
      },
      hiddenObjective: {
            "en": "Collect 3 apples and 1 bottle of milk from the shelves, and interact pleasantly with Jack.",
            "ko": "진열대에서 사과 3개와 우유 1병을 골라 담고, 잭과 활기차게 대화를 나누세요."
      },
      evaluationCriteria: {
            "en": "Player engages with Jack in the target language and collects 3 apples and 1 bottle of milk.",
            "ko": "학습자가 목표 언어로 잭과 소통하고 사과 3개와 우유 1병을 정확히 소지함."
      },
      text: {
        en: "Buy 3 apples and 1 bottle of milk.",
        ko: "사과 3개와 우유 1병을 구매하세요."
      },
      goal: {
        en: "Buy exactly 3 apples and 1 bottle of milk.",
        ko: "사과 정확히 3개와 우유 1병을 구매하세요."
      },
      requiredItems: { apple: 3, milk: 1 }
    },
    {
      id: "shop_003",
      facility: "Shop",
      title: { en: "🏪 Shop Mission", ko: "🏪 상점 미션" },
      scenarioContext: {
            "en": "Jack has just unpacked warm, freshly baked loaves of bread from the village bakery. He remarks that a simple breakfast of crusty bread with fresh drinking water is the most satisfying meal of the day.",
            "ko": "잭은 마을 베이커리에서 방금 구워져 도착한 따끈한 식빵 상자를 정리했습니다. 담백한 식빵에 맑은 생수를 곁들이는 것만큼 속 편하고 든든한 식사가 없다며 빵 냄새를 칭찬합니다."
      },
      initialGreeting: {
            "en": "Hello there! Mmm, smell that freshly baked bakery bread? Welcome in!",
            "ko": "안녕하세요! 흠, 방금 배달된 고소한 빵 냄새 맡아보셨나요? 가게에 잘 오셨어요!"
      },
      hiddenObjective: {
            "en": "Collect 1 loaf of bread and 2 bottles of water from the store shelves, and converse with Jack.",
            "ko": "진열대에서 식빵 1개와 생수 2병을 골라 담고, 잭과 빵이나 음료에 대해 이야기하세요."
      },
      evaluationCriteria: {
            "en": "Player converses politely with Jack in the target language and collects 1 loaf of bread and 2 water bottles.",
            "ko": "학습자가 목표 언어로 잭과 대화하고 식빵 1개와 생수 2병을 정확히 소지함."
      },
      text: {
        en: "Buy 1 loaf of bread and 2 bottles of water.",
        ko: "식빵 1개와 생수 2병을 구매하세요."
      },
      goal: {
        en: "Buy exactly 1 loaf of bread and 2 bottles of water.",
        ko: "식빵 정확히 1개와 생수 2병을 구매하세요."
      },
      requiredItems: { bread: 1, water_bottle: 2 }
    },
    {
      id: "shop_004",
      facility: "Shop",
      title: { en: "🏪 Shop Mission", ko: "🏪 상점 미션" },
      scenarioContext: {
            "en": "Jack is restocking the dairy chiller and fruit stand for afternoon customers. He reflects on how popular chilled dairy milk and sweet orchard apples are for an afternoon pick-me-up.",
            "ko": "잭은 오후 손님들을 맞이하기 위해 유제품 냉장고와 과일 코너를 채우고 있습니다. 오후의 나른함을 달래기에는 고소한 우유와 상큼한 사과가 손님들에게 가장 인기라고 말합니다."
      },
      initialGreeting: {
            "en": "Welcome! I'm just finishing stocking up our dairy and fruit. What brings you by this afternoon?",
            "ko": "어서 오세요! 유제품과 과일을 신선하게 채워 넣던 참이었어요. 오늘 어떤 일로 들르셨나요?"
      },
      hiddenObjective: {
            "en": "Collect 2 bottles of milk and 1 apple from the shelves, and chat naturally with Jack.",
            "ko": "진열대에서 우유 2병과 사과 1개를 골라 담고, 잭과 가볍고 즐겁게 대화하세요."
      },
      evaluationCriteria: {
            "en": "Player speaks in the target language with Jack and collects 2 bottles of milk and 1 apple.",
            "ko": "학습자가 목표 언어로 잭과 대화하고 우유 2병과 사과 1개를 정확히 소지함."
      },
      text: {
        en: "Buy 2 bottles of milk and 1 apple.",
        ko: "우유 2병과 사과 1개를 구매하세요."
      },
      goal: {
        en: "Buy exactly 2 bottles of milk and 1 apple.",
        ko: "우유 정확히 2병과 사과 1개를 구매하세요."
      },
      requiredItems: { milk: 2, apple: 1 }
    }
  ],
  Cafe: [
    {
      id: "cafe_001",
      facility: "Cafe",
      title: { en: "☕ Cafe Mission", ko: "☕ 카페 미션" },
      scenarioContext: {
            "en": "Mia is opening the Language Cafe for the morning, wiping down tables and warming up the espresso machine. The cafe is calm and peaceful, ready for visitors starting their day.",
            "ko": "미아는 아침 일찍 랭귀지 카페 문을 열고 테이블을 닦으며 에스프레소 머신을 예열하고 있습니다. 차분하고 따뜻한 분위기 속에서 아침을 시작하는 손님들을 맞이할 준비를 마쳤습니다."
      },
      initialGreeting: {
            "en": "Good morning! The aroma of freshly brewed coffee is wonderful today, isn't it? Welcome in.",
            "ko": "좋은 하루예요! 오늘 갓 내린 커피 향이 참 향긋하죠? 랭귀지 카페에 잘 오셨어요."
      },
      hiddenObjective: {
            "en": "Order a hot Americano and a croissant by expressing interest in morning coffee and pastries.",
            "ko": "따뜻한 아메리카노와 크루아상에 대해 관심을 표하며 자연스럽게 주문하세요."
      },
      evaluationCriteria: {
            "en": "Player engages with Mia about coffee/pastries and successfully orders a hot Americano and croissant in the target language.",
            "ko": "학습자가 목표 언어로 미아와 대화하며 따뜻한 아메리카노와 크루아상을 정중하게 주문함."
      },
      text: {
        en: "Order 1 hot Americano and 1 croissant.",
        ko: "따뜻한 아메리카노 1잔과 크루아상 1개를 주문하세요."
      },
      goal: {
        en: "Order exactly 1 hot Americano and 1 croissant.",
        ko: "따뜻한 아메리카노 정확히 1잔과 크루아상 1개를 주문하세요."
      }
    },
    {
      id: "cafe_002",
      facility: "Cafe",
      title: { en: "☕ Cafe Mission", ko: "☕ 카페 미션" },
      scenarioContext: {
            "en": "It's lunchtime at the Language Cafe. Mia is busy preparing orders behind the counter and welcoming neighborhood visitors who are taking a midday break.",
            "ko": "랭귀지 카페의 점심시간입니다. 미아는 카운터 뒤에서 주문을 받고 정성껏 음료와 간식을 준비하며, 점심시간에 잠시 쉬러 온 손님들을 따뜻하게 맞이하고 있습니다."
      },
      initialGreeting: {
            "en": "Hi there! Welcome to the Language Cafe. Are you taking a quick break from your day?",
            "ko": "안녕하세요! 랭귀지 카페에 오신 걸 환영해요. 오늘 하루 잠시 쉬어가시는 중인가요?"
      },
      hiddenObjective: {
            "en": "Order 1 cafe latte and 1 sandwich by conversing naturally about a lunch or relaxing break.",
            "ko": "점심 식사나 휴식에 대해 대화하며 라떼 1잔과 샌드위치 1개를 자연스럽게 주문하세요."
      },
      evaluationCriteria: {
            "en": "Player communicates a lunch order for a latte and sandwich politely in the target language.",
            "ko": "학습자가 목표 언어로 미아에게 라떼와 샌드위치를 매끄럽게 주문함."
      },
      text: {
        en: "Order 1 latte and 1 sandwich.",
        ko: "라떼 1잔과 샌드위치 1개를 주문하세요."
      },
      goal: {
        en: "Order exactly 1 latte and 1 sandwich.",
        ko: "라떼 정확히 1잔과 샌드위치 1개를 주문하세요."
      }
    },
    {
      id: "cafe_003",
      facility: "Cafe",
      title: { en: "☕ Cafe Mission", ko: "☕ 카페 미션" },
      scenarioContext: {
            "en": "It's a quiet, mellow afternoon at the cafe with gentle music playing. Mia is restocking cups and napkins and chatting warmly with visitors seeking a quiet place to relax.",
            "ko": "잔잔한 음악이 흐르는 아늑하고 여유로운 오후의 카페입니다. 미아는 컵과 냅킨을 정리하며, 편안하게 쉬어갈 장소를 찾아온 손님들과 다정하게 이야기를 나눕니다."
      },
      initialGreeting: {
            "en": "Hello! It's such a peaceful afternoon here. The kettle is simmering nicely. What brings you by?",
            "ko": "안녕하세요! 오늘 오후는 참 아늑하고 평온하네요. 주전자가 따뜻하게 끓고 있어요. 오늘 어떤 시간 보내러 오셨어요?"
      },
      hiddenObjective: {
            "en": "Order 1 green tea and 1 slice of cake while having a calm conversation with Mia.",
            "ko": "미아와 여유롭게 대화를 나누며 녹차 1잔과 케이크 1조각을 주문하세요."
      },
      evaluationCriteria: {
            "en": "Player orders green tea and cake using polite target language expressions.",
            "ko": "학습자가 목표 언어로 녹차와 케이크를 정중하게 주문함."
      },
      text: {
        en: "Order 1 green tea and 1 cake.",
        ko: "녹차 1잔과 케이크 1조각을 주문하세요."
      },
      goal: {
        en: "Order exactly 1 green tea and 1 cake.",
        ko: "녹차 정확히 1잔과 케이크 1조각을 주문하세요."
      }
    },
    {
      id: "cafe_004",
      facility: "Cafe",
      title: { en: "☕ Cafe Mission", ko: "☕ 카페 미션" },
      scenarioContext: {
            "en": "The afternoon cafe is lively with visitors enjoying casual conversations. Mia is keeping the coffee station neat and ready to take drink and pastry orders from guests.",
            "ko": "손님들이 담소를 나누며 활기찬 오후를 보내고 있는 카페입니다. 미아는 커피 바를 청결하게 정돈하며 방문한 손님들의 주문을 맞이할 준비를 하고 있습니다."
      },
      initialGreeting: {
            "en": "Welcome! Fresh baked aroma is in the air today. What kind of treat are you craving?",
            "ko": "어서 오세요! 달콤하고 고소한 빵 냄새가 가득하죠? 오늘 어떤 음료나 디저트가 생각나시나요?"
      },
      hiddenObjective: {
            "en": "Order 1 cappuccino and 1 muffin while discussing sweet treats or afternoon coffee.",
            "ko": "디저트나 커피에 대해 대화하며 카푸치노 1잔과 머핀 1개를 주문하세요."
      },
      evaluationCriteria: {
            "en": "Player orders a cappuccino and muffin politely in the target language.",
            "ko": "학습자가 목표 언어로 카푸치노와 머핀을 능숙하게 주문함."
      },
      text: {
        en: "Order 1 cappuccino and 1 muffin.",
        ko: "카푸치노 1잔과 머핀 1개를 주문하세요."
      },
      goal: {
        en: "Order exactly 1 cappuccino and 1 muffin.",
        ko: "카푸치노 정확히 1잔과 머핀 1개를 주문하세요."
      }
    }
  ],
  Hotel: [
    {
      id: "hotel_001",
      facility: "Hotel",
      title: { en: "🏨 Hotel Mission", ko: "🏨 호텔 미션" },
      scenarioContext: {
            "en": "Emma is reviewing the weekend reservations board. She mentions that solo travelers often prefer the tranquil garden-view single rooms for a restful two-night stay.",
            "ko": "엠마는 주말 예약 현황판을 정리하고 있습니다. 혼자 여행 온 여행객들에게는 정원이 보이는 조용한 싱글룸 2박 일정이 가장 편안한 쉼을 준다고 이야기합니다."
      },
      initialGreeting: {
            "en": "Welcome to the Village Hotel! How has your journey to our village been so far?",
            "ko": "마을 호텔에 오신 것을 환영합니다! 저희 마을까지 오시는 길은 편안하셨나요?"
      },
      hiddenObjective: {
            "en": "Inquire about accommodations and arrange a single room reservation for two nights.",
            "ko": "숙박에 대해 문의하고 싱글룸 2박 예약을 자연스럽게 진행하세요."
      },
      evaluationCriteria: {
            "en": "Player discusses hotel room options and successfully requests a 2-night single room stay.",
            "ko": "학습자가 목표 언어로 싱글룸 2박 예약을 정확하고 예의 바르게 문의함."
      },
      text: {
        en: "Book a single room for two nights.",
        ko: "싱글룸을 2박으로 예약하세요."
      },
      goal: {
        en: "Book exactly one single room for two nights.",
        ko: "싱글룸 정확히 1실을 2박으로 예약하세요."
      }
    },
    {
      id: "hotel_002",
      facility: "Hotel",
      title: { en: "🏨 Hotel Mission", ko: "🏨 호텔 미션" },
      scenarioContext: {
            "en": "Emma is preparing the guest welcoming packets and dining vouchers. She shares that the double room package includes our famous buffet breakfast overlooking the courtyard.",
            "ko": "엠마는 투숙객 안내 패키지와 식사권을 준비하고 있습니다. 더블룸 1박 패키지에는 안뜰이 내려다보이는 호텔 조식 뷔페가 포함되어 인기가 높다고 설명합니다."
      },
      initialGreeting: {
            "en": "Good day! Welcome to the hotel lobby. Are you planning an overnight stay with us?",
            "ko": "좋은 하루입니다! 호텔 로비에 잘 오셨어요. 오늘 저희 호텔에 머무르실 계획이신가요?"
      },
      hiddenObjective: {
            "en": "Ask about booking a double room for one night and inquire about breakfast details.",
            "ko": "더블룸 1박 예약에 대해 묻고, 아침 조식 제공 및 세부 사항을 문의하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about a double room for one night and asks about breakfast in the target language.",
            "ko": "학습자가 목표 언어로 더블룸 1박과 조식 안내에 대해 매끄럽게 질문함."
      },
      text: {
        en: "Ask for a double room for one night and ask about the breakfast.",
        ko: "더블룸 1박 예약에 대해 문의하고 조식에 대해 물어보세요."
      },
      goal: {
        en: "Ask about a double room for one night and ask about breakfast.",
        ko: "더블룸 1박과 조식에 대해 물어보세요."
      }
    },
    {
      id: "hotel_003",
      facility: "Hotel",
      title: { en: "🏨 Hotel Mission", ko: "🏨 호텔 미션" },
      scenarioContext: {
            "en": "Emma is greeting arriving guests at the front desk. She is happy to guide travelers through their check-in details and answer questions about morning amenities.",
            "ko": "엠마는 프런트 데스크에서 새로 도착한 손님들을 맞이하고 있습니다. 체크인 절차를 친절히 돕고 아침 편의시설 이용에 대해 안내하는 중입니다."
      },
      initialGreeting: {
            "en": "Hello and welcome! How can I assist you with your stay at our hotel today?",
            "ko": "안녕하세요, 환영합니다! 오늘 저희 호텔 이용에 대해 어떤 점을 도와드릴까요?"
      },
      hiddenObjective: {
            "en": "Complete check-in formalities and ask what time breakfast service begins.",
            "ko": "체크인 절차를 진행하고, 아침 조식이 몇 시부터 시작되는지 시간을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player engages in a check-in dialogue and asks about the breakfast start time in the target language.",
            "ko": "학습자가 목표 언어로 체크인을 진행하고 조식 시작 시간을 명확히 질문함."
      },
      text: {
        en: "Check in and ask what time breakfast starts.",
        ko: "체크인을 진행하고 조식 시작 시간을 물어보세요."
      },
      goal: {
        en: "Complete a hotel check-in conversation and ask what time breakfast starts.",
        ko: "호텔 체크인을 마치고 조식 시간을 확인하세요."
      }
    },
    {
      id: "hotel_004",
      facility: "Hotel",
      title: { en: "🏨 Hotel Mission", ko: "🏨 호텔 미션" },
      scenarioContext: {
            "en": "Emma is answering questions for travelers who need to work remotely. She notes that our upper floor rooms have dedicated high-speed Wi-Fi and reasonable nightly rates.",
            "ko": "엠마는 원격 업무가 필요한 출장객들의 문의를 받고 있습니다. 고층 객실에는 전용 고속 와이파이가 설치되어 있으며 숙박 요금도 합리적이라고 설명합니다."
      },
      initialGreeting: {
            "en": "Welcome! Please let me know if you have any questions about our amenities and rooms.",
            "ko": "어서 오세요! 객실 요금이나 편의 시설에 대해 궁금한 점이 있으시면 편하게 말씀해 주세요."
      },
      hiddenObjective: {
            "en": "Ask about room options with reliable Wi-Fi and inquire about the nightly room price.",
            "ko": "와이파이가 지원되는 객실이 있는지 확인하고 1박 요금에 대해 문의하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about Wi-Fi availability and room rates in the target language.",
            "ko": "학습자가 목표 언어로 와이파이 연결 여부와 객실 요금을 자연스럽게 질문함."
      },
      text: {
        en: "Ask for a room with Wi-Fi and ask about the price.",
        ko: "와이파이가 되는 방을 문의하고 요금을 물어보세요."
      },
      goal: {
        en: "Ask for a room with Wi-Fi and ask about its price.",
        ko: "와이파이가 제공되는 방과 객실 요금에 대해 물어보세요."
      }
    }
  ],
  Hospital: [
    {
      id: "hospital_001",
      facility: "Hospital",
      title: { en: "🏥 Hospital Mission", ko: "🏥 병원 미션" },
      scenarioContext: {
            "en": "Nurse Sarah is managing the clinic appointment roster. She emphasizes that booking an appointment in advance ensures you see the doctor at a convenient time without long delays.",
            "ko": "간호사 사라는 진료 예약 명부를 확인하고 있습니다. 미리 진료 예약을 해두면 대기 시간 없이 원하는 시간에 의사 선생님을 만날 수 있다고 친절하게 안내합니다."
      },
      initialGreeting: {
            "en": "Hello, welcome to the village clinic. How can I help you take care of your health today?",
            "ko": "안녕하세요, 마을 병원에 오신 것을 환영해요. 오늘 건강과 관련해 어떤 도움이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Book a doctor's appointment and confirm what time the consultation will take place.",
            "ko": "의사 진료 예약을 접수하고, 진료가 몇 시에 예정되어 있는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks for an appointment and inquires about the specific time in the target language.",
            "ko": "학습자가 목표 언어로 진료 예약을 요청하고 예약 시간을 명확히 확인함."
      },
      text: {
        en: "Make a doctor's appointment and ask what time it is.",
        ko: "진료 예약을 하고 진료 시간을 물어보세요."
      },
      goal: {
        en: "Make a doctor's appointment and ask what time it is.",
        ko: "진료 예약을 하고 시간을 확인하세요."
      }
    },
    {
      id: "hospital_002",
      facility: "Hospital",
      title: { en: "🏥 Hospital Mission", ko: "🏥 병원 미션" },
      scenarioContext: {
            "en": "Sarah is reviewing preventive health consultation brochures. She explains that routine annual check-ups are great for peace of mind, and explains the fee breakdown.",
            "ko": "사라는 예방 건강검진 안내 책자를 정리하고 있습니다. 정기적인 일반 건강검진이 건강 관리에 매우 중요하며 검진 항목별 비용도 투명하게 책정되어 있다고 설명합니다."
      },
      initialGreeting: {
            "en": "Good day! I'm Nurse Sarah. Are you here for a consultation or check-up?",
            "ko": "좋은 하루예요! 저는 간호사 사라입니다. 오늘 진료 상담이나 건강검진 때문에 오셨나요?"
      },
      hiddenObjective: {
            "en": "Inquire about having a general health check-up and ask about the cost.",
            "ko": "일반 건강검진 신청에 대해 문의하고 검진 비용이 얼마인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about a general medical check-up and its price in the target language.",
            "ko": "학습자가 목표 언어로 건강검진과 검진 비용에 대해 명확하게 문의함."
      },
      text: {
        en: "Ask for a general check-up and ask about the price.",
        ko: "일반 건강검진에 대해 문의하고 비용을 물어보세요."
      },
      goal: {
        en: "Ask for a general check-up and ask about the price.",
        ko: "일반 건강검진과 검진 비용에 대해 문의하세요."
      }
    },
    {
      id: "hospital_003",
      facility: "Hospital",
      title: { en: "🏥 Hospital Mission", ko: "🏥 병원 미션" },
      scenarioContext: {
            "en": "Sarah is checking the emergency triage signage in the lobby. She notes that the emergency wing is clearly marked, and answers questions about regular clinic operating hours.",
            "ko": "사라는 로비의 응급실 안내 표지판을 점검하고 있습니다. 응급실 위치는 별관으로 연결되어 있으며 일반 외래 진료 마감 시간 이후에도 긴급 대응이 가능하다고 안내합니다."
      },
      initialGreeting: {
            "en": "Hello! If you need urgent assistance or directions around the clinic, please let me know.",
            "ko": "안녕하세요! 병원 내 위치 안내나 긴급한 문의가 있으시면 편하게 말씀해 주세요."
      },
      hiddenObjective: {
            "en": "Ask where the emergency room is located and inquire what time the hospital closes for regular visits.",
            "ko": "응급실 위치를 물어보고 일반 병원 진료 마감 시간이 몇 시인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about emergency room location and hospital closing hours in the target language.",
            "ko": "학습자가 목표 언어로 응급실 위치와 병원 마감 시간에 대해 정확히 질문함."
      },
      text: {
        en: "Ask where the emergency room is and what time the hospital closes.",
        ko: "응급실 위치와 병원 진료 마감 시간을 물어보세요."
      },
      goal: {
        en: "Ask where the emergency room is and what time the hospital closes.",
        ko: "응급실 위치와 마감 시간을 확인하세요."
      }
    },
    {
      id: "hospital_004",
      facility: "Hospital",
      title: { en: "🏥 Hospital Mission", ko: "🏥 병원 미션" },
      scenarioContext: {
            "en": "Sarah is organizing the waiting room chart. She welcomes walk-in patients warmly and explains the current queue status so patients can plan their wait comfortably.",
            "ko": "사라는 대기실 접수 차트를 확인하고 있습니다. 당일 접수 환자들을 맞이하며 현재 대기 인원과 예상 대기 시간에 대해 친절히 안내해 드립니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the clinic reception. Are you feeling unwell today?",
            "ko": "안녕하세요! 진료 접수처에 잘 오셨어요. 오늘 몸이 어디 불편하신가요?"
      },
      hiddenObjective: {
            "en": "Request to see a physician and ask how long you will need to wait.",
            "ko": "의사 진료를 요청하고, 진료를 받기까지 얼마나 대기해야 하는지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player requests a doctor's examination and asks about the waiting time in the target language.",
            "ko": "학습자가 목표 언어로 진료를 요청하고 대기 시간에 대해 자연스럽게 질문함."
      },
      text: {
        en: "Ask to see a doctor and ask how long you need to wait.",
        ko: "의사 진료를 요청하고 대기 시간을 물어보세요."
      },
      goal: {
        en: "Ask to see a doctor and ask how long you need to wait.",
        ko: "진료 접수를 하고 대기 시간을 물어보세요."
      }
    }
  ],
  Bank: [
    {
      id: "bank_001",
      facility: "Bank",
      title: { en: "🏦 Bank Mission", ko: "🏦 은행 미션" },
      scenarioContext: {
            "en": "David is preparing new account welcome folders. He explains that opening a village banking account is straightforward, and discusses the basic identification paperwork required.",
            "ko": "데이비드는 신규 계좌 개설 안내 책자를 정리하고 있습니다. 마을 은행 계좌를 개설하는 절차는 매우 간단하며 본인 확인에 필요한 기본 서류를 친절히 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome to the Village Bank! I'm David. How can I assist with your finances today?",
            "ko": "마을 은행에 오신 것을 환영합니다! 저는 데이비드입니다. 오늘 어떤 금융 업무를 도와드릴까요?"
      },
      hiddenObjective: {
            "en": "Ask about opening a new bank account and find out what identification documents are needed.",
            "ko": "신규 은행 계좌 개설 절차를 문의하고 필요한 신분증명 서류가 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about opening a bank account and asks about necessary documentation in the target language.",
            "ko": "학습자가 목표 언어로 계좌 개설 방법과 필요 서류를 정확하게 질문함."
      },
      text: {
        en: "Ask about opening a bank account and what documents are needed.",
        ko: "계좌 개설에 대해 문의하고 필요한 서류를 물어보세요."
      },
      goal: {
        en: "Ask about opening a bank account and ask what documents are needed.",
        ko: "계좌 개설 방법과 필요 서류를 확인하세요."
      }
    },
    {
      id: "bank_002",
      facility: "Bank",
      title: { en: "🏦 Bank Mission", ko: "🏦 은행 미션" },
      scenarioContext: {
            "en": "David is updating the daily transfer network terminal. He explains that electronic transfers are secure and fast, and answers questions about wire fees.",
            "ko": "데이비드는 송금 단말기 시스템을 점검하고 있습니다. 안전하고 신속한 송금 서비스를 제공하며 이체 수수료 기준에 대해 상세히 설명해 드립니다."
      },
      initialGreeting: {
            "en": "Good day! Welcome to our customer service desk. Looking to handle a payment or transfer?",
            "ko": "좋은 하루입니다! 창구에 잘 오셨어요. 오늘 송금이나 결제 관련 업무가 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about transferring funds and ask how much the transfer fee is.",
            "ko": "송금 방법에 대해 문의하고 송금 수수료가 얼마인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about money transfers and transfer fees in the target language.",
            "ko": "학습자가 목표 언어로 송금 절차와 송금 수수료를 자연스럽게 질문함."
      },
      text: {
        en: "Ask about transferring money and the transfer fee.",
        ko: "송금 방법과 송금 수수료에 대해 물어보세요."
      },
      goal: {
        en: "Ask about transferring money and the transfer fee.",
        ko: "송금 절차와 수수료를 확인하세요."
      }
    },
    {
      id: "bank_003",
      facility: "Bank",
      title: { en: "🏦 Bank Mission", ko: "🏦 은행 미션" },
      scenarioContext: {
            "en": "David is checking the debit card dispensing machine. He notes that getting a local debit card makes daily village shopping effortless, and explains issuing times.",
            "ko": "데이비드는 체크카드 발급기를 점검하고 있습니다. 체크카드를 발급받으면 마을 상점 이용이 훨씬 편리해지며 발급 소요 기간에 대해 설명합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the bank. What kind of service can I help you with today?",
            "ko": "안녕하세요! 마을 은행에 잘 오셨어요. 오늘 어떤 금융 서비스를 도와드릴까요?"
      },
      hiddenObjective: {
            "en": "Ask how to obtain a bank debit card and inquire about the processing time.",
            "ko": "체크카드 발급 신청 방법을 물어보고 발급까지 얼마나 걸리는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about getting a bank card and how long it takes in the target language.",
            "ko": "학습자가 목표 언어로 카드 발급 방법과 소요 기간을 명확히 질문함."
      },
      text: {
        en: "Ask how to get a bank card and how long it takes.",
        ko: "체크카드 발급 방법과 소요 기간을 물어보세요."
      },
      goal: {
        en: "Ask how to get a bank card and how long it takes.",
        ko: "카드 발급 절차와 소요 기간을 확인하세요."
      }
    },
    {
      id: "bank_004",
      facility: "Bank",
      title: { en: "🏦 Bank Mission", ko: "🏦 은행 미션" },
      scenarioContext: {
            "en": "David is reviewing high-yield deposit brochures. He points out that putting savings into a secure deposit account earns steady interest, and discusses initial deposit requirements.",
            "ko": "데이비드는 정기 예금 상품 안내서를 검토하고 있습니다. 안전한 예금 계좌에 저축하면 안정적인 이자를 받을 수 있으며 최소 예치 금액 조건에 대해 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome in! Feel free to ask if you have any questions about savings or deposits.",
            "ko": "어서 오세요! 저축이나 예금 상품에 대해 궁금한 점이 있으시면 편하게 물어보세요."
      },
      hiddenObjective: {
            "en": "Inquire about depositing funds into an account and ask what the minimum deposit requirement is.",
            "ko": "예금 입금 방법에 대해 문의하고 최소 입금 금액 기준이 얼마인지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about making a deposit and asks about minimum deposit amounts in the target language.",
            "ko": "학습자가 목표 언어로 예금 입금 절차와 최소 금액에 대해 바르게 질문함."
      },
      text: {
        en: "Ask about depositing money and the minimum amount.",
        ko: "예금 입금과 최소 예치 금액에 대해 물어보세요."
      },
      goal: {
        en: "Ask about depositing money and the minimum amount.",
        ko: "예금 입금과 최소 금액을 확인하세요."
      }
    }
  ],
  Library: [
    {
      id: "library_001",
      facility: "Library",
      title: { en: "📚 Library Mission", ko: "📚 도서관 미션" },
      scenarioContext: {
            "en": "Emily is cataloging new arrivals in the language learning aisle. She shares that reading simplified readers is one of the most effective habits for language students.",
            "ko": "에밀리는 어학 학습 코너에 새로 들어온 책들을 정리하고 있습니다. 쉬운 단계별 읽기 책을 꾸준히 읽는 것이 어학 실력을 키우는 최고의 습관이라고 추천합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the village library. Are you looking for some good reading material today?",
            "ko": "안녕하세요! 마을 도서관에 오신 것을 환영해요. 오늘 읽을 좋은 책을 찾고 계신가요?"
      },
      hiddenObjective: {
            "en": "Ask Emily where language learning books are located and check if you can borrow one.",
            "ko": "학습 서적이 어디에 꽂혀 있는지 위치를 묻고 대출이 가능한지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the location of learning books and borrowing availability in the target language.",
            "ko": "학습자가 목표 언어로 어학 서적의 서가 위치와 대출 가능 여부를 정중하게 질문함."
      },
      text: {
        en: "Ask the librarian where the English learning books are and ask if you can borrow one.",
        ko: "사서에게 어학 학습 서적이 어디 있는지 묻고 대출 가능한지 확인하세요."
      },
      goal: {
        en: "Ask the librarian where the English learning books are and ask if you can borrow one.",
        ko: "학습 서적의 위치와 대출 가능 여부를 확인하세요."
      }
    },
    {
      id: "library_002",
      facility: "Library",
      title: { en: "📚 Library Mission", ko: "📚 도서관 미션" },
      scenarioContext: {
            "en": "Emily is shelving Korean and Asian literature collections. She highlights that conversational practice storybooks have rich cultural vocabulary, and discusses lending periods.",
            "ko": "에밀리는 한국어 및 아시아 도서 서가를 정리하고 있습니다. 회화 중심의 이야기책이 실생활 어휘를 익히기에 아주 좋으며 도서 대출 기한에 대해 친절히 설명합니다."
      },
      initialGreeting: {
            "en": "Welcome! The reading room is nice and quiet today. How can I help you navigate our shelves?",
            "ko": "환영해요! 오늘 열람실이 참 조용하고 쾌적하네요. 어떤 서가를 안내해 드릴까요?"
      },
      hiddenObjective: {
            "en": "Ask for books on Korean language study and inquire how long you are allowed to borrow them.",
            "ko": "한국어 학습 관련 서적을 추천해 달라고 요청하고 대출 기간이 며칠인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player requests a Korean study book and asks about the loan duration in the target language.",
            "ko": "학습자가 목표 언어로 한국어 학습 도서와 대출 가능 기간을 명확하게 질문함."
      },
      text: {
        en: "Ask for a book about Korean language learning and ask how long you can borrow it.",
        ko: "한국어 학습 서적을 찾고 대출 가능 기간을 물어보세요."
      },
      goal: {
        en: "Ask for a book about Korean language learning and ask how long you can borrow it.",
        ko: "한국어 서적과 대출 기한을 물어보세요."
      }
    },
    {
      id: "library_003",
      facility: "Library",
      title: { en: "📚 Library Mission", ko: "📚 도서관 미션" },
      scenarioContext: {
            "en": "Emily is updating the village history and culture archive. She mentions that beginner-friendly history books with illustrations are wonderful for new village residents.",
            "ko": "에밀리는 마을 역사와 문화 기록 코너를 정리하고 있습니다. 그림과 쉬운 설명이 곁들여진 초보자용 역사책이 마을을 이해하는 데 큰 도움이 된다고 설명합니다."
      },
      initialGreeting: {
            "en": "Good day! Feel free to browse our wide collection. Looking for a particular subject?",
            "ko": "좋은 날이에요! 다양한 도서들이 있으니 편하게 둘러보세요. 특별히 찾으시는 분야가 있으신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about the location of the history section and check if there are beginner-friendly books available.",
            "ko": "역사 코너 위치를 물어보고 초급자도 쉽게 읽을 수 있는 책이 있는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the history section and beginner-level books in the target language.",
            "ko": "학습자가 목표 언어로 역사 서가 위치와 초보자용 도서 유무를 자연스럽게 질문함."
      },
      text: {
        en: "Ask where the history section is and ask if the library has beginner books.",
        ko: "역사 코너 위치와 초급자용 책이 있는지 물어보세요."
      },
      goal: {
        en: "Ask where the history section is and ask if the library has beginner books.",
        ko: "역사 서가 위치와 초급자 도서를 확인하세요."
      }
    },
    {
      id: "library_004",
      facility: "Library",
      title: { en: "📚 Library Mission", ko: "📚 도서관 미션" },
      scenarioContext: {
            "en": "Emily is issuing library membership cards at the front counter. She explains that having a card unlocks book loans, audiobooks, and access to the quiet study zones.",
            "ko": "에밀리는 안내 데스크에서 도서 대출증 발급 업무를 진행하고 있습니다. 도서관 카드를 만들면 책 대출과 오디오북 이용은 물론 자습실 예약도 가능하다고 안내합니다."
      },
      initialGreeting: {
            "en": "Hello there! Welcome to the front desk. Are you interested in getting access to our library collections?",
            "ko": "안녕하세요! 도서관 안내 데스크예요. 저희 도서관 자료를 이용해 보시겠어요?"
      },
      hiddenObjective: {
            "en": "Ask how to register for a library card and find out what identification documents are required.",
            "ko": "도서 대출증을 어떻게 발급받는지 묻고 신청에 필요한 서류가 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about obtaining a library card and required paperwork in the target language.",
            "ko": "학습자가 목표 언어로 대출증 발급 절차와 구비 서류를 명확하게 질문함."
      },
      text: {
        en: "Ask how to get a library card and ask what documents are needed.",
        ko: "도서 대출증 발급 방법과 필요 서류를 물어보세요."
      },
      goal: {
        en: "Ask how to get a library card and ask what documents are needed.",
        ko: "도서관 카드 발급 방법과 구비 서류를 물어보세요."
      }
    }
  ],
  PoliceStation: [
    {
      id: "police_001",
      facility: "PoliceStation",
      title: { en: "👮 Police Station Mission", ko: "👮 경찰서 미션" },
      scenarioContext: {
            "en": "Officer Alex is reviewing the lost-and-found registry. He explains that recording detailed descriptions of lost wallets helps officers return them quickly when turned in.",
            "ko": "알렉스 경찰관은 분실물 접수 대장을 확인하고 있습니다. 지갑을 잃어버렸을 때 특징과 위치를 자세히 적어두면 습득되었을 때 신속하게 찾을 수 있다고 친절하게 설명합니다."
      },
      initialGreeting: {
            "en": "Hello, welcome to the village police station. Officer Alex speaking. Are you in need of assistance?",
            "ko": "안녕하세요, 마을 경찰서입니다. 알렉스 순경입니다. 어떤 도움이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Report a lost wallet and ask what specific details or information you need to submit.",
            "ko": "지갑 분실을 신고하고 신고서에 어떤 정보를 적어야 하는지 자세히 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player reports a lost wallet and asks about the required report details in the target language.",
            "ko": "학습자가 목표 언어로 지갑 분실을 신고하고 필요한 정보를 정확하게 문의함."
      },
      text: {
        en: "Report a lost wallet and ask what information you need to provide.",
        ko: "분실된 지갑을 신고하고 어떤 정보를 제공해야 하는지 물어보세요."
      },
      goal: {
        en: "Report a lost wallet and ask what information you need to provide.",
        ko: "지갑 분실을 신고하고 신고에 필요한 정보를 문의하세요."
      }
    },
    {
      id: "police_002",
      facility: "PoliceStation",
      title: { en: "👮 Police Station Mission", ko: "👮 경찰서 미션" },
      scenarioContext: {
            "en": "Alex is filing lost mobile phone tracking forms. He shares that reporting a lost smartphone promptly with serial details is the best way to secure personal data.",
            "ko": "알렉스는 분실 휴대폰 접수 양식을 정리하고 있습니다. 스마트폰을 분실했을 때는 즉시 신고하여 기기 정보와 후속 조치 방법을 확인하는 것이 중요하다고 말합니다."
      },
      initialGreeting: {
            "en": "Good day! How can our station help keep you safe and supported in the village today?",
            "ko": "좋은 날입니다! 오늘 마을에서 안전과 관련해 어떤 도움이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Ask how to report a lost smartphone and inquire about what steps to take next.",
            "ko": "휴대폰 분실 신고 방법과 이후에 취해야 할 후속 조치가 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player explains the lost phone situation and asks for next steps in the target language.",
            "ko": "학습자가 목표 언어로 휴대폰 분실 신고와 후속 절차에 대해 바르게 질문함."
      },
      text: {
        en: "Ask the police officer how to report a lost phone and what you should do next.",
        ko: "경찰관에게 분실된 휴대폰 신고 방법과 이후 절차를 물어보세요."
      },
      goal: {
        en: "Ask the police officer how to report a lost phone and what you should do next.",
        ko: "휴대폰 분실 신고와 후속 조치 방법을 확인하세요."
      }
    },
    {
      id: "police_003",
      facility: "PoliceStation",
      title: { en: "👮 Police Station Mission", ko: "👮 경찰서 미션" },
      scenarioContext: {
            "en": "Alex is putting up neighborhood community safety bulletin posters. He stresses that knowing local emergency dispatch contact numbers ensures rapid response in emergencies.",
            "ko": "알렉스는 마을 안전 수칙 포스터를 게시하고 있습니다. 위급 상황 시 신속한 지원을 받기 위해서는 가장 가까운 파출소 위치와 비상 긴급 전화번호를 알아두는 것이 필수라고 강조합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the station. Please let me know if you have any questions about village safety.",
            "ko": "안녕하세요! 경찰서에 잘 오셨어요. 마을 치안이나 안전에 대해 궁금한 점이 있으신가요?"
      },
      hiddenObjective: {
            "en": "Ask where the nearest police branch is located and inquire about the emergency phone number.",
            "ko": "인근 파출소 위치를 묻고 긴급 상황 시 연락할 수 있는 비상 전화번호를 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the nearest station location and emergency contact numbers in the target language.",
            "ko": "학습자가 목표 언어로 관할 파출소 위치와 비상 연락처를 정확하게 질문함."
      },
      text: {
        en: "Ask where the nearest police station is and ask for the emergency phone number.",
        ko: "가장 가까운 파출소 위치와 비상 연락처를 물어보세요."
      },
      goal: {
        en: "Ask where the nearest police station is and ask for the emergency phone number.",
        ko: "인근 파출소 위치와 긴급 전화번호를 확인하세요."
      }
    },
    {
      id: "police_004",
      facility: "PoliceStation",
      title: { en: "👮 Police Station Mission", ko: "👮 경찰서 미션" },
      scenarioContext: {
            "en": "Alex is handling official paperwork certification at the reception desk. He outlines the steps for issuing official police report certificates for administrative purposes.",
            "ko": "알렉스는 행정 확인서 발급 데스크를 점검하고 있습니다. 보험이나 행정 처리를 위한 사건·사고 사실확인서 발급 절차와 필요한 서류를 상세히 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome to the police station. Officer Alex here. What administrative or safety inquiry do you have?",
            "ko": "경찰서에 오신 것을 환영합니다. 알렉스 경찰관이에요. 서류 발급이나 기타 문의가 있으신가요?"
      },
      hiddenObjective: {
            "en": "Ask how to request an official police report certificate and find out what documents are needed.",
            "ko": "경찰 신고 확인서 발급 방법과 이를 위해 지참해야 할 구비 서류를 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about police report certificates and required paperwork in the target language.",
            "ko": "학습자가 목표 언어로 사실확인서 발급 절차와 지참 서류를 올바르게 문의함."
      },
      text: {
        en: "Ask how to get a police report and what documents you need.",
        ko: "경찰 신고 확인서 발급 방법과 필요 서류를 물어보세요."
      },
      goal: {
        en: "Ask how to get a police report and what documents you need.",
        ko: "신고 증명서 발급 절차와 서류를 확인하세요."
      }
    }
  ],
  LanguageSchool: [
    {
      id: "language_school_001",
      facility: "LanguageSchool",
      title: { en: "🏫 Language School Mission", ko: "🏫 어학원 미션" },
      scenarioContext: {
            "en": "Teacher Olivia is writing the new term course timetable on the classroom whiteboard. She loves meeting new students and talking through weekly class options.",
            "ko": "올리비아 선생님은 교실 화이트보드에 새 학기 수업 시간표를 적고 있습니다. 새로운 학습자들을 환영하며 자신의 소개와 함께 주간 수업 일정을 설명하는 것을 좋아합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to our village language school. I'm Teacher Olivia. Are you interested in practicing language with us?",
            "ko": "안녕하세요! 마을 어학당에 오신 걸 환영해요. 저는 올리비아 선생님이에요. 함께 어학 연습을 시작해 보실래요?"
      },
      hiddenObjective: {
            "en": "Introduce yourself to Teacher Olivia and ask about the current class timetable and schedule.",
            "ko": "올리비아 선생님께 자기소개를 간단히 건네고 수업 시간표와 일정에 대해 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player introduces themselves and asks about class schedules politely in the target language.",
            "ko": "학습자가 목표 언어로 자신을 소개하고 수업 스케줄에 대해 예의 바르게 질문함."
      },
      text: {
        en: "Introduce yourself to the teacher and ask about the class schedule.",
        ko: "선생님에게 자기소개를 하고 수업 일정에 대해 물어보세요."
      },
      goal: {
        en: "Introduce yourself to the teacher and ask about the class schedule.",
        ko: "선생님께 자기소개를 하고 수업 스케줄을 확인하세요."
      }
    },
    {
      id: "language_school_002",
      facility: "LanguageSchool",
      title: { en: "🏫 Language School Mission", ko: "🏫 어학원 미션" },
      scenarioContext: {
            "en": "Olivia is grading placement dialogues in the staff room. She explains that choosing the right proficiency level ensures comfortable and rewarding progress, and reviews course fees.",
            "ko": "올리비아는 교무실에서 레벨 테스트 자료를 검토하고 있습니다. 자신에게 맞는 학습 레벨을 선택해야 부담 없이 즐겁게 배울 수 있으며 수강료 혜택에 대해서도 설명합니다."
      },
      initialGreeting: {
            "en": "Welcome in! Finding the right study level is so important for confidence. How can I help you today?",
            "ko": "어서 오세요! 자신감을 얻으려면 알맞은 레벨을 찾는 게 정말 중요하죠. 오늘 어떤 점이 궁금하신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about class proficiency levels and ask how much the tuition fee is.",
            "ko": "수업 레벨 및 난이도 구분에 대해 묻고 수강료가 얼마인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about class level and tuition costs in the target language.",
            "ko": "학습자가 목표 언어로 반 레벨과 수강료에 대해 매끄럽게 질문함."
      },
      text: {
        en: "Ask the teacher about the class level and the tuition fee.",
        ko: "선생님에게 수업 레벨과 수강료에 대해 물어보세요."
      },
      goal: {
        en: "Ask the teacher about the class level and the tuition fee.",
        ko: "수업 난이도와 수강료에 대해 문의하세요."
      }
    },
    {
      id: "language_school_003",
      facility: "LanguageSchool",
      title: { en: "🏫 Language School Mission", ko: "🏫 어학원 미션" },
      scenarioContext: {
            "en": "Olivia is organizing the calendar of interactive conversation workshops. She discusses how consistent attendance twice or three times a week builds speaking fluency rapidly.",
            "ko": "올리비아는 회화 워크숍 캘린더를 정리하고 있습니다. 주 2~3회 꾸준히 수업에 참여하고 적절한 시간 동안 집중 연습하는 것이 회화 실력 향상에 가장 효과적이라고 강조합니다."
      },
      initialGreeting: {
            "en": "Hello! A consistent routine makes all the difference in speaking. Looking into our weekly classes?",
            "ko": "안녕하세요! 꾸준한 루틴이 말하기 실력의 핵심이죠. 주간 수업 일정에 대해 알아보고 계신가요?"
      },
      hiddenObjective: {
            "en": "Ask how many days per week classes meet and find out how long each session lasts.",
            "ko": "수업이 일주일에 며칠 진행되는지 묻고 한 번에 몇 시간 동안 진행되는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about weekly meeting frequency and class duration in the target language.",
            "ko": "학습자가 목표 언어로 주당 수업 일수와 1회 수업 시간에 대해 정확히 질문함."
      },
      text: {
        en: "Ask how many days per week the class meets and how long each class lasts.",
        ko: "수업이 일주일에 며칠 진행되고 수업 시간이 얼마나 되는지 물어보세요."
      },
      goal: {
        en: "Ask how many days per week the class meets and how long each class lasts.",
        ko: "주당 수업 횟수와 1회 수업 시간을 확인하세요."
      }
    },
    {
      id: "language_school_004",
      facility: "LanguageSchool",
      title: { en: "🏫 Language School Mission", ko: "🏫 어학원 미션" },
      scenarioContext: {
            "en": "Olivia is packing student welcome folders with practice workbooks and notebooks. She shares enrollment steps and outlines the simple materials needed for class.",
            "ko": "올리비아는 학습 교재와 연습 노트를 담은 신입생 꾸러미를 준비하고 있습니다. 등록 절차와 수업 첫날 준비해야 할 교재 및 준비물에 대해 친절히 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome! We're getting everything ready for new students. Thinking about signing up for a class?",
            "ko": "환영해요! 신입 학생들을 위한 준비를 막 마쳤어요. 수업 등록에 관심이 있으신가요?"
      },
      hiddenObjective: {
            "en": "Ask how to enroll in a course and ask what study materials or supplies you should bring.",
            "ko": "수업 등록 절차를 묻고 수업에 참여할 때 챙겨와야 할 교재나 준비물이 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about course registration and required class materials in the target language.",
            "ko": "학습자가 목표 언어로 수강 등록 절차와 준비물에 대해 바르게 질문함."
      },
      text: {
        en: "Ask about joining the class and what materials you need to bring.",
        ko: "수업 등록 방법과 준비해야 할 교재나 준비물을 물어보세요."
      },
      goal: {
        en: "Ask about joining the class and what materials you need to bring.",
        ko: "수강 등록과 수업 준비물을 확인하세요."
      }
    }
  ],
  StudyCenter: [
    {
      id: "study_center_001",
      facility: "StudyCenter",
      title: { en: "📖 Study Center Mission", ko: "📖 스터디 센터 미션" },
      scenarioContext: {
            "en": "Tutor Daniel is setting up study pods and acoustic booths. He emphasizes that having a quiet, dedicated environment with access to study materials accelerates learning.",
            "ko": "튜터 대니얼은 자습 부스와 스터디 룸을 정리하고 있습니다. 방해받지 않고 집중할 수 있는 조용한 자습 공간과 학습 자료를 활용하면 실력이 빠르게 성장한다고 설명합니다."
      },
      initialGreeting: {
            "en": "Hi there! Welcome to the village study center. I'm Tutor Daniel. Looking for a productive place to study?",
            "ko": "반가워요! 마을 스터디 센터에 오신 것을 환영해요. 저는 튜터 대니얼입니다. 집중해서 공부할 공간을 찾고 계신가요?"
      },
      hiddenObjective: {
            "en": "Ask Daniel where you can study independently and inquire what learning materials are available.",
            "ko": "자습할 수 있는 공간이 어디에 있는지 묻고 어떤 학습 자료를 이용할 수 있는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about study spaces and available resources in the target language.",
            "ko": "학습자가 목표 언어로 자습 공간과 학습 자료 이용에 대해 예의 있게 문의함."
      },
      text: {
        en: "Ask the tutor where you can study and ask what study materials are available.",
        ko: "튜터에게 어디서 자습할 수 있는지 묻고 이용 가능한 학습 자료를 확인하세요."
      },
      goal: {
        en: "Ask the tutor where you can study and ask what study materials are available.",
        ko: "자습 공간과 학습 자료에 대해 물어보세요."
      }
    },
    {
      id: "study_center_002",
      facility: "StudyCenter",
      title: { en: "📖 Study Center Mission", ko: "📖 스터디 센터 미션" },
      scenarioContext: {
            "en": "Daniel is drafting daily study routine templates for students. He shares that speaking out loud for fifteen minutes each morning is far more effective than silent cramming.",
            "ko": "대니얼은 학생들을 위한 데일리 학습 루틴 표를 작성하고 있습니다. 눈으로만 보는 것보다 매일 아침 15분씩 소리 내어 말하는 훈련이 가장 효과적인 학습법이라고 추천합니다."
      },
      initialGreeting: {
            "en": "Hello! Effective study habits turn goals into reality. Want to chat about your practice routine?",
            "ko": "안녕하세요! 좋은 공부 습관이 꿈을 현실로 만들어 주죠. 말하기 연습 루틴에 대해 이야기 나눠볼까요?"
      },
      hiddenObjective: {
            "en": "Ask Daniel for the best methods to practice speaking and ask for a recommended study schedule.",
            "ko": "효과적인 회화 연습 팁을 요청하고 추천하는 학습 스케줄에 대해 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player asks about speaking practice techniques and study schedules in the target language.",
            "ko": "학습자가 목표 언어로 회화 공부 요령과 추천 일정에 대해 능숙하게 질문함."
      },
      text: {
        en: "Ask the tutor about the best way to practice speaking and ask for a study schedule.",
        ko: "튜터에게 효과적인 회화 연습 방법과 추천 학습 일정을 물어보세요."
      },
      goal: {
        en: "Ask the tutor about the best way to practice speaking and ask for a study schedule.",
        ko: "회화 연습 팁과 학습 스케줄을 물어보세요."
      }
    },
    {
      id: "study_center_003",
      facility: "StudyCenter",
      title: { en: "📖 Study Center Mission", ko: "📖 스터디 센터 미션" },
      scenarioContext: {
            "en": "Daniel is reviewing beginner reading workbooks on the center shelves. He mentions that illustrated graded readers make vocabulary building enjoyable and answers lending questions.",
            "ko": "대니얼은 센터 서가에 비치된 입문자용 학습 서적들을 점검하고 있습니다. 그림과 대화문이 풍부한 기초 책이 어휘 습득에 아주 좋다며 도서 대여에 대해 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome in! We have a great collection of study guides. Looking for some solid beginner books?",
            "ko": "어서 오세요! 센터에 알찬 학습서들이 많이 구비되어 있어요. 초보자에게 딱 맞는 책을 찾으시나요?"
      },
      hiddenObjective: {
            "en": "Ask Daniel which books are best for beginner learners and check if you are allowed to borrow them.",
            "ko": "초보 학습자에게 좋은 책을 추천해 달라고 하고 센터 외부로 대출이 가능한지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player asks for beginner book recommendations and borrowing options in the target language.",
            "ko": "학습자가 목표 언어로 입문자 도서 추천과 대여 가능 여부를 정확히 질문함."
      },
      text: {
        en: "Ask which books are good for beginner learners and ask if you can borrow them.",
        ko: "초보 학습자에게 좋은 책을 추천받고 대출 가능한지 물어보세요."
      },
      goal: {
        en: "Ask which books are good for beginner learners and ask if you can borrow them.",
        ko: "입문자용 교재 추천과 대출 가능 여부를 확인하세요."
      }
    },
    {
      id: "study_center_004",
      facility: "StudyCenter",
      title: { en: "📖 Study Center Mission", ko: "📖 스터디 센터 미션" },
      scenarioContext: {
            "en": "Daniel is writing vocabulary retention tips on the resource wall. He shares that learning words in thematic situational pairs helps them stick long term without stress.",
            "ko": "대니얼은 게시판에 단어 암기 비결 메모를 붙이고 있습니다. 무작정 외우기보다 상황별 짝꿍 표현으로 묶어서 익히면 잊어버리지 않고 오래 기억된다고 조언합니다."
      },
      initialGreeting: {
            "en": "Hi! Expanding your vocabulary is a super power in any language. Want a quick learning tip?",
            "ko": "안녕하세요! 어휘력을 늘리는 것은 어학 학습의 가장 큰 무기죠. 유용한 공부 팁이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Ask Daniel how to build and improve vocabulary effectively and request a useful study tip.",
            "ko": "어휘력을 효과적으로 늘리는 방법을 묻고 유용한 학습 팁을 하나 추천해 달라고 요청하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about vocabulary building methods and study tips in the target language.",
            "ko": "학습자가 목표 언어로 어휘 학습법과 실전 팁에 대해 질문함."
      },
      text: {
        en: "Ask the tutor how to improve your vocabulary and ask for one useful study tip.",
        ko: "튜터에게 어휘력을 늘리는 방법과 유용한 학습 팁을 물어보세요."
      },
      goal: {
        en: "Ask the tutor how to improve your vocabulary and ask for one useful study tip.",
        ko: "단어 암기 방법과 학습 꿀팁을 문의하세요."
      }
    }
  ],
  CommunityCenter: [
    {
      id: "community_center_001",
      facility: "CommunityCenter",
      title: { en: "🏛️ Community Center Mission", ko: "🏛️ 주민센터 미션" },
      scenarioContext: {
            "en": "Mina is stamping official village civil documents at the service counter. She mentions that having proof of residence simplifies everyday tasks in the village.",
            "ko": "미나는 행정 민원 창구에서 공인 서류를 확인하고 있습니다. 마을 거주 증명서를 발급해 두면 각종 마을 시설과 혜택을 이용할 때 매우 편리하다고 안내합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the village community center. I'm Mina. How can I help with your municipal paperwork?",
            "ko": "안녕하세요! 마을 주민센터에 오신 것을 환영해요. 저는 미나입니다. 오늘 행정 서류 관련해 어떤 도움이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Ask Mina where to apply for a residence certificate and find out what supporting documents you need.",
            "ko": "거주 증명서를 어디서 발급받는지 묻고 발급 신청에 필요한 서류가 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about residence certificate issuance and required documents in the target language.",
            "ko": "학습자가 목표 언어로 거주 증명서 발급처와 지참 서류를 올바르게 문의함."
      },
      text: {
        en: "Ask the staff member where you can get a residence certificate and ask what documents you need.",
        ko: "담당자에게 거주 증명서를 어디서 발급받을 수 있는지 묻고 필요 서류를 확인하세요."
      },
      goal: {
        en: "Ask the staff member where you can get a residence certificate and ask what documents you need.",
        ko: "거주 증명서 발급 장소와 제출 서류를 확인하세요."
      }
    },
    {
      id: "community_center_002",
      facility: "CommunityCenter",
      title: { en: "🏛️ Community Center Mission", ko: "🏛️ 주민센터 미션" },
      scenarioContext: {
            "en": "Mina is posting flyers for neighborhood cultural exchange workshops. She explains that participating in local events is the fastest way to feel connected to the village community.",
            "ko": "미나는 마을 문화 교류 프로그램 안내 전단을 게시판에 부착하고 있습니다. 이웃들과 함께하는 주민 활동에 참여하면 마을 생활에 금방 적응할 수 있다고 이야기합니다."
      },
      initialGreeting: {
            "en": "Good day! We have exciting neighborhood activities lined up this month. Interested in our programs?",
            "ko": "좋은 날이에요! 이번 달에 알찬 주민 프로그램들이 많이 준비되어 있어요. 마을 프로그램에 관심 있으신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about upcoming community programs and ask when they take place.",
            "ko": "주민들을 위한 지역 프로그램에 대해 문의하고 언제 진행되는지 일정을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about community activities and schedules in the target language.",
            "ko": "학습자가 목표 언어로 주민 프로그램 종류와 진행 일정을 자연스럽게 질문함."
      },
      text: {
        en: "Ask about a local community program and ask when it takes place.",
        ko: "지역 주민 프로그램에 대해 문의하고 언제 진행되는지 물어보세요."
      },
      goal: {
        en: "Ask about a local community program and ask when it takes place.",
        ko: "주민 강좌 및 활동 프로그램의 일정을 확인하세요."
      }
    },
    {
      id: "community_center_003",
      facility: "CommunityCenter",
      title: { en: "🏛️ Community Center Mission", ko: "🏛️ 주민센터 미션" },
      scenarioContext: {
            "en": "Mina is assisting newly arrived residents with registration files. She explains that submitting your resident registration paperwork ensures access to village services.",
            "ko": "미나는 새로 전입한 주민들의 등록 서류를 접수하고 있습니다. 전입 후 주민등록 관련 서류를 접수하면 마을 복지 혜택을 즉시 받을 수 있으며 처리 기간에 대해 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome! Our center helps make settlement in the village smooth. Are you registering as a resident?",
            "ko": "어서 오세요! 주민 여러분의 편안한 정착을 돕는 곳이에요. 오늘 주민등록 관련으로 오셨나요?"
      },
      hiddenObjective: {
            "en": "Ask how to obtain resident registration documents and inquire about the expected processing time.",
            "ko": "주민등록 관련 서류를 어떻게 발급받는지 묻고 처리하는 데 시간이 얼마나 걸리는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about registration documents and processing times in the target language.",
            "ko": "학습자가 목표 언어로 등록 서류 발급 방법과 소요 시간을 정확히 문의함."
      },
      text: {
        en: "Ask how to get a local resident registration document and ask about the processing time.",
        ko: "주민등록 관련 서류 발급 방법과 처리 기간을 물어보세요."
      },
      goal: {
        en: "Ask how to get a local resident registration document and ask about the processing time.",
        ko: "등록 서류 발급 절차와 소요 시간을 확인하세요."
      }
    },
    {
      id: "community_center_004",
      facility: "CommunityCenter",
      title: { en: "🏛️ Community Center Mission", ko: "🏛️ 주민센터 미션" },
      scenarioContext: {
            "en": "Mina is compiling a welcome guidebook for newcomers. She talks about the diverse municipal services offered here, including multilingual guides and youth clubs.",
            "ko": "미나는 신규 주민들을 위한 마을 안내 가이드북을 편집하고 있습니다. 다국어 통역 지원, 문화 강좌 등 새로 온 주민에게 특히 유용한 혜택들을 소개합니다."
      },
      initialGreeting: {
            "en": "Hello there! The community center provides many services for village life. Looking for helpful resources?",
            "ko": "안녕하세요! 주민센터에는 실생활에 유용한 서비스가 정말 많아요. 도움이 되는 혜택을 찾고 계신가요?"
      },
      hiddenObjective: {
            "en": "Ask what services the center offers and ask which one is especially recommended for new residents.",
            "ko": "주민센터에서 제공하는 주요 서비스를 묻고 새로 온 주민에게 가장 유용한 혜택이 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about center services and recommendations for new residents in the target language.",
            "ko": "학습자가 목표 언어로 센터 서비스 내용과 신규 주민 추천 혜택을 정중히 질문함."
      },
      text: {
        en: "Ask what services the community center provides and ask which service is useful for new residents.",
        ko: "주민센터에서 제공하는 서비스와 새로 온 주민에게 유용한 혜택을 물어보세요."
      },
      goal: {
        en: "Ask what services the community center provides and ask which service is useful for new residents.",
        ko: "센터 주요 지원 서비스와 신규 주민 추천 혜택을 물어보세요."
      }
    }
  ],
  CareerCenter: [
    {
      id: "career_center_001",
      facility: "CareerCenter",
      title: { en: "💼 Career Center Mission", ko: "💼 취업지원센터 미션" },
      scenarioContext: {
            "en": "James is pinning new village job postings onto the board. He shares that part-time positions in cafes, bookstores, and markets are ideal for practicing everyday conversational language.",
            "ko": "제임스는 게시판에 새로운 마을 구인 공고를 붙이고 있습니다. 카페나 서점, 상점에서 일하는 시간제 일자리가 실생활 회화를 자연스럽게 연습하기에 안성맞춤이라고 조언합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the village career center. I'm James. Are you exploring work opportunities?",
            "ko": "안녕하세요! 진로 취업 센터에 오신 걸 환영해요. 저는 제임스입니다. 새로운 일자리를 알아보고 계신가요?"
      },
      hiddenObjective: {
            "en": "Ask James about finding part-time work and find out what types of jobs are currently open.",
            "ko": "아르바이트 구직에 대해 문의하고 현재 어떤 직종의 일자리가 있는지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about part-time work and job openings in the target language.",
            "ko": "학습자가 목표 언어로 시간제 일자리와 모집 분야에 대해 바르게 질문함."
      },
      text: {
        en: "Ask the career counselor about finding a part-time job and ask what kind of jobs are available.",
        ko: "직업 상담사에게 아르바이트 구직에 대해 문의하고 가능한 일자리를 물어보세요."
      },
      goal: {
        en: "Ask the career counselor about finding a part-time job and ask what kind of jobs are available.",
        ko: "시간제 일자리 정보와 구인 직종을 문의하세요."
      }
    },
    {
      id: "career_center_002",
      facility: "CareerCenter",
      title: { en: "💼 Career Center Mission", ko: "💼 취업지원센터 미션" },
      scenarioContext: {
            "en": "James is running a resume workshop clinic. He explains that keeping a resume clear, concise, and highlighting language competencies makes an outstanding first impression.",
            "ko": "제임스는 이력서 첨삭 워크숍을 진행하고 있습니다. 이력서는 명확하고 간결해야 하며 어학 소통 능력을 강조하는 것이 고용주에게 좋은 첫인상을 준다고 설명합니다."
      },
      initialGreeting: {
            "en": "Good day! A strong resume is your ticket to great opportunities. Need some guidance on preparing yours?",
            "ko": "좋은 날이에요! 탄탄한 이력서가 좋은 기회의 문을 열어주죠. 이력서 작성에 도움이 필요하신가요?"
      },
      hiddenObjective: {
            "en": "Ask how to write an effective resume and find out what key sections must be included.",
            "ko": "효과적인 이력서 작성 요령을 묻고 반드시 포함해야 할 주요 항목이 무엇인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks for resume preparation advice and necessary details in the target language.",
            "ko": "학습자가 목표 언어로 이력서 작성 방법과 필수 기재 항목을 매끄럽게 질문함."
      },
      text: {
        en: "Ask how to prepare a resume and ask what information should be included.",
        ko: "이력서 작성 방법과 포함해야 할 주요 정보를 물어보세요."
      },
      goal: {
        en: "Ask how to prepare a resume and ask what information should be included.",
        ko: "이력서 작성 요령과 필수 항목을 확인하세요."
      }
    },
    {
      id: "career_center_003",
      facility: "CareerCenter",
      title: { en: "💼 Career Center Mission", ko: "💼 취업지원센터 미션" },
      scenarioContext: {
            "en": "James is setting up mock interview stations. He points out that practicing calm answers to common questions and researching the company beforehand boosts interview confidence.",
            "ko": "제임스는 실전 모의 면접장을 준비하고 있습니다. 예상 질문에 차분하게 답변하는 연습을 하고 방문 전 회사 정보를 미리 파악하는 것이 면접 합격의 열쇠라고 강조합니다."
      },
      initialGreeting: {
            "en": "Welcome in! Interview preparation can feel daunting, but practice makes it easy. What can I help with?",
            "ko": "어서 오세요! 면접 준비가 긴장될 수 있지만 연습하면 자신감이 생겨요. 오늘 어떤 도움이 필요하세요?"
      },
      hiddenObjective: {
            "en": "Ask for advice on passing job interviews and ask what preparation steps should be taken prior to an interview.",
            "ko": "면접 합격을 위한 조언을 요청하고 면접 전에 미리 준비해야 할 사항이 무엇인지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player asks for interview tips and preparation steps in the target language.",
            "ko": "학습자가 목표 언어로 취업 면접 조언과 사전 준비 사항에 대해 명확히 질문함."
      },
      text: {
        en: "Ask for advice about a job interview and ask what you should do before the interview.",
        ko: "면접 조언을 요청하고 면접 전에 준비해야 할 사항을 물어보세요."
      },
      goal: {
        en: "Ask for advice about a job interview and ask what you should do before the interview.",
        ko: "취업 면접 팁과 사전 준비 사항을 문의하세요."
      }
    },
    {
      id: "career_center_004",
      facility: "CareerCenter",
      title: { en: "💼 Career Center Mission", ko: "💼 취업지원센터 미션" },
      scenarioContext: {
            "en": "James is distributing brochures for vocational skills programs. He mentions that free community skill courses help residents transition into rewarding local careers.",
            "ko": "제임스는 직업 훈련 기술 과정 안내서를 배포하고 있습니다. 무료 직업 교육 프로그램을 이수하면 원하는 분야로 성공적으로 취업하는 데 큰 디딤돌이 된다고 안내합니다."
      },
      initialGreeting: {
            "en": "Hello! We offer wonderful career development courses here. Interested in learning new skills?",
            "ko": "안녕하세요! 센터에서 다양한 직업 역량 교육을 운영하고 있어요. 새로운 기술을 배워보고 싶으신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about job training programs and ask how to register for them.",
            "ko": "직업 훈련 교육 과정에 대해 문의하고 신청 및 등록 방법을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about vocational training courses and the application process in the target language.",
            "ko": "학습자가 목표 언어로 직업 훈련 프로그램과 신청 절차에 대해 바르게 문의함."
      },
      text: {
        en: "Ask about job training programs and ask how to apply for one.",
        ko: "직업 훈련 프로그램에 대해 문의하고 신청 방법을 물어보세요."
      },
      goal: {
        en: "Ask about job training programs and ask how to apply for one.",
        ko: "직업 교육 과정과 수강 신청 절차를 확인하세요."
      }
    }
  ],
  ActivityCenter: [
    {
      id: "activity_center_001",
      facility: "ActivityCenter",
      title: { en: "🎨 Activity Center Mission", ko: "🎨 문화활동센터 미션" },
      scenarioContext: {
            "en": "Hana is putting up decorations for weekend hobby clubs. She is excited about the conversation meetup, where locals and language learners chat over snacks and games.",
            "ko": "하나는 주말 취미 동아리 모임을 위해 교실을 꾸미고 있습니다. 주민들과 언어 학습자들이 간식을 나누며 게임과 대화를 즐기는 회화 클럽에 대해 신나게 소개합니다."
      },
      initialGreeting: {
            "en": "Hi! Welcome to the village activity center! I'm Hana. Looking to join in on the fun this week?",
            "ko": "안녕하세요! 마을 활동 센터에 오신 것을 환영해요! 저는 하나입니다. 이번 주 재미있는 활동에 참여해 보실래요?"
      },
      hiddenObjective: {
            "en": "Ask Hana what activities are available and find out when the language conversation club meets.",
            "ko": "어떤 문화 활동 프로그램이 있는지 묻고 회화 동아리 모임이 언제 열리는지 일정을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about community activities and conversation club meeting times in the target language.",
            "ko": "학습자가 목표 언어로 활동 센터 프로그램과 회화 클럽 모임 일정을 자연스럽게 질문함."
      },
      text: {
        en: "Ask the coordinator what community activities are available and ask when the conversation club meets.",
        ko: "담당자에게 어떤 문화 활동이 있는지 묻고 회화 클럽 모임 일정을 확인하세요."
      },
      goal: {
        en: "Ask the coordinator what community activities are available and ask when the conversation club meets.",
        ko: "이용 가능한 활동과 동아리 모임 시간을 확인하세요."
      }
    },
    {
      id: "activity_center_002",
      facility: "ActivityCenter",
      title: { en: "🎨 Activity Center Mission", ko: "🎨 문화활동센터 미션" },
      scenarioContext: {
            "en": "Hana is mixing watercolors and preparing pottery clay in the craft studio. She explains that creative art workshops help everyone relax while chatting in a supportive group.",
            "ko": "하나는 공예 작업실에서 수채화 물감을 정리하고 도예 흙을 준비하고 있습니다. 창의적인 미술 수업에 참여하면 편안한 분위기에서 사람들과 어울리며 힐링할 수 있다고 설명합니다."
      },
      initialGreeting: {
            "en": "Hello! The art room is smelling like paint and fresh clay today. Thinking about trying an art class?",
            "ko": "안녕하세요! 오늘 미술실에 물감과 흙 냄새가 향긋하네요. 미술 강좌에 한번 참여해 보실래요?"
      },
      hiddenObjective: {
            "en": "Ask about joining the art class and check if there are specific materials you need to supply.",
            "ko": "미술 강좌에 대해 문의하고 수강할 때 개인적으로 준비해야 할 준비물이 있는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about the art class and required supplies in the target language.",
            "ko": "학습자가 목표 언어로 미술 수업 내용과 개인 준비물 여부를 정중하게 질문함."
      },
      text: {
        en: "Ask about an art class and ask what materials you need to bring.",
        ko: "미술 강좌에 대해 문의하고 준비해야 할 재료가 있는지 물어보세요."
      },
      goal: {
        en: "Ask about an art class and ask what materials you need to bring.",
        ko: "미술 수업과 필요한 준비물을 확인하세요."
      }
    },
    {
      id: "activity_center_003",
      facility: "ActivityCenter",
      title: { en: "🎨 Activity Center Mission", ko: "🎨 문화활동센터 미션" },
      scenarioContext: {
            "en": "Hana is setting out cutting boards and fresh herbs in the teaching kitchen. She talks about the upcoming village cooking class, exploring global recipes together.",
            "ko": "하나는 요리 실습실에 도마와 신선한 허브를 세팅하고 있습니다. 다양한 나라의 가정식을 직접 만들어보는 요리 교실이 곧 열린다며 참가비와 메뉴를 안내합니다."
      },
      initialGreeting: {
            "en": "Good day! The kitchen is all set for culinary adventures. Are you interested in cooking with us?",
            "ko": "좋은 날이에요! 맛있는 요리를 함께 만들 준비가 끝났어요. 요리 교실에 관심이 있으신가요?"
      },
      hiddenObjective: {
            "en": "Inquire about the cooking workshop and find out how much it costs to join.",
            "ko": "요리 강좌에 대해 문의하고 수업에 참여하려면 참가비가 얼마인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the cooking class and its participation fee in the target language.",
            "ko": "학습자가 목표 언어로 요리 수업 내용과 참가 비용을 명확하게 질문함."
      },
      text: {
        en: "Ask about a cooking class and ask how much it costs to join.",
        ko: "요리 강좌에 대해 문의하고 참가비가 얼마인지 물어보세요."
      },
      goal: {
        en: "Ask about a cooking class and ask how much it costs to join.",
        ko: "요리 수업 내용과 참가 비용을 확인하세요."
      }
    },
    {
      id: "activity_center_004",
      facility: "ActivityCenter",
      title: { en: "🎨 Activity Center Mission", ko: "🎨 문화활동센터 미션" },
      scenarioContext: {
            "en": "Hana is reviewing registration lists for social mixer events. She notes that our interactive weekend games and outdoor walks are the friendliest ways to make local friends.",
            "ko": "하나는 친목 모임 참가자 명단을 확인하고 있습니다. 주말 보드게임이나 가벼운 야외 산책 모임이 새로운 이웃 친구를 사귀기에 가장 부담 없고 즐겁다고 추천합니다."
      },
      initialGreeting: {
            "en": "Welcome! Meeting people and making friends is what we do best here. Looking to connect with locals?",
            "ko": "어서 오세요! 새로운 친구를 사귀는 데 저희 센터가 최고죠. 이웃들과 친해지고 싶으신가요?"
      },
      hiddenObjective: {
            "en": "Ask which activity is best for meeting new people and find out when the next session starts.",
            "ko": "새로운 사람들을 만나기에 가장 좋은 활동이 무엇인지 묻고 다음 모임이 언제 시작되는지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about social activities and their start times in the target language.",
            "ko": "학습자가 목표 언어로 친목 추천 프로그램과 시작 일정을 바르게 질문함."
      },
      text: {
        en: "Ask which activity is good for meeting new people and ask when the next activity starts.",
        ko: "새로운 친구를 사귀기에 좋은 활동과 다음 일정을 물어보세요."
      },
      goal: {
        en: "Ask which activity is good for meeting new people and ask when the next activity starts.",
        ko: "친목 추천 프로그램과 시작 일정을 문의하세요."
      }
    }
  ],
  MultiPurposeHall: [
    {
      id: "multi_purpose_hall_001",
      facility: "MultiPurposeHall",
      title: { en: "🏛️ Multi-Purpose Hall Mission", ko: "🏛️ 다목적홀 미션" },
      scenarioContext: {
            "en": "Yuri is arranging chairs in the main auditorium for village gatherings. She explains that the hall hosts public town forums, guest speaker lectures, and resident performances.",
            "ko": "유리는 마을 행사를 위해 대강당의 의자를 정돈하고 있습니다. 복지관 다목적홀에서는 주민 총회, 명사 초청 강연, 문화 공연 등 다채로운 행사가 열린다고 안내합니다."
      },
      initialGreeting: {
            "en": "Hello! Welcome to the village multi-purpose hall. I'm Yuri. Are you attending a community event?",
            "ko": "안녕하세요! 마을 다목적 복지관에 오신 것을 환영해요. 저는 유리입니다. 오늘 마을 행사에 오셨나요?"
      },
      hiddenObjective: {
            "en": "Ask Yuri what events take place in the hall and find out when the next community town meeting is scheduled.",
            "ko": "다목적홀에서 어떤 행사가 열리는지 묻고 다음 주민 회의 일정이 언제인지 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player inquires about hall events and the town meeting schedule in the target language.",
            "ko": "학습자가 목표 언어로 복지관 주요 행사와 차기 주민 회의 일정을 올바르게 질문함."
      },
      text: {
        en: "Ask the coordinator what events are held in the hall and ask when the next community meeting is.",
        ko: "담당자에게 다목적실에서 열리는 행사를 묻고 다음 주민 회의 일정을 확인하세요."
      },
      goal: {
        en: "Ask the coordinator what events are held in the hall and ask when the next community meeting is.",
        ko: "홀 행사 안내와 다음 주민 회의 일정을 확인하세요."
      }
    },
    {
      id: "multi_purpose_hall_002",
      facility: "MultiPurposeHall",
      title: { en: "🏛️ Multi-Purpose Hall Mission", ko: "🏛️ 다목적홀 미션" },
      scenarioContext: {
            "en": "Yuri is testing the sound system and projector for a cultural presentation. She checks the program schedule and answers questions about start times and seating.",
            "ko": "유리는 문화 발표회를 앞두고 무대 음향과 빔프로젝터를 점검하고 있습니다. 프로그램 순서표를 확인하며 발표 행사 시작 시간과 좌석 안내를 친절하게 돕습니다."
      },
      initialGreeting: {
            "en": "Good day! We're running sound checks for today's presentation. How can I assist you in the hall?",
            "ko": "좋은 날이에요! 오늘 발표회 행사를 위해 음향을 체크하던 중이었어요. 어떤 점을 안내해 드릴까요?"
      },
      hiddenObjective: {
            "en": "Ask about the presentation event program and confirm what time it is scheduled to start.",
            "ko": "발표회 행사에 대해 묻고 행사가 몇 시에 시작되는지 시간을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the presentation event and start time in the target language.",
            "ko": "학습자가 목표 언어로 발표 행사 내용과 시작 시간을 명확하게 질문함."
      },
      text: {
        en: "Ask about the presentation event and ask what time it starts.",
        ko: "발표회 행사에 대해 묻고 시작 시간을 확인하세요."
      },
      goal: {
        en: "Ask about the presentation event and ask what time it starts.",
        ko: "발표 행사 프로그램과 시작 시간을 문의하세요."
      }
    },
    {
      id: "multi_purpose_hall_003",
      facility: "MultiPurposeHall",
      title: { en: "🏛️ Multi-Purpose Hall Mission", ko: "🏛️ 다목적홀 미션" },
      scenarioContext: {
            "en": "Yuri is laying out registration sheets for a hands-on resident workshop. She outlines the workshop theme and explains whether attendees need to bring anything along.",
            "ko": "유리는 체험형 주민 워크숍 등록 명부를 책상에 펼치고 있습니다. 워크숍 주제와 실습 내용을 설명하며 참가자가 따로 챙겨와야 할 준비물이 있는지 안내합니다."
      },
      initialGreeting: {
            "en": "Welcome! Our workshops are always lively and hands-on. Are you looking into joining one of our sessions?",
            "ko": "환영해요! 저희 워크숍은 늘 활기차고 직접 체험해 볼 수 있어 인기가 많아요. 워크숍에 참여해 보시겠어요?"
      },
      hiddenObjective: {
            "en": "Inquire about the resident workshop and ask if there are supplies or materials you should bring.",
            "ko": "주민 워크숍에 대해 문의하고 참가할 때 준비해야 할 준비물이 있는지 물어보세요."
      },
      evaluationCriteria: {
            "en": "Player asks about the workshop and required materials in the target language.",
            "ko": "학습자가 목표 언어로 워크숍 참여 방법과 준비물 지참 여부를 정확히 문의함."
      },
      text: {
        en: "Ask about a resident workshop and ask what you need to bring.",
        ko: "주민 워크숍에 대해 문의하고 준비물이 필요한지 물어보세요."
      },
      goal: {
        en: "Ask about a resident workshop and ask what you need to bring.",
        ko: "워크숍 내용과 참가자 준비물을 확인하세요."
      }
    },
    {
      id: "multi_purpose_hall_004",
      facility: "MultiPurposeHall",
      title: { en: "🏛️ Multi-Purpose Hall Mission", ko: "🏛️ 다목적홀 미션" },
      scenarioContext: {
            "en": "Yuri is organizing the upcoming seasonal village festival calendar. She points out that the evening social festival is the top gathering for connecting with long-time village locals.",
            "ko": "유리는 계절 마을 축제 일정표를 정리하고 있습니다. 저녁에 열리는 마을 주민 교류 축제가 이웃들과 인사를 나누고 친분을 쌓기에 가장 좋은 자리라고 소개합니다."
      },
      initialGreeting: {
            "en": "Hello there! The hall brings everyone together in the village. Looking for a great community gathering?",
            "ko": "안녕하세요! 다목적홀은 마을 주민 모두가 모이는 따뜻한 공간이에요. 이웃들과 어울릴 행사를 찾으시나요?"
      },
      hiddenObjective: {
            "en": "Ask which gathering is best for meeting local residents and find out when it will take place.",
            "ko": "이웃 주민들을 만나 교류하기에 가장 좋은 행사가 무엇인지 묻고 언제 열리는지 일정을 확인하세요."
      },
      evaluationCriteria: {
            "en": "Player asks about community gatherings for meeting residents and their schedules in the target language.",
            "ko": "학습자가 목표 언어로 주민 교류 행사 추천과 개최 일정을 매끄럽게 질문함."
      },
      text: {
        en: "Ask which event is good for meeting local residents and ask when it will happen.",
        ko: "이웃 주민들과 교류하기 좋은 행사를 묻고 언제 열리는지 확인하세요."
      },
      goal: {
        en: "Ask which event is good for meeting local residents and ask when it will happen.",
        ko: "주민 교류 행사 추천과 개최 일정을 물어보세요."
      }
    }
  ]
};

/**
 * Returns the missions list for a facility, defaulting to empty array if unknown.
 *
 * @param {string} facility
 * @returns {Array}
 */
export function getFacilityMissions(facility) {
  if (!facility) return [];
  return MISSIONS_CATALOG[facility] || [];
}

/**
 * Returns a localized projection of a mission object for UI display.
 * The returned object retains stable `id`, `facility`, `requiredItems`,
 * and replaces `title` and `text` with strings in the chosen interface language.
 *
 * @param {Object} mission
 * @param {"en"|"ko"} [interfaceLanguage="en"]
 * @returns {Object}
 */
export function getLocalizedMission(mission, interfaceLanguage = "en") {
  if (!mission) return null;
  const lang = interfaceLanguage === "ko" ? "ko" : "en";

  const title =
    typeof mission.title === "object"
      ? (mission.title[lang] || mission.title.en || "")
      : (mission.title || "");

  const text =
    typeof mission.text === "object"
      ? (mission.text[lang] || mission.text.en || "")
      : (mission.text || "");

  const goal =
    typeof mission.goal === "object"
      ? (mission.goal[lang] || mission.goal.en || "")
      : (mission.goal || text);

  return {
    ...mission,
    title,
    text,
    goal,
    rawMission: mission
  };
}

/**
 * Returns the mission goal in the specific language requested
 * (e.g. for Groq prompt evaluation or learning hints).
 *
 * @param {Object} mission
 * @param {"en"|"ko"} [lang="en"]
 * @returns {string}
 */

/**
 * Returns the hidden objective in the requested language (for evaluation).
 *
 * @param {Object} mission
 * @param {"en"|"ko"} [lang="en"]
 * @returns {string}
 */
export function getMissionHiddenObjective(mission, lang = "en") {
  if (!mission) return "";
  const target = lang === "ko" ? "ko" : "en";
  if (mission.hiddenObjective && typeof mission.hiddenObjective === "object") {
    return mission.hiddenObjective[target] || mission.hiddenObjective.en || "";
  }
  return getMissionGoal(mission, lang);
}

/**
 * Returns the scenario context in the requested language.
 *
 * @param {Object} mission
 * @param {"en"|"ko"} [lang="en"]
 * @returns {string}
 */
export function getMissionScenarioContext(mission, lang = "en") {
  if (!mission) return "";
  const target = lang === "ko" ? "ko" : "en";
  if (mission.scenarioContext && typeof mission.scenarioContext === "object") {
    return mission.scenarioContext[target] || mission.scenarioContext.en || "";
  }
  return "";
}

/**
 * Returns the scenario initial greeting in the requested language if available.
 *
 * @param {Object} mission
 * @param {"en"|"ko"} [lang="en"]
 * @returns {string|null}
 */
export function getMissionInitialGreeting(mission, lang = "en") {
  if (!mission) return null;
  const target = lang === "ko" ? "ko" : "en";
  if (mission.initialGreeting && typeof mission.initialGreeting === "object") {
    return mission.initialGreeting[target] || mission.initialGreeting.en || null;
  }
  return null;
}

export function getMissionGoal(mission, lang = "en") {
  if (!mission) return "";
  const target = lang === "ko" ? "ko" : "en";
  if (mission.goal && typeof mission.goal === "object") {
    return mission.goal[target] || mission.goal.en || "";
  }
  if (mission.text && typeof mission.text === "object") {
    return mission.text[target] || mission.text.en || "";
  }
  return mission.goal || mission.text || "";
}

/**
 * Find mission by its stable ID across all facilities.
 *
 * @param {string} missionId
 * @returns {Object|null}
 */
export function findMissionById(missionId) {
  if (!missionId) return null;
  for (const facility of Object.keys(MISSIONS_CATALOG)) {
    const found = MISSIONS_CATALOG[facility].find((m) => m.id === missionId);
    if (found) return found;
  }
  return null;
}

/**
 * Selects the next mission using a robust variety, rotation, and anti-repeat system.
 * Prioritizes uncompleted missions from the pool.
 * When all missions have been completed or repeated, rotates through valid candidates,
 * avoiding immediate consecutive repeats.
 *
 * @param {Array} missions - Available missions for a facility
 * @param {Object} [options={}]
 * @param {Object} [options.lastIndexRef=null] - Mutable ref tracking last selected index
 * @param {Array<string>} [options.recentMissionIds=[]] - Array of recently completed or selected mission IDs
 * @param {Array<string>} [options.completedMissionIds=[]] - Array of all completed mission IDs for the user
 * @returns {Object|null} Selected mission
 */
export function selectNextMission(
  missions,
  {
    lastIndexRef = null,
    recentMissionIds = [],
    completedMissionIds = []
  } = {}
) {
  if (!missions || !Array.isArray(missions) || missions.length === 0) return null;
  if (missions.length === 1) {
    if (lastIndexRef) lastIndexRef.current = 0;
    return missions[0];
  }

  const completedSet = new Set(Array.isArray(completedMissionIds) ? completedMissionIds : []);
  const uncompleted = missions.filter((m) => m && m.id && !completedSet.has(m.id));

  // If there are uncompleted missions, choose exclusively among them; otherwise use full pool
  const candidatePool = uncompleted.length > 0 ? uncompleted : missions;

  // Exclude recent mission history if alternatives exist in candidatePool
  const recentArray = Array.isArray(recentMissionIds) ? recentMissionIds : [];
  const recentSet = new Set(recentArray);

  let filteredCandidates = candidatePool.filter((m) => !recentSet.has(m.id));
  if (filteredCandidates.length === 0) {
    // If all candidates are in recentSet, exclude only the single most recently assigned mission
    const lastAssignedId = recentArray.length > 0 ? recentArray[recentArray.length - 1] : null;
    filteredCandidates =
      candidatePool.length > 1 && lastAssignedId
        ? candidatePool.filter((m) => m.id !== lastAssignedId)
        : candidatePool;
  }

  if (filteredCandidates.length === 0) {
    filteredCandidates = candidatePool;
  }

  // Deterministic progression / rotation through filtered candidates
  let selectedMission = null;
  const lastIndex =
    lastIndexRef && typeof lastIndexRef.current === "number" ? lastIndexRef.current : -1;

  if (lastIndex >= 0) {
    // Look for the candidate with the lowest index > lastIndex in missions
    selectedMission = filteredCandidates.find((m) => missions.indexOf(m) > lastIndex);
  }

  // Wrap around or initial selection
  if (!selectedMission) {
    selectedMission = filteredCandidates[0];
  }

  // Update lastIndexRef with the index relative to the main missions array if found
  if (lastIndexRef) {
    const mainIndex = missions.findIndex((m) => m.id === selectedMission.id);
    lastIndexRef.current = mainIndex >= 0 ? mainIndex : 0;
  }

  return selectedMission;
}

/**
 * Picks a random mission avoiding immediate consecutive repetition.
 * Fully backwards-compatible with existing call sites.
 *
 * @param {Array} missions
 * @param {Object} lastIndexRef
 * @returns {Object}
 */
export function getRandomMission(missions, lastIndexRef) {
  return selectNextMission(missions, { lastIndexRef });
}

