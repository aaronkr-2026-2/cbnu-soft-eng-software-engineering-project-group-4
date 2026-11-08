/**
 * i18n.js
 * Centralized internationalization dictionary and translation helper for AI-Language-Village.
 * Supports independent Interface Language (en | ko) and Learning Language (en | ko).
 */

export const SUPPORTED_INTERFACE_LANGUAGES = ["en", "ko"];
export const SUPPORTED_LEARNING_LANGUAGES = ["en", "ko"];
export const SUPPORTED_LEARNING_LEVELS = ["beginner", "intermediate", "advanced"];

export const TRANSLATIONS = {
  en: {
    common: {
      ok: "OK",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      retry: "Retry",
      close: "Close",
      back: "Back",
      continue: "Continue",
      finish: "Finish & Enter Village 🏡",
      skip: "Skip & Enter",
      error: "Error",
      success: "Success",
      loading: "Loading village...",
      logOut: "Log Out",
      settings: "Settings",
      statistics: "Statistics",
      dismiss: "Dismiss",
      edit: "Edit",
      student: "Student"
    },
    auth: {
      brandTitle: "AI Language Village",
      brandSubtitle: "Immersive 3D Spoken Language Learning",
      welcomeBack: "Welcome back! Sign in to continue your journey.",
      createAccountSubtitle: "Create your account to start practicing languages in the 3D village.",
      resetPasswordSubtitle: "Enter your registered email and we'll send you a password reset link.",
      verifyEmailSubtitle: "We sent a verification link to your email. Please verify to enter the village.",
      loginTab: "Sign In",
      registerTab: "Create Account",
      forgotPasswordTab: "Reset Password",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email Address",
      emailPlaceholder: "name@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 6 characters",
      signInBtn: "Sign In",
      signUpBtn: "Create Account",
      resetPasswordBtn: "Send Reset Link",
      googleSignInBtn: "Continue with Google",
      orDivider: "or continue with email",
      noAccountPrompt: "Don't have an account?",
      haveAccountPrompt: "Already have an account?",
      signUpLink: "Sign up",
      signInLink: "Sign in",
      forgotPasswordLink: "Forgot password?",
      backToLogin: "← Back to Sign In",
      checkVerificationBtn: "I Verified My Email — Enter Village",
      resendVerificationBtn: "Resend Verification Email",
      signOutSwitchAccount: "Log out / Switch account",
      verifSentNotice: "Verification link sent! Please check your email inbox.",
      emailVerifiedSuccess: "Email verified successfully! Entering the village...",
      emailNotVerifiedYet: "Email not verified yet. Please click the link in your email, then click this button again.",
      missingName: "Please enter your name.",
      missingEmail: "Please enter a valid email address.",
      missingCredentials: "Please enter both email and password.",
      weakPassword: "Password must be at least 6 characters.",
      resetSentNotice: "Password reset email sent! Check your inbox for instructions.",
      langSwitchLabel: "Language",
      signOut: "Log Out"
    },
    onboarding: {
      stepIndicator: "Step {current} of {total}",
      welcomeStudent: "Welcome, {name}",
      interfaceLangTitle: "Choose your Interface Language",
      interfaceLangSubtitle: "This sets the language for menus, instructions, buttons, and teacher feedback.",
      learningLangTitle: "What language do you want to learn?",
      learningLangSubtitle: "Choose your practice language for conversations with village NPCs.",
      levelTitle: "Choose your proficiency level",
      levelSubtitle: "Select the level that feels right for you. You can adjust this anytime in Settings.",
      goalsTitle: "What are your main goals?",
      goalsSubtitle: "Select any areas you want to prioritize in the village. You can choose multiple or skip.",
      optionalBadge: "Optional",
      namePrompt: "What should we call you?",
      namePlaceholder: "Enter your display name",
      englishLangName: "English",
      englishLangDesc: "Practice conversational English with shopkeepers, doctors, tutors, and residents.",
      koreanLangName: "Korean",
      koreanLangDesc: "Practice Korean essentials and everyday situational conversations.",
      beginnerTitle: "Beginner",
      beginnerSubtitle: "A1 – A2 Level",
      beginnerDesc: "Simple greetings, basic vocabulary, short guided sentences with friendly hints.",
      intermediateTitle: "Intermediate",
      intermediateSubtitle: "B1 – B2 Level",
      intermediateDesc: "Comfortable with everyday conversations, ordering food, and situational roleplay.",
      advancedTitle: "Advanced",
      advancedSubtitle: "C1 – C2 Level",
      advancedDesc: "Fluent discussions, natural idioms, complex sentence structures, and nuanced feedback.",
      goalDaily: "Daily conversation & casual chat",
      goalSpeaking: "Speaking confidence & pronunciation",
      goalWork: "Work, job interviews & career skills",
      goalStudy: "Study, campus life & academic discussion",
      goalTravel: "Travel, hotel booking & navigation",
      goalExam: "Exam & test preparation (IELTS, TOPIK, CEFR)",
      errSelectInterface: "Please select an interface language.",
      errSelectLearning: "Please select a language to learn.",
      errEnterName: "Please enter your display name to continue.",
      errSelectLevel: "Please select your proficiency level."
    },
    controls: {
      movement: "Move: W, A, S, D",
      camera: "Camera: Right Mouse Button Drag",
      interact: "Chat / Results: F / E",
      statistics: "Statistics: M key"
    },
    hud: {
      villageMap: "VILLAGE MAP",
      outdoors: "OUTDOORS",
      youMarker: "YOU",
      xpLabel: "{count} XP",
      streakDays: "{count} days",
      learningBadge: "Learning: {lang} • {level}",
      shopMissionTitle: "🏪 Shop Mission",
      itemsCount: "{count} items",
      checklistTitle: "Mission Checklist:",
      backpackTitle: "🎒 Backpack:",
      backpackEmpty: "Backpack is empty.\nApproach shelf & press E.",
      extraItemsBadge: "+{count} extra",
      openSettings: "Settings"
    },
    prompts: {
      enterDoor: "Press E to enter",
      exitDoor: "Press E to exit and view results",
      talkToNpc: "Press F to talk to {npc}",
      pickupItem: "Press E to pick up {item}"
    },
    dialog: {
      poweredBy: "✨ Powered by Groq AI",
      closeDialogTitle: "Close Dialog",
      youLabel: "You",
      speakingInterim: "🎙️ You (Speaking...)",
      npcThinking: "✨ {npc} is thinking...",
      inputPlaceholder: "Ask anything in {lang}...",
      sendBtn: "Send",
      statusLabel: "Status:",
      replayVoice: "Replay Voice",
      playingVoice: "Playing...",
      tapToSpeak: "Tap to Speak 🎙️",
      stopSpeak: "Stop ⏹️"
    },
    voice: {
      idle: "IDLE",
      listening: "LISTENING",
      processing: "PROCESSING",
      speaking: "SPEAKING",
      micDenied: "Microphone permission was denied. Please allow microphone access in your browser settings to speak.",
      noMicDetected: "No microphone detected. Please connect or check your audio input device.",
      networkError: "Speech recognition network error. Please check your internet connection.",
      unsupported: "Speech Recognition is not supported by your browser. Please use Chrome or type your message.",
      timeout: "AI response timed out. Please try sending your message again.",
      apiError: "Could not reach the AI service. Please check your connection and try again.",
      noSpeechDetected: "No speech was detected. Tap Speak and try again."
    },
    evaluation: {
      modalTitleSuccess: "🎉 Mission Completed!",
      modalTitleResult: "📋 Mission Result",
      analyzingSpeech: "AI is evaluating your conversation...",
      scoreLabel: "Score:",
      mistakesTitle: "Corrections & Grammar Feedback:",
      noMistakes: "Awesome! No grammar or vocabulary mistakes found.",
      aiSummaryTitle: "AI Examiner Summary:",
      returnToVillage: "Return to Village",
      noSpeechWarning: "You exited without speaking to {npc} in the target language.",
      speakFirstInstruction: "To complete this mission, press 'F' to converse with the character in your target language.",
      itemsIncompleteWarning: "Required items are still missing from your backpack.",
      itemsExactSuccess: "All required items collected correctly in your backpack!",
      missingItemsFeedback: "Missing items in backpack: {items}.",
      excessItemsFeedback: "Extra items in backpack: {items}.",
      xpEarned: "+{xp} XP Earned",
      noXpEarned: "+0 XP — Mission criteria not fully met"
    },
    inventory: {
      water_bottle: "Water Bottle",
      apple: "Red Apple",
      bread: "Loaf of Bread",
      milk: "Bottle of Milk",
      pickupToast: "Collected: {icon} {name} (+1)"
    },
    stats: {
      modalTitle: "Learning Progress & Achievements",
      playerOverview: "Player Overview",
      learningLanguageLabel: "Learning Language:",
      learningLevelLabel: "Proficiency Level:",
      totalXpLabel: "Total XP",
      completedMissionsLabel: "Completed Missions",
      totalAttemptsLabel: "Total Attempts",
      averageScoreLabel: "Average Score",
      currentStreakLabel: "Current Streak",
      longestStreakLabel: "Longest Streak",
      daysCount: "{count} days",
      achievementsTitle: "Achievements",
      unlockedCounter: "{unlocked} of {total} Unlocked",
      recentHistoryTitle: "Recent Mission History",
      emptyHistory: "No mission attempts recorded yet. Visit village buildings and complete tasks to build your record!",
      loadingHistory: "Loading mission history...",
      errorHistory: "Could not load mission history.",
      passBadge: "PASSED",
      retryBadge: "RETRY",
      scoreDisplay: "{score}% Score",
      xpAwarded: "+{xp} XP",
      attemptDate: "Completed on {date}"
    },
    achievements: {
      first_mission: {
        title: "First Step",
        subtitle: "First Mission Completed",
        description: "Successfully complete your very first village mission."
      },
      xp_500: {
        title: "500 XP Milestone",
        subtitle: "Knowledge Accumulator",
        description: "Accumulate 500 total XP through completed conversations."
      },
      perfect_score: {
        title: "Perfect Score",
        subtitle: "100% Mastery",
        description: "Achieve a flawless 100% evaluation on any village mission."
      },
      missions_10: {
        title: "Dedicated Resident",
        subtitle: "10 Missions Completed",
        description: "Successfully complete 10 mission attempts across the village."
      },
      streak_3: {
        title: "3-Day Streak",
        subtitle: "Habit Builder",
        description: "Complete at least one mission per day for 3 consecutive days."
      }
    },
    settings: {
      modalTitle: "Language & Learning Settings",
      interfaceLangLabel: "Interface Language",
      interfaceLanguageLabel: "Interface Language",
      interfaceLangDesc: "Language for UI menus, controls, feedback, and subtitles.",
      interfaceLanguageDesc: "Language for UI menus, controls, feedback, and subtitles.",
      learningLangLabel: "Learning Language",
      learningLanguageLabel: "Learning Language",
      learningLangDesc: "Language spoken by village NPCs, missions, and speech recognition.",
      learningLanguageDesc: "Language spoken by village NPCs, missions, and speech recognition.",
      levelLabel: "Learning Level",
      learningLevelLabel: "Learning Level",
      levelDesc: "Adjusts NPC vocabulary, grammar complexity, and sentence lengths.",
      learningLevelDesc: "Adjusts NPC vocabulary, grammar complexity, and sentence lengths.",
      saveBtn: "Save Preferences",
      saveChangesBtn: "Save Changes",
      cancelBtn: "Cancel",
      savedSuccess: "Settings saved successfully!",
      saveError: "Failed to save settings. Please try again."
    }
  },
  ko: {
    common: {
      ok: "확인",
      cancel: "취소",
      save: "저장",
      saving: "저장 중...",
      retry: "다시 시도",
      close: "닫기",
      back: "이전",
      continue: "다음",
      finish: "완료 및 마을 입장 🏡",
      skip: "건너뛰고 입장",
      error: "오류",
      success: "성공",
      loading: "마을 로딩 중...",
      logOut: "로그아웃",
      settings: "설정",
      statistics: "통계",
      dismiss: "닫기",
      edit: "수정",
      student: "학습자"
    },
    auth: {
      brandTitle: "AI 언어 마을",
      brandSubtitle: "몰입형 3D 회화 언어 학습",
      welcomeBack: "다시 오신 것을 환영합니다! 로그인하여 학습을 이어가세요.",
      createAccountSubtitle: "3D 마을에서 언어 회화를 연습할 새 계정을 만드세요.",
      resetPasswordSubtitle: "가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.",
      verifyEmailSubtitle: "인증 이메일을 발송했습니다. 인증을 완료한 후 마을에 입장하세요.",
      loginTab: "로그인",
      registerTab: "회원가입",
      forgotPasswordTab: "비밀번호 찾기",
      nameLabel: "이름 (닉네임)",
      namePlaceholder: "이름을 입력하세요",
      emailLabel: "이메일 주소",
      emailPlaceholder: "name@example.com",
      passwordLabel: "비밀번호",
      passwordPlaceholder: "6자 이상 입력하세요",
      signInBtn: "로그인",
      signUpBtn: "계정 생성",
      resetPasswordBtn: "재설정 링크 보내기",
      googleSignInBtn: "Google 계정으로 계속",
      orDivider: "또는 이메일로 계속",
      noAccountPrompt: "계정이 없으신가요?",
      haveAccountPrompt: "이미 계정이 있으신가요?",
      signUpLink: "회원가입",
      signInLink: "로그인",
      forgotPasswordLink: "비밀번호를 잊으셨나요?",
      backToLogin: "← 로그인으로 돌아가기",
      checkVerificationBtn: "이메일 인증 완료 — 마을 입장",
      resendVerificationBtn: "인증 이메일 다시 보내기",
      signOutSwitchAccount: "로그아웃 / 다른 계정으로 로그인",
      verifSentNotice: "인증 링크가 발송되었습니다! 메일함을 확인해주세요.",
      emailVerifiedSuccess: "이메일 인증이 완료되었습니다! 마을로 이동합니다...",
      emailNotVerifiedYet: "아직 인증되지 않았습니다. 메일함의 링크를 클릭한 후 다시 눌러주세요.",
      missingName: "이름을 입력해주세요.",
      missingEmail: "유효한 이메일 주소를 입력해주세요.",
      missingCredentials: "이메일과 비밀번호를 모두 입력해주세요.",
      weakPassword: "비밀번호는 최소 6자 이상이어야 합니다.",
      resetSentNotice: "비밀번호 재설정 이메일을 보냈습니다. 메일함을 확인하세요.",
      langSwitchLabel: "언어 설정",
      signOut: "로그아웃"
    },
    onboarding: {
      stepIndicator: "단계 {current} / {total}",
      welcomeStudent: "환영합니다, {name}님",
      interfaceLangTitle: "화면 언어를 선택하세요",
      interfaceLangSubtitle: "메뉴, 안내 메시지, 버튼 및 피드백에 표시될 언어입니다.",
      learningLangTitle: "어떤 언어를 배우고 싶으신가요?",
      learningLangSubtitle: "마을 주민(NPC)들과 대화하고 연습할 학습 대상 언어입니다.",
      levelTitle: "학습 난이도를 선택하세요",
      levelSubtitle: "자신에게 맞는 수준을 선택하세요. 나중에 설정에서 언제든 바꿀 수 있습니다.",
      goalsTitle: "주요 학습 목표는 무엇인가요?",
      goalsSubtitle: "마을에서 우선적으로 연습하고 싶은 분야를 선택하세요. (복수 선택 또는 건너뛰기 가능)",
      optionalBadge: "선택 사항",
      namePrompt: "어떻게 불러드릴까요?",
      namePlaceholder: "이름을 입력하세요",
      englishLangName: "영어",
      englishLangDesc: "상점 주인, 의사, 튜터, 주민들과 실생활 영어 회화를 연습합니다.",
      koreanLangName: "한국어",
      koreanLangDesc: "한국어 기초 표현과 실생활 상황별 대화를 연습합니다.",
      beginnerTitle: "초급",
      beginnerSubtitle: "A1 – A2 레벨",
      beginnerDesc: "기초 인사말, 기본 단어, 친절한 힌트와 짧은 문장 위주로 대화합니다.",
      intermediateTitle: "중급",
      intermediateSubtitle: "B1 – B2 레벨",
      intermediateDesc: "일상적인 대화, 주문 및 다양한 상황극을 자연스럽게 나눕니다.",
      advancedTitle: "고급",
      advancedSubtitle: "C1 – C2 레벨",
      advancedDesc: "자연스러운 관용구, 복잡한 문장 구조 및 심도 있는 피드백을 제공합니다.",
      goalDaily: "일상 회화 & 편안한 수다",
      goalSpeaking: "스피킹 자신감 & 발음 개선",
      goalWork: "비즈니스, 취업 인터뷰 & 커리어",
      goalStudy: "유학, 캠퍼스 라이프 & 학업 토론",
      goalTravel: "여행, 호텔 예약 & 길 찾기",
      goalExam: "어학 시험 대비 (IELTS, TOPIK, CEFR)",
      errSelectInterface: "화면 표시 언어를 선택해주세요.",
      errSelectLearning: "학습할 언어를 선택해주세요.",
      errEnterName: "계속하려면 이름을 입력해주세요.",
      errSelectLevel: "학습 난이도를 선택해주세요."
    },
    controls: {
      movement: "이동: W, A, S, D",
      camera: "시점 회전: 마우스 우클릭 드래그",
      interact: "대화 / 결과 확인: F / E",
      statistics: "통계 및 업적: M 키"
    },
    hud: {
      villageMap: "마을 지도",
      outdoors: "야외",
      youMarker: "나",
      xpLabel: "{count} XP",
      streakDays: "{count}일 연속",
      learningBadge: "학습 중: {lang} • {level}",
      shopMissionTitle: "🏪 상점 미션",
      itemsCount: "아이템 {count}개",
      checklistTitle: "미션 체크리스트:",
      backpackTitle: "🎒 가방:",
      backpackEmpty: "가방이 비어 있습니다.\n선반 앞으로 가서 E를 누르세요.",
      extraItemsBadge: "+{count}개 초과",
      openSettings: "설정"
    },
    prompts: {
      enterDoor: "E 키를 눌러 들어가기",
      exitDoor: "E 키를 눌러 나가기 및 결과 확인",
      talkToNpc: "F 키를 눌러 {npc}와(과) 대화하기",
      pickupItem: "E 키를 눌러 {item} 줍기"
    },
    dialog: {
      poweredBy: "✨ Groq AI 기반",
      closeDialogTitle: "대화 닫기",
      youLabel: "나",
      speakingInterim: "🎙️ 나 (말하는 중...)",
      npcThinking: "✨ {npc}님이 생각 중입니다...",
      inputPlaceholder: "{lang}(으)로 질문하세요...",
      sendBtn: "전송",
      statusLabel: "상태:",
      replayVoice: "음성 다시 듣기",
      playingVoice: "재생 중...",
      tapToSpeak: "말하기 🎙️",
      stopSpeak: "정지 ⏹️"
    },
    voice: {
      idle: "대기 중",
      listening: "듣는 중",
      processing: "처리 중",
      speaking: "말하는 중",
      micDenied: "마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.",
      noMicDetected: "감지된 마이크가 없습니다. 오디오 입력 장치를 확인해주세요.",
      networkError: "음성 인식 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
      unsupported: "현재 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.",
      timeout: "AI 응답 시간이 초과되었습니다. 다시 한 번 메시지를 전송해주세요.",
      apiError: "AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      noSpeechDetected: "음성이 감지되지 않았습니다. 말하기 버튼을 누르고 다시 말씀해주세요."
    },
    evaluation: {
      modalTitleSuccess: "🎉 미션 성공!",
      modalTitleResult: "📋 미션 평가 결과",
      analyzingSpeech: "AI가 대화 내용을 분석하고 있습니다...",
      scoreLabel: "점수:",
      mistakesTitle: "수정 사항 및 문법 피드백:",
      noMistakes: "훌륭합니다! 문법이나 어휘 실수가 전혀 없습니다.",
      aiSummaryTitle: "AI 평가관 총평:",
      returnToVillage: "마을로 돌아가기",
      noSpeechWarning: "{npc}와(과) 목표 언어로 대화하지 않고 퇴장하셨습니다.",
      speakFirstInstruction: "미션을 완수하려면 먼저 'F' 키를 눌러 대화를 나눠보세요.",
      itemsIncompleteWarning: "가방에 필요한 아이템이 아직 부족합니다.",
      itemsExactSuccess: "가방에 필요한 모든 아이템을 정확하게 담았습니다!",
      missingItemsFeedback: "부족한 아이템: {items}",
      excessItemsFeedback: "초과된 아이템: {items}",
      xpEarned: "+{xp} XP 획득",
      noXpEarned: "+0 XP — 미션 요구 조건을 충족하지 못함"
    },
    inventory: {
      water_bottle: "생수",
      apple: "빨간 사과",
      bread: "식빵",
      milk: "우유",
      pickupToast: "획득: {icon} {name} (+1)"
    },
    stats: {
      modalTitle: "학습 현황 및 업적",
      playerOverview: "플레이어 개요",
      learningLanguageLabel: "학습 언어:",
      learningLevelLabel: "학습 난이도:",
      totalXpLabel: "누적 XP",
      completedMissionsLabel: "완료한 미션",
      totalAttemptsLabel: "총 시도 횟수",
      averageScoreLabel: "평균 점수",
      currentStreakLabel: "현재 연속일",
      longestStreakLabel: "최장 연속일",
      daysCount: "{count}일",
      achievementsTitle: "도전 과제 (업적)",
      unlockedCounter: "{total}개 중 {unlocked}개 달성",
      recentHistoryTitle: "최근 미션 기록",
      emptyHistory: "아직 완료된 미션 기록이 없습니다. 마을 건물들을 방문해 미션에 도전해보세요!",
      loadingHistory: "미션 기록을 불러오는 중...",
      errorHistory: "미션 기록을 불러오지 못했습니다.",
      passBadge: "성공",
      retryBadge: "재도전",
      scoreDisplay: "{score}점",
      xpAwarded: "+{xp} XP",
      attemptDate: "{date} 완료"
    },
    achievements: {
      first_mission: {
        title: "첫 걸음",
        subtitle: "첫 번째 미션 완료",
        description: "마을에서 첫 번째 미션을 성공적으로 완료하세요."
      },
      xp_500: {
        title: "500 XP 달성",
        subtitle: "지식 수집가",
        description: "미션 대화를 통해 누적 500 XP를 달성하세요."
      },
      perfect_score: {
        title: "만점 달성",
        subtitle: "완벽한 회화 (100점)",
        description: "마을 미션에서 감점 없이 100점 만점을 기록하세요."
      },
      missions_10: {
        title: "마을 단골 주민",
        subtitle: "10개 미션 완료",
        description: "마을 전체에서 총 10개의 미션을 성공적으로 완료하세요."
      },
      streak_3: {
        title: "3일 연속 학습",
        subtitle: "꾸준한 습관",
        description: "3일 연속으로 매일 1개 이상의 미션을 완료하세요."
      }
    },
    settings: {
      modalTitle: "언어 및 학습 설정",
      interfaceLangLabel: "인터페이스 언어",
      interfaceLanguageLabel: "인터페이스 언어",
      interfaceLangDesc: "메뉴, 버튼, 피드백, 자막 등 UI에 적용될 언어입니다.",
      interfaceLanguageDesc: "메뉴, 버튼, 피드백, 자막 등 UI에 적용될 언어입니다.",
      learningLangLabel: "학습 언어",
      learningLanguageLabel: "학습 언어",
      learningLangDesc: "마을 주민과의 대화, 미션 수행, 음성 인식에 적용될 언어입니다.",
      learningLanguageDesc: "마을 주민과의 대화, 미션 수행, 음성 인식에 적용될 언어입니다.",
      levelLabel: "학습 수준",
      learningLevelLabel: "학습 수준",
      levelDesc: "주민들의 사용 어휘, 문법 난이도, 문장 길이에 적용됩니다.",
      learningLevelDesc: "주민들의 사용 어휘, 문법 난이도, 문장 길이에 적용됩니다.",
      saveBtn: "설정 저장",
      saveChangesBtn: "변경사항 저장",
      cancelBtn: "취소",
      savedSuccess: "설정이 성공적으로 저장되었습니다!",
      saveError: "설정 저장에 실패했습니다. 다시 시도해 주세요."
    }
  }
};

