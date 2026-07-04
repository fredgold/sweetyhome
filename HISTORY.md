# 스위티홈 개발 히스토리

> 테디 ♥ 연정 · 결혼 & 내집마련 준비 보드  
> 배포: https://sweetyhome.vercel.app

---

## 2026-06-28 — 앱 기반 구축 (v3 초기)

### 규제·뉴스 탭 + API 분리
- AI가 서울 신혼부부 맞춤 규제·정책·금리 뉴스를 웹에서 검색해 정리하는 탭 추가
- `messages.js`를 `/api/` 디렉토리로 이동 (Vercel 서버리스 구조 정립)

### 액션 탭 + 모바일 최적화
- 할 일 목록(액션) 탭 전체 구현 — 우선순위 정렬, 체크, AI 제안
- 모바일 레이아웃 전면 최적화

---

## 2026-06-29 오전 — 핵심 기능 완성

### 클라우드 동기화 (Upstash Redis)
- `localStorage`만 사용하던 구조에서 `/api/state` 서버 동기화 추가
- Upstash Redis에 상태 저장 → 여러 기기에서 동일 데이터 접근 가능
- 환경변수: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

### AI 비용 절감
- 모델을 기존 → `claude-haiku-4-5`로 교체 (비용 약 4배 절감)
- `sweetyhome` 환경변수명도 API 키로 인식하도록 폴백 추가

### API 헬스체크
- 페이지 로드 시 Anthropic API 크레딧/키 상태 자동 확인
- AI 기능 전체에 크레딧 체크 통합 → 크레딧 부족 시 UI 안내

### 스크랩 탭
- 인스타·블로그·뉴스에서 청약·매물 정보를 텍스트/스크린샷으로 수집
- AI가 핵심 정보(단지명, 일정, 자격, 가격) 자동 추출 및 저장
- 이미지 업로드 버튼 2회차 동작 안 되는 버그 수정

### 지도 기능 개선
- 위치 찾기: Nominatim(무료) → 카카오 지도 API로 교체 (한국 아파트 정확 검색)
- 지도 확대 보기, 스크롤 줌, 매물 자동 좌표 표시
- 환경변수: `KAKAO_REST_KEY`

### 로그인 v1 (퀴즈 방식)
- 결혼 날짜(<REDACTED>)를 정답으로 하는 퀴즈 로그인
- 게스트 모드: 실제 데이터 대신 목데이터로 전면 교체 (개인정보 보호)
- 다양한 날짜 입력 형식 허용

---

## 2026-06-29 오후 — 로그인 개편 + 보안 강화

### 로그인 v2 (PIN 방식으로 전환)
- 퀴즈 로그인 → 숫자 PIN 방식으로 변경
- 로그인 화면에서 개인정보(이름 등) 노출 제거
- 힌트 텍스트 추가 ("누군가의 전화번호 앞자리")
- 로고 클릭 → 대시보드 이동, 잠금(로그아웃) 버튼 추가

### 보안 강화 ①: 서버 측 PIN 검증 + 브루트포스 방어
- **기존 문제**: `const PIN=<REDACTED>`이 클라이언트 소스코드에 노출, 시도 횟수 제한 없음
- `/api/login.js` 신규 생성 — 서버에서 PIN 검증
- PIN을 환경변수 `SWEETYHOME_PIN`으로 이동
- IP당 5회 실패 시 5분 잠금 (Upstash Redis 활용)
- PIN 로테이션(값은 env SWEETYHOME_PIN)

### 보안 강화 ②: 토큰 기반 인증
- **기존 문제**: API 엔드포인트 무인증 (누구나 직접 호출 가능), `sessionStorage` 콘솔 우회 가능
- `/api/_auth.js` 신규 — 세션 토큰 생성/검증 공통 모듈 (24시간 TTL)
- 로그인 성공 시 UUID 토큰 발급 → sessionStorage 저장
- `/api/state`, `/api/messages`, `/api/geocode`, `/api/health` 전부 Bearer 토큰 검증

### 보안 강화 ③: CORS + AI 호출 제한
- CORS: `sweetyhome.vercel.app` + localhost만 허용 (외부 사이트 API 호출 차단)
- `/api/health` 인증 추가 (Anthropic 크레딧 소모 방지)
- `/api/messages` 시간당 30회 호출 제한 (크레딧 과소비 방지)

---

## 2026-06-29 저녁 — 프로필 편집 + AI 전환 시도

