# 하루결 (react-todo-app)

말을 걸듯 적으면 일정이 정리되는 **대화형 투두·루틴 일기장**입니다.
"내일 오후 3시에 치과 가야 해"라고 입력하면 날짜, 시간, 할 일을 읽어 일정에 추가하고, 일기장이 답장합니다.

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 대화형 입력 | 규칙 기반 한국어 파서로 날짜(오늘·내일·다음주 월요일·12월 3일·N일 뒤), 시간(오후 3시·9시 반·저녁), 반복(매일·평일·매주 X요일)을 추출합니다 |
| 일정 조회 | "내일 뭐 있어?"라고 물으면 그날 일정을 시간순으로 알려 줍니다. 같은 시간에 겹치는 일정이 있으면 함께 알려 줍니다 |
| 드래그 앤 드롭 | `@dnd-kit`으로 순서를 바꿉니다. 마우스, 터치, 키보드(스페이스바 + 방향키)를 모두 지원합니다 |
| 테마 | 라이트, 다크, 기기 설정 따르기. 첫 화면에서 깜빡이지 않도록 미리 적용합니다 |
| 알림 | 일정 시간이 되면 화면 안 토스트와 브라우저 알림(권한 허용 시)을 띄웁니다. "1분 뒤 물 마시기"로 바로 테스트할 수 있습니다 |
| 저장과 동기화 | `zustand` persist로 localStorage에 저장합니다. `storage` 이벤트로 **여러 탭의 상태를 실시간으로 맞춥니다** |
| Notion 연동 | 연결 → DB 선택 → 전송 과정을 흉내 낸 데모 흐름과, 실제로 동작하는 "마크다운 복사"(Notion에 붙여넣으면 체크박스로 변환)를 제공합니다 |
| 배경 | SVG로 직접 그린 자연 풍경 4종(갈대밭·비 오는 산길·바다·숲길)이 25초마다 천천히 바뀝니다 |

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS v4 · zustand · @dnd-kit · lucide-react

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 결과물: dist/
npm run lint
```

## 폴더 구조

```text
src/
├─ components/
│  ├─ hero/       회전 문구, 배경 풍경(scenes/)
│  ├─ chat/       대화 패널, 말풍선, 입력창
│  ├─ schedule/   일정 패널, 드래그 정렬 목록, 날짜 이동
│  ├─ notion/     Notion 보내기 다이얼로그
│  ├─ layout/     Header, Panel(재사용 틀)
│  └─ ui/         Button, IconButton, Toaster, 테마/알림 토글
├─ hooks/         useDiaryChat, useReminders, useTheme, useCrossTabSync, useInterval
├─ store/         useTaskStore, useChatStore, useSettingsStore, useUiStore
├─ lib/           parseKoreanSchedule(파서), diaryReply(답장), notionExport, date
└─ types/
```

## 배경을 사진이나 AI 이미지로 바꾸기

`public/backgrounds/`에 이미지를 넣고, `src/components/hero/scenes/index.ts`에서 해당 장면에 `image: '/backgrounds/파일명.jpg'`를 추가하면 일러스트 대신 이미지가 나옵니다.

## Notion 실제 연동을 하려면

Notion API는 CORS 정책 때문에 브라우저에서 직접 호출할 수 없고, 토큰이 노출되는 문제도 있습니다.
실제로 연동하려면 서버리스 함수(Vercel Functions 등)를 두고, 그 안에서 `NOTION_TOKEN`을 서버 환경 변수로 관리해야 합니다.
`VITE_` 변수에 넣으면 브라우저에 그대로 노출되니 주의하세요.