/**
 * Known alias mappings for backward compatibility and resilience against naming variances.
 */
export const KEY_ALIASES = {
  "settings.interfaceLangLabel": "settings.interfaceLanguageLabel",
  "settings.interfaceLangDesc": "settings.interfaceLanguageDesc",
  "settings.learningLangLabel": "settings.learningLanguageLabel",
  "settings.learningLangDesc": "settings.learningLanguageDesc",
  "settings.levelLabel": "settings.learningLevelLabel",
  "settings.levelDesc": "settings.learningLevelDesc",
  "settings.saveChangesBtn": "settings.saveBtn",
  "settings.cancelBtn": "common.cancel",
  "auth.signOut": "common.logOut"
};

/**
 * Converts a raw translation key path into a readable, human-friendly label.
 * Used as a graceful fallback when a key cannot be found in any language dictionary.
 * Never returns raw dot-separated keys, bracketed strings, "undefined", or "Missing translation".
 *
 * @param {string} key - e.g. "settings.interfaceLangLabel" or "nonexistent.nested.key"
 * @returns {string} Human-readable fallback text
 */
export function humanizeKeyFallback(key) {
  if (!key || typeof key !== "string") return "";
  const parts = key.split(".");
  const lastPart = parts[parts.length - 1];
  // Strip trailing Label, Title, Btn, Button, Prompt, Text, Desc, Description if there's a prefix
  const stripped = lastPart.replace(
    /([a-z0-9])(Label|Title|Btn|Button|Prompt|Text|Desc|Description)$/i,
    "$1"
  );
  const words = stripped
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_.]+/g, " ")
    .trim()
    .split(/\s+/);
  return words
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Translates a key path using the given language, with safe fallback to English,
 * and safe fallback to human-readable label if not found.
 * Never returns raw dot-separated keys in the UI.
 *
 * @param {string} key - e.g. "auth.signInBtn" or "settings.interfaceLangLabel"
 * @param {Object} [params={}] - Token replacements { name: "Alice" }
 * @param {"en"|"ko"|string} [lang="en"] - Target interface language
 * @returns {string} Localized string
 */