### 프로필 & 타임라인 앱 내 편집
- **기존 문제**: 부부 정보·일정이 코드에 하드코딩 → 변경 시 재배포 필요
- `state.profile` 도입 — 이름, 출생연도, 고용형태, 지역, 면적, 교통 등 저장
- **`👤 프로필` 버튼** (헤더) → 모달에서 편집
- **마일스톤 추가/삭제/날짜 변경** → 타임라인 자동 반영
- 타임라인, 게이트 조건, AI 프롬프트 6곳, 브랜드 텍스트, 채팅 칩 전부 `state.profile` 기반 동적 생성

### AI를 OpenAI GPT로 전환 시도 (→ 실패)
- `/api/messages.js`를 OpenAI Responses API로 교체
- 웹 검색: `web_search` → `web_search_preview` 매핑
- **실패 원인**: OpenAI 계정 크레딧 없음 → Anthropic Claude로 원복
- 커밋 `11b716b`에 OpenAI 버전 보존 (나중에 재전환 가능)

### 인스타그램 스크랩 시도 (→ 부분 적용)
- Instagram URL 붙여넣기 → OG 태그로 썸네일 자동 추출 시도
- **실패 원인**: Instagram이 서버 사이드 크롤링 완전 차단
- 대신 URL 감지 시 "캡션 복사 또는 스크린샷 업로드" 안내 메시지 표시

---

## 2026-07-03 — 보안·위생 정리 (v4 #1)

### 시크릿 정리
- `HISTORY.md`에 남아있던 결혼 날짜·PIN 값을 `<REDACTED>`로 대체
- `.gitignore`의 개별 `.env` 항목들을 `.env*` 한 줄로 통합, `*.xlsx` 추가
- 작업 전 `SWEETYHOME_PIN` Vercel에서 로테이션 (기존 커밋 내 값 무효화)

### API 에러 마스킹
- `api/login.js`, `api/state.js`, `api/geocode.js`, `api/messages.js` 500 응답에서 `e.message` 제거
- 모든 서버 에러는 `console.error`(서버 로그)에만 기록, 클라이언트엔 고정 문구 반환

### Redis 폴백 & 동기화 상태 칩
- 헤더에 상태 칩 추가: `☁ 동기화됨` / `💾 로컬만` / `○ 오프라인` (영구 표시)
- 저장: Redis 성공 → 동기화됨, 실패 → 로컬만 + 재시도 버튼
- 로드: Redis/네트워크 실패를 각각 구분하여 칩 상태에 반영
- 2초 후 메시지 자동 초기화 로직 제거 (실패 상태 유지)

---

## 2026-07-04 — 버그 수정 + 분담 탭 시도

### 버그: 로그인 후 데이터 미로드
- **증상**: 로그인 직후 데이터가 안 뜨고 새로고침해야만 Redis 데이터 로드됨
- **원인**: `load()`가 `if(isGuest){}` 블록 안에만 있어 일반 로그인 시 미호출
- **수정**: `load()`를 if 블록 바깥으로 이동 → `unlockApp()` 공통 경로에서 항상 호출

### 분담 탭 구현 및 제거
- 엑셀 카드 내역 관리 탭 구현 시도: 계산 엔진, xlsx 가져오기/내보내기, 사이클 요약
- Excel의 분담비율·고정입금·거래·입금 데이터를 웹 앱으로 이식
- **제거 결정**: 엑셀 대비 UX 미완성(목록 조회·수정·삭제 없음), 엑셀로 충분히 관리 중
- 코드는 git history(`b8ad87d`)에 보존 — 필요 시 복구 가능

---

## 현재 기술 스택

| 항목 | 내용 |
|------|------|
| 프론트엔드 | 단일 `index.html` (Vanilla JS) |
| 배포 | Vercel (서버리스) |
| 데이터 저장 | Upstash Redis (클라우드) + localStorage (로컬 백업) |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) + 웹 검색 |
| 지도 | Kakao Maps API |
| 인증 | 서버 PIN + Bearer 토큰 (24시간) + IP 브루트포스 방어 |

## 환경변수 목록

| 변수명 | 용도 | 필수 |
|--------|------|------|
| `SWEETYHOME_PIN` | 로그인 PIN | ✅ |
| `KV_REST_API_URL` | Upstash Redis URL | ✅ |
| `KV_REST_API_TOKEN` | Upstash Redis 토큰 | ✅ |
| `ANTHROPIC_API_KEY` | Claude AI API 키 | ✅ |
| `KAKAO_REST_KEY` | 카카오 지도 API 키 | ✅ |
| `ANTHROPIC_MODEL` | 모델 오버라이드 (기본: haiku) | 선택 |
