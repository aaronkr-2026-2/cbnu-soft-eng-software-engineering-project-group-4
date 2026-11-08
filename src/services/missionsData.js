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