export function t(key, params = {}, lang = "en") {
  if (!key || typeof key !== "string") return "";

  const safeLang = lang === "ko" ? "ko" : "en";
  const dict = TRANSLATIONS[safeLang] || TRANSLATIONS.en;

  const resolvePath = (targetDict, keyPath) => {
    const segments = keyPath.split(".");
    let curr = targetDict;
    for (const segment of segments) {
      if (curr && typeof curr === "object") {
        curr = curr[segment];
      } else {
        return undefined;
      }
    }
    return typeof curr === "string" ? curr : undefined;
  };

  // 1. Resolve in requested language
  let val = resolvePath(dict, key);

  // 2. Fallback to English if requested Korean key is missing
  if (val === undefined && safeLang !== "en") {
    val = resolvePath(TRANSLATIONS.en, key);
  }

  // 3. Fallback via known aliases if still not found
  if (val === undefined && KEY_ALIASES[key]) {
    const aliasKey = KEY_ALIASES[key];
    val = resolvePath(dict, aliasKey);
    if (val === undefined && safeLang !== "en") {
      val = resolvePath(TRANSLATIONS.en, aliasKey);
    }
  }

  // 4. Human-readable fallback for missing or unknown keys
  // Never return raw dot-separated keys (e.g. "settings.interfaceLangLabel"),
  // bracketed keys ("[key]"), or generic error strings ("undefined", "Missing translation").
  if (typeof val !== "string") {
    val = humanizeKeyFallback(key);
  }

  // 5. Token interpolation: e.g. "Welcome, {name}"
  if (params && typeof params === "object") {
    return val.replace(/\{(\w+)\}/g, (match, token) => {
      return params[token] !== undefined ? String(params[token]) : match;
    });
  }

  return val;
}

/**
 * Normalizes user language settings with safe defaults for existing or unconfigured profiles.
 *
 * @param {Object|null} profile - Firestore user profile document
 * @returns {{ interfaceLanguage: "en"|"ko", learningLanguage: "en"|"ko", learningLevel: "beginner"|"intermediate"|"advanced" }}
 */
export function resolveUserLanguagePreferences(profile) {
  const interfaceLanguage =
    profile?.interfaceLanguage === "ko" ? "ko" : "en";

  const rawLearningLang =
    profile?.learningPreferences?.learningLanguage ||
    profile?.learningPreferences?.language;
  const learningLanguage = rawLearningLang === "ko" ? "ko" : "en";

  const rawLevel = profile?.learningPreferences?.level;
  const learningLevel =
    rawLevel === "intermediate" || rawLevel === "advanced" ? rawLevel : "beginner";

  return {
    interfaceLanguage,
    learningLanguage,
    learningLevel
  };
}

/**
 * Returns human-readable label for language IDs.
 *
 * @param {"en"|"ko"|string} langId
 * @param {"en"|"ko"} [displayLang="en"]
 * @returns {string}
 */
export function getLanguageName(langId, displayLang = "en") {
  const isKo = displayLang === "ko";
  if (langId === "ko") {
    return isKo ? "한국어" : "Korean";
  }
  return isKo ? "영어" : "English";
}

/**
 * Returns human-readable label for learning levels.
 *
 * @param {"beginner"|"intermediate"|"advanced"|string} level
 * @param {"en"|"ko"} [displayLang="en"]
 * @returns {string}
 */
export function getLevelName(level, displayLang = "en") {
  const isKo = displayLang === "ko";
  switch (level) {
    case "intermediate":
      return isKo ? "중급" : "Intermediate";
    case "advanced":
      return isKo ? "고급" : "Advanced";
    case "beginner":
    default:
      return isKo ? "초급" : "Beginner";
  }
}
