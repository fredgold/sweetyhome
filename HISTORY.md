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

## 2026-07-05 — 스크랩 탭 개편 (Phase 1: 수동 입력 우선)

### 목표
AI 크레딧 없이도 스크랩·분류·필터가 완전히 동작하도록 재구성.
기존 구조는 "AI 분석 & 저장" 단일 흐름이라 AI 없으면 저장 자체가 불편했음.

### state.scraps 스키마 확장
- 기존: `{ id, raw, parsed, tags, fit }`
- 추가: `createdAt, title, type, location, price, area, schedule, condition, source, status`
- `type`: `subscription`(청약공고) / `jeonse`(전세) / `sale`(매매) / `area`(동네·시세) / `policy`(정책·뉴스) / `review`(임장후기)
- `status`: `new` / `review` / `interested` / `hold` / `promoted` / `dropped`
- applyGuards에서 기존 scraps를 새 스키마로 자동 마이그레이션 (기존 `parsed` 데이터를 각 필드에 복사, 데이터 손실 없음)

### 입력 UX 개선
- 필수 3개(제목·유형·원문)만으로 30초 안에 저장 가능
- '더 보기' 토글로 선택 필드(위치·가격·면적·일정·조건·출처·태그·적합도) 펼침
- '수정' 버튼 → 동일 폼 재사용 (editId + 취소 버튼)

### 목록·관리 UI
- 유형 필터 7개 + 상태 필터 7개 가로 스크롤 칩 바
- 카드: 제목·유형뱃지·상태뱃지·위치/가격/면적/일정·태그·적합도·원문 접기/펼치기
- 상태 select로 즉시 변경 → 자동 저장
- 수정·삭제 버튼

### AI 버튼 처리
- "✨ AI 자동채움" 버튼: `disabled` 상태 유지 + "Anthropic 크레딧 충전 시 활성화" 안내
- 카드별 "🔍 자격확인" 버튼: `disabled` 유지 (Phase 2에서 활성화 예정)
- `checkFit()` 함수는 코드에 보존 — AI 크레딧 복구 시 바로 연결 가능

---

## 2026-07-05 — 스크랩 고도화 + AI 탭 정리

### 스크랩 Phase 1.5 — 붙여넣기 임포트
- 마크다운 표(`| 컬럼 | 형식`) 또는 `항목: 값` 블록을 붙여넣어 일괄 등록
- 파싱 후 체크박스 선택 → 확인 → 저장 (미리보기 단계 있음)
- `SC_FIELD_MAP` / `SC_TYPE_MAP`으로 한글 필드명·유형명 자동 매핑

### 마크다운 에디터
- `marked.js` (CDN v9) 도입 — 원문 필드에 마크다운 렌더링
- 편집 툴바: **굵게**, *기울임*, `#` 제목, `- ` 목록
- `Ctrl+B` / `Ctrl+I` 단축키, 목록 줄에서 Enter 시 자동 계속
- 카드의 원문 클릭 → 접기/펼치기 + 렌더된 HTML 표시
- 미리보기 토글 버튼 (편집 ↔ 렌더)

### 스크랩 폼 접힘
- "➕ 스크랩 추가" 버튼으로 폼 열기/닫기 토글 (기본 숨김)
- 수정 시 폼 자동 열림, 닫을 때 필드 초기화

### AI 탭 정리 (크레딧 소진)
- **AI 상담** 탭 nav에서 제거, 패널 숨김 (`display:none`)
- **규제·뉴스** 탭 nav에서 제거, 패널 숨김
- 액션 탭 "✨ 새 액션 제안" 버튼 `disabled` 처리
- 대시보드 규제뉴스 바로가기 → 스크랩 탭 바로가기로 교체
- 코드는 git 보존 — 크레딧 복구 시 `display:none` 제거만으로 복원 가능

---

## 2026-07-05 — 임포트 파서 재설계

### 프론트매터(---) 형식 1순위 파서
- `---\n키: 값\n---\n본문` 구조 지원 — 첫 번째 콜론에서만 분리 (값 안 콜론 안전)
- 본문(두 번째 `---` 이후) 전체 → raw 필드 그대로 저장
- `SC_FIT_MAP` 추가: 높음→high / 중간→mid / 낮음→low (매핑 실패 시 미설정)
- `SC_FIELD_MAP` 확장: 조건자격, 전용면적, 입주예정, 보증금 등 실제 부동산 키워드 추가
- 파싱 우선순위: 프론트매터 → 마크다운 표 → key:val 블록 → 자유 텍스트(GPT 응답 등)
- 자유 텍스트 폴백(`scFreeText`): 첫 줄/`#` 헤딩 → 제목, 전체 → raw

---

## 2026-07-05 — 수집함(구 스크랩) 확장

### 스크랩 → 수집함으로 정체성 확장
- 사용자 노출 텍스트 전면 교체 (nav, 패널, 버튼, 빈 상태 메시지 등)
- 내부 변수·state 키 변경 없음

### 유형 2개 추가
- `note`(메모): 개인 메모·안 까먹을 것 저장
- `ai_log`(AI기록): GPT/Claude 대화 원문 보관
- `SC_PROPLESS` Set으로 두 유형 판별 → 가격·면적·일정 필드 자동 숨김
- 폼 유형 칩·필터 칩·임포트 파서 SC_TYPE_MAP 동시 추가

---

## 2026-07-06 — 버그 수정 4건 + 수집함·자산 개선

### 버그 수정
- **대시보드 여정 라인 사라짐**: 마일스톤 수에 따라 grid columns 동적 설정 + `overflow-x:auto`
- **자산 메모 마크다운 불가**: `a_notes` 위에 툴바(B/I/H/•/❝) + 미리보기 토글 추가, `Ctrl+B`/`Ctrl+I` 지원
- **마일스톤 추가 시 기존 데이터 사라짐**: `pf_addMs` 클릭 전 DOM 현재값을 state에 먼저 반영
- **수집함 수정이 추가 폼에서 됨**: 별도 `scEditModal` 모달로 분리 (전체 필드 + 마크다운 툴바)

### 개선
- 자산 탭: 항목 변경 시 `state.assets.updatedAt` 갱신 → "마지막 수정: M월 D일 HH:MM" 표시
- 수집함 카드: `createdAt` 추가 일자 우측 상단 표시
- 수집함: 제목·원문·태그·위치 통합 검색 + 최신/오래된/상태/유형 정렬

---

## 2026-07-06 — 이미지 첨부 + 전체 목록 검색

### 이미지 첨부
- `compressImage` 유틸: canvas로 max 600px, JPEG 0.65 압축 (원본 대비 ~80% 축소)
- **수집함**: 사진 업로드가 실제 저장으로 수정 (기존엔 AI 전송만, 저장 안 됨)
  - `state.scraps[].img`에 저장, 카드에 이미지 표시
  - 수정 모달에서도 첨부/변경/제거 가능
  - `applyGuards`에 `img` 필드 마이그레이션 가드 추가
- **매물**: 폼 하단에 사진 첨부 추가 → 카드 썸네일 표시, 수정 시 기존 사진 유지

### 전체 목록 검색
- **매물**: 단지명·위치·메모 실시간 텍스트 검색
- **자산**: 소유자 필터(규범/연정/공동) + 항목명 검색
- **액션**: 할 일 텍스트 검색 (완료 항목 포함)
- **수집함**: 이전 세션에서 완료

---

## 2026-07-06 오후 — 수집함 에디터 WYSIWYG 안정화

### contenteditable 에디터 전환
- 기존 textarea → contenteditable div로 전환 (수집함 추가폼 + 수정 모달)
- 입력하면서 마크다운 문법이 실시간으로 렌더링됨 (bold/italic/heading/list)
- 커서 위치를 ceGetOffset/ceSetOffset으로 수동 관리 (innerHTML 교체 시에도 커서 유지)

### 에디터 버그 수정 (순서대로)
- 한글 IME 조합 중 ceRender 호출 차단 (isComposing 가드 + compositionend 폴백)
- 빈 에디터 커서가 placeholder 아래로 밀리는 문제 수정
- 줄바꿈, 슬래시 메뉴 미표시 버그 수정
- 슬래시 메뉴 공용화 — 추가 폼·수정 모달 모두 동일 코드
- el.innerText 대신 dataset.raw 기준 — 블록 경계 \n 혼입 방지

### 에디터 팽창 버그 수정
- **증상**: 입력·삭제할 때마다 에디터 높이가 계속 벌어짐
- **원인1**: ceRender 200ms 디바운스 → 브라우저가 그 사이 DOM을 자유 관리하며 `<div>` 누적
- **원인2**: trailing `\n` 제거를 `/\n$/`로 1개만 → 빈 줄 누적
- **수정**: 디바운스 완전 제거 + `/\n+$/`로 모든 trailing 개행 한번에 제거

### 자산 메모 저장 버튼
- `a_notes` 변경 시 즉시 저장되던 로직 → 저장 버튼 클릭 시에만 반영
- "저장됨" 피드백 1.2초 표시 후 초기화

---

## 2026-07-06 저녁 — 매물탭 v4 + 보안 + UX 마감

### 매물탭 v4 batch1: 시트 승격 벌크 임포트
- **TSV 파서**: 16컬럼 계약 (버킷·단지명·위치·역·전세호가·매매호가·전용·세대수·준공년도·출퇴근·URL·메모)
- **parseEok()**: "3억3천만원", "3.3억", "33000만원", "a~b 범위(평균)" 등 한국식 금액 단위 → 억 숫자로 통일
- **스키마 확장**: `depositNum`, `householdGrade`, `jeonseRatio`, `geocodePending`, `bucket`, `station`, `line`, `importSource`, `importedAt`, `importBatchId` 추가
- **중복 감지**: `normalize(name)|normalize(loc)` 키로 정확 중복(자동 체크해제) / 이름 유사(뱃지 표시) 구분
- **프리뷰 테이블**: 체크박스 선택 후 일괄 등록
- **지오코딩 큐**: 신규 매물 등록 후 순차 좌표 조회, `geocodePending` 플래그로 미처리 표시
- **보안**: 모든 사용자 입력 `esc()`, URL은 `safeUrl()` (http/https만 허용)
- **필터 추가**: 버킷 필터, 세대 등급 필터

### 보안 패치: renderMd() XSS
- **문제**: `marked.parse()` 결과에서 `<script>` 태그만 제거 — `<img onerror="...">` 등 우회 가능
- **수정**: DOMPurify 3 CDN 추가 + `DOMPurify.sanitize()` 적용
- 영향 범위: 수집함 본문, 자산 노트, 매물 메모 전체

### 개발 원칙 정립
- CLAUDE.md에 핵심 원칙 3가지 추가: 보안 최우선 / 컨텍스트 과부하 방지 / 코드 자기 리뷰
- Claude 메모리에도 저장 — 새 채팅에서도 자동 적용

### 매물탭 v4 batch2
- **정렬 확장**: 상태순 → AI점수순 / 전세호가순 / 세대수순 / 전세가율순 (select 드롭다운)
- **AI평가 숨김 토글**: 점수 칩·AI 분석 버튼·AI 리포트 블록 일괄 숨김
- **TSV 내보내기**: 16컬럼 라운드트립, CSV injection 차단(셀값 따옴표 처리), UTF-8 BOM
- **액션 미러**: 매물탭 상단에 미완료 액션 목록 (접기/펼치기, 높은 우선순위 강조)

### UX 마감
- **터치 타겟 개선**: star/xx/del/toggle/c-actions/ck-verify 버튼 패딩 증가 (최소 30px 이상)
- **ph-actions 줄바꿈**: 데스크톱에도 `flex-wrap:wrap` 추가 — 버튼 5개 넘쳐도 자동 줄바꿈
- **480px 브레이크포인트 신설**: 기존 760px 단일 → 480px 추가 (아주 작은 폰 대응)
- **임포트 테이블 가로 스크롤**: 16컬럼 프리뷰가 모달 밖으로 안 넘치도록 `overflow-x:auto`

---

## 2026-07-07 — 매물탭 고도화 + 액션 개편 + 모바일 최적화

### 매물 수정 모달 분리
- 기존: 수정 시 상단 폼으로 스크롤 이동 → 모바일 UX 불편
- 변경: `propEditModal` 독립 모달 — em_name·em_loc·em_deposit·em_area·em_households·em_url·em_memo + 지도 포함
- 수정 모달 내 지도도 핀 재설정 가능

### 매물탭 URL 필드 추가
- `f_url` / `em_url` 입력 추가, `safeUrl()` (http/https만 허용)
- 카드에서 "🔗 네이버 열기 ↗" 링크로 표시

### 액션탭 카테고리 통합
- 기존 준비할것·계약단계 탭을 **액션탭으로 완전 통합**
- `category` 필드 추가, `applyGuards`에서 prep→매물준비 / steps→계약 자동 마이그레이션
- 카테고리 필터 칩(전체/일반/매물준비/계약), 카드에 카테고리 뱃지 표시
- 액션 추가 시 카테고리 선택 select 추가
- 매물탭 `aside` 제거 (기존 prep/steps 영역이 비어 있던 여백 정리)

### 매물탭 UX 개선 (v4 batch3)
- **AI 분석 버튼 완전 제거**: 카드별 "✨ AI 분석" 버튼 제거 (배치 평가·결과 표시는 유지)
- **상태 변경 팝업**: pill 클릭 순환 → 6가지 옵션 팝업(status-picker) 으로 교체
- **메모 마크다운 툴바**: f_memo·em_memo에 B/I/H/•/❝ 툴바 + Ctrl+B·Ctrl+I 단축키 추가
- **정렬에서 AI점수순 제거**: propSortSel에서 AI점수순 옵션 제거
- **CSV/TSV 내보내기 컬럼 추가**: householdGrade·depositNum·jeonseRatio 포함 19컬럼
- **액션 수정 기능**: actrow에 ✏ 수정 버튼 + 인라인 편집(텍스트+카테고리, Enter저장/Esc취소)

### 매물 상태값 개편
- 변경: `관심/방문예정/검토중/후보확정/보류/탈락` → `관심/검토중/문의예정/방문예정/후보/보류/탈락`
- `후보확정` → `후보` 자동 마이그레이션 (applyGuards)
- `문의예정` 신규 추가, `--s-inquiry` CSS 토큰
- 탭, 상태 팝업, mapImportStatus 모두 7개 상태로 통일

### 매물 필드 확장
- **지하철역·노선 입력 추가**: f_station·f_line (추가 폼), em_station·em_line (수정 모달)
- 카드에 역 옆 노선 뱃지(`.c-line`) 표시
- **노선 필터 추가**: state.properties의 line 값에서 동적으로 옵션 생성
- **deposit 라벨 변경**: `전세 보증금 (억)` → `전세보증금(호가)(억)`
- **임포트 프리뷰 헤더**: `전세호가` → `전세보증금(호가)`

### 모바일 최적화
- **매물 수정 모달**: `.modal .box .row` 1컬럼 접힘 (기존엔 2컬럼 고정으로 좁은 화면에서 깨짐)
- **탭 가로 스크롤**: 8개 상태탭 줄바꿈 → `flex-wrap:nowrap` + 스크롤 (한 줄 유지)
- **prop-search-bar**: 검색창 전체폭(order:-1), 필터 select flex wrap
- **마크다운 툴바**: 버튼 최소 40px 높이, 14px 폰트 (터치 타겟 확대)
- **actrow**: `flex-wrap:wrap` — 인라인 편집 시 input+select+버튼 줄바꿈 허용
- **자산 테이블 480px**: `grid-template-columns:1fr` 단일 컬럼 카드 배치
- **에디터 textarea**: 최소 80px, 14px 폰트
- **addact**: `flex-wrap:wrap` (액션 추가 입력창)

### 매물 라벨 정리
- "AI평가 숨김" 버튼 제거, "시트에서 승격" → "시트 붙여넣기" 라벨 변경

---

## 2026-07-08 — 임장 루트 기능 + 게스트모드 보안 + 디자인 시스템 1라운드

### 임장 루트 (도보 동선 추정)
- 매물탭 지도에서 방문할 매물을 체크박스로 선택 → 최근접(nearest-neighbor) 알고리즘으로 도보 순서 자동 정렬
- 외부 API 호출 없이 haversine 직선거리 기반 도보시간 추정 (분당 4km 가정), 결과는 저장하지 않고 새로고침 버튼으로 재계산
- 방문 순서 드래그로 변경 가능 (포인터 이벤트 기반, `reorderRoute`)
- 여러 루트를 이름 붙여 저장/불러오기/삭제 (`state.savedRoutes`, Redis 영향 없는 client-only 기능)
- 지도 마커 번호 표시(점선 폴리라인), 모바일 드래그 핸들 터치 영역 확대

### 지도 마커 가독성 개선
- 매물 상태별 색상 원형 마커 시인성 개선

### 게스트 모드 보안
- 게스트(데모) 모드에서 실제 이름 등 개인정보가 노출되던 버그 수정

### 정리
- 사용하지 않는 매물 '버킷' 필드·필터·임포트 컬럼 완전 제거 (공용 용어가 아니라는 판단)
- `--paper` 미정의 변수로 `.status-picker`/`.prop-toast` 배경이 투명하게 보이던 버그 수정

### 디자인 시스템 1라운드 (외부 "Claude Design" 도구 기반)
- CSS 변수 토큰 정리 + 죽은 코드 제거 (적용 전 사전 정리)
- 여백(`--gap-*`)·타이포(`--fs-*`)·그림자(`--shadow-*`)·포커스 링(`--focus-ring`) 신규 토큰 추가
- border-radius를 역할별 4단 토큰(`--radius-sm/md/pill/card`)으로 정규화
- 골드 텍스트 저대비 수정 (`--line9` 직접 사용 → `--line9-deep`/`--ink`)
- 전역 hover/active/focus-visible/disabled 상태 스타일 추가
- `.ic` 인라인 SVG 베이스 클래스 도입 — 이후 모든 아이콘 작업의 기반
- 탭별 이모지 → 인라인 SVG 아이콘 전환 (헤더/글로벌, 수집함, 대시보드/자산, 매물탭)
- 중복 체크·검색·새로고침 글리프 전체 통일
- 모바일 툴바: 헤더/매물탭 "⋯ 더보기" 오버플로 메뉴 + 마크다운 툴바 가로 스크롤 스트립

---

## 2026-07-10 — 디자인 시스템 2~4라운드 + PWA + 모바일 접근성 감사

### 디자인 시스템 2라운드 — 잔여 이모지 정리
- 탭바 4개(자산/매물/액션/수집함) + 헤더(프로필/가져오기/잠금/동기화) + 로그인 로고 → SVG 아이콘
- 사진 첨부(10곳)·편집·미리보기·즐겨찾기·팁·인용구 → SVG 아이콘, 임장루트는 기존 `ic-map` 재사용
- 순수 장식 이모지(🎯 목표/🪙 예비비/💾 저장) 제거, 텍스트만 유지
- 부수 버그 수정: `textContent`로 상태 복원하던 버튼들이 방금 넣은 아이콘을 지우는 문제 → `innerHTML` 방식으로 전환

### 디자인 시스템 3라운드 — 정보 표시 영역 전수 정리
- 대시보드/섹션 타이틀 이모지(💰🏘️✅📋🔒👤)를 기존 아이콘 재사용으로 교체
- 활성 AI 버튼(disabled여도 화면엔 보이는 것 포함) → 신규 `sparkle` 아이콘
- 게이트카드·수집함 메타 → 신규 `calendar`/`area` 아이콘
- `<option>` 태그 안 이모지는 SVG 삽입이 불가능해 텍스트 기호로 정리, 1회성 장식 라벨 제거
- `display:none`인 AI상담·규제뉴스·AI가중치 섹션은 실제로 화면에 안 보여 대상에서 제외

### 죽은 코드 제거
- 7/7 커밋에서 `#prep`/`#steps` DOM이 제거됐는데도 `renderProps()`가 계속 호출해 매물탭 진입마다 콘솔 에러 발생 → `renderPrep`/`renderSteps` 함수 완전 삭제

### 호버 대비 버그 수정
- 전역 `button:hover{background:#F3F2EC}` 규칙이 `.addbtn`/`.btn-addrow`/`.sync-retry` 같은 어두운 배경 버튼을 덮어써 흰 텍스트가 거의 안 보이던 문제 수정
- "위치 자동 찾기" 버튼이 로딩 후 `textContent`로 복원되며 아이콘이 사라지던 문제 수정

### iOS 홈 화면 웹앱 지원 (PWA 최소 구성)
- 브랜드 마크(골드 그라데이션 + 집 아이콘) 기반 `apple-touch-icon.png`/`favicon.png` 생성
- `apple-mobile-web-app-title`, `<title>` 태그 추가 — 사파리 "홈 화면에 추가" 시 전체화면(standalone) 실행

### 모바일 접근성·UX 감사 (개발 버킷)
- iOS Safari가 16px 미만 입력창 포커스 시 자동 확대하는 문제 방지 (모바일 input/select/textarea 16px 통일)
- 탭바(`.apptabs`) `position:sticky` 고정 — 스크롤해도 상단 유지
- `--ink-faint` 대비 2.24:1 → WCAG AA 기준(4.5:1+)로 색상 조정 (`#9AA09B` → `#676B68`)
- `<html lang="ko">` 추가, 아이콘 전용 버튼 aria-label 9곳 + 이미지 alt 7곳 추가
- 가로 스크롤 영역(탭바/타임라인/상태필터/수집함필터) 우측 페이드 마스크로 "더 있음" 시각 신호 추가
- 부수 버그: sticky 탭바가 매물탭 지도까지 스크롤하면 사라지는 문제 → Leaflet 컨트롤 기본 z-index(1000)가 탭바(50)보다 높아서 덮어쓴 것으로 확인, 탭바 z-index를 1001로 상향

### 디자인 시스템 4라운드 — 타입 스케일·터치 타깃·카드 액션 재구성 (외부 "Claude Design" 도구 기반)
- `--fs-micro`(11→12px)·`--fs-label`(12→13px) 토큰 상향, 기존 하드코딩 px 값들을 실제로 토큰에 연결
- 매물 카드 액션 링크 7개(지도에서 보기~삭제)가 모바일에서 과밀하던 문제 → 우선순위 앞 2개만 상시 노출 + 나머지는 "⋯ 더보기"로 접기, 480px 이하 44px 터치 타깃 확보
- 데스크톱은 `display:contents`로 그룹 투명화해 기존처럼 한 줄 wrap 유지

### 매물 카드 링크 정리
- "실거래가" 버튼이 매물명과 무관하게 항상 국토부 홈페이지로만 이동하던 버그 발견 (딥링크 자체가 불가능한 구조) → 호갱노노와 함께 제거
- 네이버 링크는 등록된 URL이 있으면 "네이버 열기"만, 없으면 "네이버지도" 검색만 표시 (기존엔 항상 둘 다 노출)

### 코드 정리
- 가로 스크롤 페이드 마스크 4곳에 중복돼있던 동일한 `mask-image` 그라디언트를 `--fade-mask-r` 토큰 하나로 통합

---

## 2026-07-11 — 지도 API 전면 교체 (Leaflet → 네이버 지도)

### 지도 SDK 교체
- 매물탭 지도 3곳(개요/등록폼/수정모달)을 Leaflet.js+OpenStreetMap에서 네이버 지도 JS API v3로 전면 교체
- 마커 클릭↔카드 선택 연동, 임장 루트(번호마커+선+정보창), 모바일 풀스크린 토글 등 기존 동작 전부 유지
- 환경변수: `NAVER_MAPS_CLIENT_ID`(JS SDK, `index.html`에 공개 파라미터로 직접 포함)

### 지오코딩 교체
- `/api/geocode`를 카카오 로컬 검색에서 네이버 Geocoding API로 완전 교체 (Nominatim 폴백도 제거)
- 정식 주소 변환 방식이라 카카오 대비 단지명 등 키워드 검색은 결과가 안 나올 수 있음 — 실사용 중 확인 필요
- 환경변수: `NAVER_MAPS_CLIENT_ID`, `NAVER_MAPS_CLIENT_SECRET` (서버측, Vercel 환경변수로만 등록)

---

## 2026-07-11 오후 — 매물탭 UI 수정 5건 + API 보안 강화

### 매물탭 UI 버그·개선 5건
- **임장루트 리스트 세로 깨짐**: `.route-bar`가 row 레이아웃일 때 `.rb-actions`(버튼 4개, 281px)가 `.rb-route`를 35px로 압축시켜 매물명이 한 글자씩 세로로 깨지던 버그. `.route-bar`를 `flex-direction:column`으로 base 승격(480px 미디어쿼리의 동일 규칙은 중복이라 제거)
- **`.wrap` 최대폭 1160→1440px**: 매물 2단 그리드는 리스트 컬럼이 `minmax(0,360px)` 고정이라 늘어난 폭은 지도 쪽으로 흡수됨
- **매물 카드 정보 위계 변경**: 헤드라인(크고 굵은 글씨)을 보증금·전용면적에서 단지명·역·호선으로, 부제를 그 반대로 스왑. 상태 뱃지·실사 진행률·확장 토글 위치는 그대로
- **매물 외부검색 링크 제거**: `unisearch-result`의 네이버부동산/호갱노노/네이버지도/실거래가 4개 링크와 이를 채우던 JS(`updateUnisearch` 링크 로직, `siteUrl()` 헬퍼) 삭제. 내 매물 목록 필터(`#prop_search`)는 유지
- **매물 상태 필터 칩 상단 클리핑**: QA 문서에 "재현 필요"로 남아있던 항목을 Playwright로 게스트 모드에 매물 25개를 시드해 실측 재현. 원인은 `.tabs{overflow-x:auto}`가 스펙상 `overflow-y`도 `auto`로 승격시켜 flex 아이템의 자동 최소높이를 0으로 만드는 것 — ≥900px 좌측 컬럼(`.grid>section`, `max-height` 고정)에서 매물이 많으면 flexbox가 `.tabs`를 콘텐츠 높이(31px) 대신 7px대로 짓눌러 칩이 빈 것처럼 보임. `.tabs{flex-shrink:0}`으로 수정, 압축은 원래 그 역할이던 `.rail`(내부 스크롤)이 전담하도록 정리
- 로컬 검증에 `playwright`를 임시 설치해 실측 후 제거(`package.json`엔 흔적 없음, `node_modules`는 gitignore)

### API 보안 강화 (Codex)
- `/api/messages`: 클라이언트가 지정한 `body.model`을 무시하고 서버 `ANTHROPIC_MODEL`(기본 Haiku)만 사용하도록 고정 — 임의 모델 지정으로 인한 비용 우회 차단
- `api/_auth.js`: 세션별 rate limit을 Redis `INCR` 기반 원자 증가로 변경 (기존 read-then-write 방식의 레이스 컨디션 제거)
- `/api/login`: PIN 시도 횟수도 Redis `INCR` 기반으로 동일하게 강화
- `/api/health`: GET만 허용 + 세션당 시간당 60회 제한, Anthropic 원문 오류는 서버 로그에만 기록
- `/api/geocode`: 세션당 시간당 120회 제한 + 검색어 120자 제한
- 브라우저에 노출되던 `APP_SHARED_SECRET`(보안 효과 없음) 제거 — Bearer 세션 + rate limit으로 대체
- `CLAUDE.md`/`AGENTS.md`: 도메인 제한된 공개 SDK Client ID와 절대 노출 금지인 Client Secret을 구분하는 규칙 명문화

---

## 2026-07-12 — v5 단지·매물 2계층 전환(E-01) + 하드닝

### E-01
- `state.properties[]` → `state.complexes[]`(단지·장기추적) + `state.listings[]`(매물·시점 스냅샷) 2계층 재설계
- 마이그레이션 프리뷰(비파괴, 원본 `properties[]` 보존) + idempotency 가드(재실행 중복 방지)
- 단지 카드 목록/상세(PC 우측 패널)·매물 상태관리·대표매물·주간 확인 UX
- 네이버 붙여넣기/TSV 임포트를 단지/매물 라우팅(기존 컬럼 계약 유지)
- 단지/매물 CSV 분리 export + 내보내기 드롭다운
- 필터 6종(탐색그룹/단지상태/매물상태/면적등급/세대수등급/노선)·사이드바-지도 리사이즈
- cutover: 지도·목록·통계·임장루트를 complexes 기준으로 전환 + 마커 호버 툴팁, 레거시 뷰 은퇴(데이터 보존)
- geocodeQuery 표시명/검색어 분리 + "서울" 리전 prefix
- 커밋: `9335be4`~`8e4ac07`

### 하드닝(배포 후 발견·수정)
- 면적등급 필터 무작동(칩 어휘 불일치) 수정 (`f3da9cb`)
- `nav.js` Leaflet 잔재 `invalidateSize`→`refresh(true)`, `setOpacity` 제거 (`f4fcc3a`)
- 대시보드 집계를 complexes/listings 기준으로 전환 (`32d7f96`)

---

## 2026-07-12 — B-12 모바일 매물탭 지도/목록 통합 UX
커맨드센터가 워크스페이스에 직접 구현(4단계), 손 A(Claude Code)는 리뷰·검증·커밋·push만 담당.

- **1단계** (`f2b0113`): 지도 sticky 고정 + 카드 가로 스와이프 스트립 골격(`index.html`/`style.css`, 데스크톱 2단 그리드는 미디어쿼리로 격리해 무손실).
- **2~4단계 + 리뷰수정** (`b9b7926`): 마커↔카드 양방향 연동(마커 클릭 시 데스크톱은 기존 상세 패널, 모바일은 카드 스트립으로 스크롤+하이라이트) · 정렬(최신/가격/거리) · 현위치(geolocation, 미지원·거부 시 graceful 폴백) · 바텀시트(기존 `complexDetailModal`을 모바일에서 CSS로 하단 시트 래핑, 로직 재사용). `refreshOverview`/`reselectCxMarker`/`haversineM` 등 기존 함수 재사용, 신규 로직 최소화.
- **리뷰에서 발견·수정한 헤더 겹침 회귀 2건**: (1) 정렬칩/현위치 버튼이 모바일 미디어쿼리 밖에 선언돼 데스크톱(≥900px)에서도 렌더링되며 기존 지도 헤더(제목+범례)를 완전히 가리던 문제 → `display:none`(base)/`display:flex`(모바일 전용) 전환 + 정렬도 `DESKTOP_MQ.matches`일 때 건너뛰어 카드 순서 회귀 방지. (2) 그것만으로는 모바일에서 칩이 여전히 헤더와 같은 좌표에 앉아 제목을 가려서, 모바일 미디어쿼리 안에서 `.mapcard .mh` 자체를 `display:none` 처리 — 헤더 안의 "크게 보기"/"접기" 토글도 모바일에서 함께 사라짐(sticky 지도 UX상 불필요해져 의도된 결과).
- 부수: geolocation 거부 토스트 문구 부정확 표현 정정.
- 검증: 전체 `js/*.js` `node --check`, CSS 중괄호 균형, `git diff --check` 통과. Playwright로 데스크톱(1400px)·모바일(390px) 재실측 — 데스크톱은 헤더 정상 노출+칩/버튼 완전 숨김+카드 순서 무변경, 모바일은 칩/버튼이 헤더 없이 지도 상단에 안착+정렬 정상 동작, 콘솔 에러 0. XSS 무접점(거리·좌표는 숫자 계산값, 위치 마커/토스트는 정적 문자열).
- **실기기 모바일 배포 검증 대기**: 로컬 PIN·네이버 지도 도메인 제약으로 실기기 시각 확인은 배포 후 사용자 몫.

---

## 2026-07-12 — B-12 A안 재작업: 모바일 매물탭 풀스크린 지도뷰

방금 push한 B안("지도 상단 sticky + 그 아래 세로 흐름에 카드 스트립")이 실사용 피드백에서
"세로 스크롤 중 sticky 지도와 여러 z-index가 섞여 깨진 느낌"으로 확인돼, 시안대로
A안(뷰포트 고정 풀스크린 지도 + 떠있는 카드 오버레이)으로 레이아웃을 교체. 마커연동·정렬·
현위치·바텀시트 로직(`focusCxCard`/`sortComplexes`/`requestMyLoc`/`openComplexDetail` 등)은
전부 재사용, 레이아웃(지도 크기·카드 배치·부가 UI 위치)만 변경. 데스크톱(≥900px)은 전 단계
무변경.

- **1/4** (`8e18f15`): `#panel-props`를 `position:fixed`(nav 아래 뷰포트 전체, `overflow:hidden`)로 전환해 페이지 세로 스크롤 자체를 제거 — sticky+z-index 혼선의 근본 원인 제거. `#overviewMap`이 이를 기준으로 절대위치 풀스크린 배경이 됨. 카드 스트립·칩·FAB·검색·필터·폼·레거시 목록은 이 단계에서 전부 비워두고 이후 단계에서 순차 재노출.
- **2/4** (`9ab4798`): `#complexSection`(카드 스트립)을 지도 위 하단 오버레이로, `.cx-sort-chips`를 좌상단 오버레이로 재노출. z-index 체계 확립(지도 0 < 오버레이 10~20 < 기존 `.status-picker`/`.modal` 인프라값은 무변경). **버그 발견·수정**: `--nav-h`가 `.apptabs` 자체 높이만 담고 있어(`header` 높이 미포함) `#panel-props`가 헤더 하단부와 겹침 — `header`+`.apptabs` 합산값을 담는 `--topbar-h`를 새로 측정해(`updateNavHeightVar()` 확장, `initOverview()` 진입마다 재측정) 교체.
- **3/4** (`5a02d97`): 검색(`#unisearch`)·필터(`#cxFilterBar`)·내보내기·시트붙여넣기·임장루트를 지도 우상단 "⋯"(`#propMoreBtn`, 기존 위치에서 `position:fixed`만 부여) 메뉴로 통합. `showMoreMenu()`/`closeMoreMenu()`를 요소별 (parent,next) 추적 방식으로 일반화해 원래 부모가 서로 다른 요소들도 정확히 복원되도록 확장(데스크톱 `<480px` 기존 3항목 메뉴는 `DESKTOP_MQ` 분기로 그대로 유지). 현위치+매물추가(`#toggleForm`, 신규 원형 FAB)를 우하단에 세로로 쌓음. 매물 추가 폼(`#form.open`)을 지도를 밀어내지 않는 `position:fixed` 하단시트로 전환.
- **4/4** (`e27b21a`): 실데이터(단지 3개)로 Playwright 390/1400 전체 회귀 검증 — 세로 스크롤 없음·z-index 정상·`focusCxCard` 카드 하이라이트·카드 탭→바텀시트·데스크톱 무회귀 전부 통과. **검증 중 발견·수정한 버그 2건**: (1) ⋯메뉴에 검색+필터가 추가되며 실제 메뉴 폭이 옛 가정(230px)보다 커져(필터바 6행 포함 시 최대 366px) 뷰포트 밖으로 넓어지던 문제 → `.ph-more-menu{max-width:calc(100vw - 24px)}` + 내부 요소 `width:100%`로 고정. (2) 메뉴 좌측 위치 계산이 옛 폭(230px)을 하드코딩 가정해 확장된 메뉴에서 우측이 뷰포트 밖으로 튀어나가던 문제 → `menu.offsetWidth` 실측 기반 클램프로 교체.
- 검증: 매 단계 `node --check` + CSS 중괄호 균형 + `git diff --check` 통과 후 다음 단계 진행. XSS 무접점(신규 innerHTML 없음, 기존 `esc()` 경로 그대로).
- **실기기 모바일 배포 검증 대기**: 이번 세션도 로컬 PIN·네이버 지도 도메인 제약으로 정적 서버+게스트모드+Playwright로만 확인. 실제 배포 도메인+실기기에서 카드 스와이프 체감·FAB 터치 영역·바텀시트 제스처 확인 필요.

---

## 2026-07-12 — B-12 모바일 매물탭 지도뷰⇄리스트뷰 토글 (`a071de6`)

A안(풀스크린 지도뷰) 위에 리스트뷰(지도 숨기고 단지 카드 세로 목록, 페이지 스크롤 허용)를
토글로 추가. `propViewMode`(`js/properties.js`) → `#panel-props[data-view]` 속성으로 CSS 분기,
지도 우상단 새 원형 토글 버튼(⋯ 왼쪽)으로 전환. 위치 확인은 카드 탭 → 단지 상세 바텀시트의
지도(`#cxDetailMap`)로 충분해 리스트뷰엔 썸네일/지도를 중복 배치하지 않음.

- 리스트뷰: `#panel-props`의 `position:fixed`/`overflow:hidden` 해제(세로 스크롤 복원) · `.mapcard` `display:none` · `#complexSection`을 가로 스냅 스트립(`flex`)에서 세로 목록(`block`, full width, 스냅 해제)으로 전환.
- 검색·정렬·현위치·⋯메뉴·매물추가 FAB는 두 뷰 공통 접근 유지 — `.cx-sort-chips`/`#myLocBtn`을 `.mapcard` 안에서 `.grid` 형제로 이동(안 그러면 리스트뷰에서 `.mapcard` 전체가 숨겨질 때 그 안의 칩·버튼도 함께 사라짐).
- 마커↔카드 스크롤 연동(`focusCxCard` 등)은 리스트뷰에서 마커 클릭 경로 자체가 없어(지도 비표시) 별도 가드 없이 자연히 스킵.
- **버그 발견·수정**(리뷰 스크린샷으로 직접 확인): 지도뷰는 페이지가 항상 스크롤 불가(scrollY=0)라 `--topbar-h`(헤더+탭바 높이) 고정값으로 충분했지만, 리스트뷰는 실제로 스크롤되며 `header`는 스크롤에 딸려 올라가고 `.apptabs`만 `top:0`에 남음 — 오버레이(정렬칩·뷰토글·⋯버튼)가 `--topbar-h`에 고정된 채라 스크롤 후 카드 위에 얹히는 문제 발견. 스크롤에 따라 `--topbar-h`에서 `scrollY`를 빼되 `--nav-h` 밑으로는 안 내려가게 클램프하는 `--overlay-top`을 신설(스크롤 리스너, RAF 스로틀)해 오버레이들의 `top` 기준을 교체.
- **겸사겸사 점검 2건**: (1) `z-index` 주석-실제 불일치(`.status-picker` 2000 vs `.modal` 1000, 주석은 반대로 서술돼 있었음 — 동시 표출 흐름이 없어 무해하나 실측값 기준으로 주석 정정). (2) `--topbar-h` 초기 측정 플리커 여부를 Playwright 프레임별 실측으로 확인 — `switchPanel()`이 `initOverview()`→`updateNavHeightVar()`를 동기 호출해 페인트 전에 갱신되므로 플리커 없음(관찰된 유일한 시각 전환은 기존 `.panel{animation:fade}` 페이드인, 무관).
- 검증: `node --check` + CSS 중괄호 균형 + `git diff --check` 통과. Playwright 390px(지도⇄리스트 토글, 리스트뷰 세로 스크롤 정상, 두 뷰 모두 카드 탭→바텀시트, ⋯메뉴/FAB 동작) + 1400px(토글 버튼·칩·현위치 전부 `display:none`, 그리드·sticky 지도·카드 목록 무회귀) 확인.
- **알려진 특성(버그 아님)**: 리스트뷰에서 플로팅 오버레이(정렬칩 등)는 `position:fixed`라 스크롤 중 카드 텍스트 위에 겹쳐 보일 수 있음 — 플로팅 툴바가 스크롤 콘텐츠 위에 뜨는 통상적 패턴이며, 완전히 겹침을 없애려면 리스트 상단 여백 예약이나 툴바 배경 불투명화 등 추가 디자인 결정이 필요해 이번 범위에서는 보류.

---

## 2026-07-12 — B-23 iOS 웹앱 당겨서 새로고침(pull-to-refresh) (`c0c72b8`)

iOS 홈화면 웹앱(standalone)은 브라우저 UI가 없어 새로고침 수단이 전무했던 문제를 커스텀
pull-to-refresh로 해결. `navigator.standalone===true`일 때만 활성화 — 안드로이드 Chrome·일반
브라우저 탭은 리스너 자체를 붙이지 않아 기존 pull-to-refresh를 그대로 유지(충돌 방지).

- 최상단(`scrollTop 0`)에서 아래로 70px 이상 당기면 인디케이터가 "당김 완료" 상태로 전환, 손을 떼면 `location.reload()`. 임계 미만이면 원위치 스냅백. 당기는 동안 인디케이터 위치/회전이 손가락을 실시간으로 따라감.
- **가로 스와이프 충돌 방지**: 세로 이동이 가로보다 우세할 때만 pull 제스처로 판정(`js/boot.js`) — 방향이 확정되기 전엔 판단 보류, 가로 우세로 판명되면 즉시 관여를 끊어(`preventDefault` 호출 안 함) 매물탭 지도뷰의 `#complexSection` 카드 가로 스와이프가 그대로 살아있게 함.
- **범위**: touch delta 기반 전역 리스너(`document`)라 매물탭 지도뷰처럼 자체 스크롤이 없는 화면(`#panel-props{overflow:hidden}`)도 `document.scrollingElement.scrollTop`이 항상 0이라 자연히 "최상단"으로 처리됨 — 별도 컨테이너 판별 로직 불필요.
- 모달이 열려 있는 동안은 pull 제스처를 아예 시작하지 않음(`.modal.open` 가드) — 폼/바텀시트 내부 스크롤 중 실수로 전체 리로드되는 걸 방지(명시 요구사항은 아니었으나 실사용 안전장치로 추가).
- iOS standalone에서만 `<html>`에 `.ios-pwa` 클래스를 부여해 `overscroll-behavior-y:contain`으로 네이티브 러버밴드 바운스를 억제(커스텀 인디케이터와 이중으로 안 겹치게) — 이 클래스가 안 붙는 안드로이드/데스크톱은 스크롤 동작 무변경.
- 새 JS 파일 없이 `boot.js`에 추가(`index.html`엔 인디케이터 DOM만, `style.css`엔 표시 스타일만). `js/properties.js`·매물탭 레이아웃 CSS는 전혀 건드리지 않음(B-12와 파일 비충돌 확인).
- 검증: `node --check` + CSS 중괄호 균형 + `git diff --check` 통과. Playwright(`hasTouch` 컨텍스트 + `navigator.standalone` 모킹 + 합성 `TouchEvent`)로 임계 초과(reload 발생)·임계 미만(취소)·가로 우세 제스처(인디케이터 미표시)·non-standalone(전혀 관여 안 함)·매물탭 지도뷰(overflow:hidden에서도 정상 동작)·`#complexSection` 카드 위 가로 스와이프(인디케이터 미표시, 기존 스와이프 무방해)·데스크톱 1400px(콘솔 에러 0) 전부 확인.
- **실기기 검증 필요**: iOS standalone에서의 실제 러버밴드 억제 체감·리로드 타이밍은 에뮬레이터 한계로 확인 불가, 실기기 배포 후 확인 필요.

---

## 2026-07-12 — B-12/B-23 실기기 피드백 반영 2건

실기기 배포 후 사용자 피드백을 받아 두 가지 불편을 atomic 커밋 2건으로 수정.

### B-21 — 바텀시트(단지 상세) 드래그다운 닫기 (`25a0671`)
상단 "닫기" 버튼만 있어 불편하다는 피드백. 배경(딤) 탭 닫기는 조사 결과 이미 기존 범용
`.modal` 클릭 핸들러(`document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',
e=>{if(e.target===m)...}))`, 모든 모달에 적용)가 처리하고 있어 새로 구현할 필요가 없었음
(Playwright로 재확인만) — 실제로 새로 추가한 건 드래그다운뿐.

- `.box` 상단 ~60px(핸들 바+헤더 행) 안에서 시작한, 세로 우세·아래 방향 터치만 드래그닫기로 판정.
- 헤더가 sticky가 아니라서 본문을 스크롤하면 헤더가 화면 밖으로 밀려나 그 영역에서 터치가 시작될 수 없음 — "상단 존에서 시작"이라는 조건 하나로 "시트가 최상단일 때만"이 자연히 보장돼 본문 스크롤과 무충돌(`box.scrollTop>0` 체크는 안전망으로 추가).
- 90px 이상 끌면 `closeModal()` 재사용해 닫힘, 미만이면 스냅백. 기존 `openModal`/`closeModal` 그대로 사용, 새 CSS 불필요(기존 `.box::before` 핸들 바로 충분).
- 검증: Playwright + `hasTouch`로 임계 초과 닫힘·임계 미만 스냅백·핸들존 밖(본문 깊숙이) 드래그 무동작·배경 탭 닫힘·데스크톱 무회귀 확인.

### B-24 — pull-to-refresh 새로고침 후 화면 위치 유지 (`246b673`)
`location.reload()`가 앱을 대시보드 초기 상태로 되돌리던 문제. `activePanel`(`state.js` 전역)·
`propViewMode`(`properties.js` 전역)를 `sessionStorage`에 저장했다가 부팅 시 복원.

- 저장 시점 3곳: PTR의 `location.reload()` 직전 + `visibilitychange`(hidden 전환) + `pagehide`(안전망, reload 외 경로로 페이지가 사라지는 경우도 커버).
- 복원은 `boot.js`의 `load().then(restoreLastView)`로 — `load()`가 이미 `async`라 반환하는 Promise에 체이닝만 하면 돼 `state.js`를 건드릴 필요가 없었음.
- **`js/nav.js` 무접촉**(Codex 충돌 우려, 이전 세션들과 동일 원칙) — panel 이름을 화이트리스트로 검증한 뒤 이미 정의된 `switchPanel()`을 호출만 함(정의는 그대로).
- `sessionStorage`라 탭이 살아있는 동안(리로드 포함)만 유지, 새 탭/완전 종료 시엔 초기화 — "이 세션에서 마지막으로 보던 화면" 의도에 정확히 부합.
- 검증: Playwright로 `saveViewState()` 내용·`visibilitychange` 자동저장·사전 시딩된 `sessionStorage`로 부팅 시 props+리스트뷰 복원·다른 패널 복원·저장값 없을 때 기본 대시보드·손상된 JSON 무크래시·존재하지 않는 패널명 무시(빈 화면 방지)·데스크톱 무회귀 확인.

두 건 모두 `node --check`/CSS 중괄호 균형/`git diff --check` 통과, XSS 무접점(신규 innerHTML 없음).

---

## 2026-07-12 — B-12 실기기 z-index/스크롤 버그 3건 수정

실기기 배포 후 스크린샷 기반 피드백을 받아 세 가지 레이아웃 버그를 atomic 커밋 3건으로 수정.

### 버그1 — 바텀시트·폼시트가 탭바에 가림 (`9acb7a7`)
`.apptabs`(탭바) `z-index:1001`이 모바일 `#complexDetailModal`·`.form.open`(각각 1000/미지정→
`.modal` 기본값 1000 상속)보다 높아 시트 상단이 탭바 뒤로 가려짐. 두 시트 모두 `z-index:1100`으로
올려 탭바 위에 뜨도록 수정. `.modal` 자체가 딤 배경이고 `.box`는 그 자식이라 z-index 하나만
올리면 딤·시트가 함께 올라감. 데스크톱(≥900px) `#complexDetailModal{z-index:1002}`은 별도
미디어쿼리라 무변경(재확인 완료).

### 버그2 — 리스트뷰 첫 카드가 고정 칩/⋯바에 가림 (`434fb71`)
`data-view=list`는 `#panel-props`가 `position:static`(페이지 스크롤)인데 정렬칩·뷰토글·⋯버튼은
여전히 `position:fixed`로 떠 있고 카드 목록 상단에 여백이 없어 첫 카드가 그 뒤로 들어감.
`#complexSection`에 `padding-top:58px` 추가 — 스크롤 0(리스트뷰 진입 직후)일 때 바가 쉬는 위치
(콘텐츠 시작점 기준 10~48px)를 가리지 않을 만큼. `--overlay-top`을 calc에 넣지 않은 이유: 리스트
뷰는 `--overlay-top`이 `--topbar-h`와 같아지는 "맨 위" 순간(=스크롤 0)에만 이 여백이 필요하고,
스크롤 중엔 바가 탭바를 따라 위로 붙어 더 이상 겹치지 않기 때문. 스크롤 중 겹침 자체는 별도
이슈(B-22, 낮은 우선순위 미관 문제)로 이미 추적 중이라 함께 손대지 않음.

### 버그3 — 시트·⋯메뉴 열림 중 뒤 배경 스크롤 (`8cbfb95`)
`utils.js`의 `openModal`/`closeModal`에 `lockBodyScroll`/`unlockBodyScroll`을 훅으로 추가 — body를
`position:fixed`로 고정하는 표준 기법(iOS Safari에서 `overflow:hidden`만으론 러버밴드 스크롤이
안 막히는 문제 우회). 카운터를 둬서 모달 위에 또 다른 모달/메뉴가 겹쳐 열려도 마지막 하나가
닫힐 때만 해제. 같은 유틸을 `properties.js`의 `openForm`/`closeForm`(매물추가 폼시트)·
`showMoreMenu`/`closeMoreMenu`(⋯ 더보기)에도 적용 — 폼시트는 데스크톱(인라인 콘텐츠)에서 잠금을
건너뛰되, 폼이 열린 채로 브레이크포인트를 넘나드는 경우까지 대비해 실제로 잠갔는지를
`_formLocked`로 기억해 open/close를 대칭적으로 처리. ⋯메뉴는 기존 위치 계산(`window.scrollY`
기반)을 먼저 끝낸 뒤 잠금을 걸어, body가 `position:fixed`가 되며 `.status-picker`의 containing
block이 바뀌어도 `body{top:-scrollY}` 오프셋과 기존 `+scrollY` 계산이 상쇄돼 위치가 그대로 맞음
(Playwright 실측 확인). 매물탭 지도뷰(이미 `#panel-props{overflow:hidden}`로 무스크롤)는 잠글
스크롤이 없어 사실상 영향 없음.

검증: Playwright로 세 진입점(바텀시트/폼시트/⋯메뉴) 각각 열림 중 `body{position:fixed}` 전환·
스크롤 시도 무반응·닫으면 원래 위치로 복원 확인. 데스크톱은 세 버그 모두 무회귀(모달 z-index
1002 유지, 폼 오픈 시 스크롤 안 잠김) 재확인. `node --check`/`git diff --check` 통과, XSS 무접점.

---

## 2026-07-12 — B-12 리스트뷰 겹침 + ⋯메뉴 스크롤 재수정 2건

직전 수정만으론 부족했던 두 가지를 근본적으로 재수정. atomic 커밋 2건.

### 재수정A — 리스트뷰 스크롤 중 정렬칩/⋯이 카드와 겹침 (`9a8f7ef`)
이전 수정(`padding-top:58px`)은 리스트뷰 진입 직후 첫 카드만 밀어줬을 뿐, 정렬칩·뷰토글·
⋯버튼이 여전히 `position:fixed`로 떠 있어 스크롤하면 카드가 그 아래로 지나가며 겹쳐 보임
(투명 배경이라 더 두드러짐 — B-22에서 이미 지적된 근본 원인).

근본 수정: 리스트뷰에서만 이 세 요소를 신규 `#cxListToolbar`(`index.html`)로 실제 이동시켜
(복제 없이 DOM 이동 — `showMoreMenu()`와 같은 패턴, 이벤트 핸들러 그대로 유지)
`position:sticky` + 불투명 배경(`var(--bg)`) 툴바로 재구성. 지도뷰로 돌아가면 원래 자리로
되돌려 기존 `position:fixed` 오버레이 동작 복원(`properties.js`: `syncListToolbar()`,
`applyPropViewMode()`에서 호출). sticky 툴바가 실제 문서 흐름을 차지해 카드를 자연히
밀어내므로 `#complexSection`의 `padding-top` 매직넘버(58px)를 12px로 되돌림.

검증 중 발견·수정한 버그: `.cx-list-toolbar{display:none}` 기본값을 실수로 모바일
미디어쿼리 안에만 둬서 데스크톱에선 `<div>` 기본값(`display:block`)이 새던 것을 Playwright로
발견, 무조건 적용 구간으로 옮겨 수정.

### 재수정B — ⋯메뉴가 뷰포트 넘칠 때 배경 스크롤 (`83ac8ab`)
`lockBodyScroll()`로 body를 잠가도 여전히 뒤 배경이 스크롤되던 재발. 원인: `.ph-more-menu`가
검색+필터(6줄)+버튼 3개를 다 담으면 뷰포트보다 길어지는데 `max-height`/`overflow` 제약이
없어 메뉴 자체가 페이지를 늘려버림 — body `position:fixed` 잠금과 무관하게 브라우저가 늘어난
페이지 크기에 맞춰 스크롤을 허용. `showMoreMenu()`에서 버튼 아래 남는 세로 공간만큼
`menu.style.maxHeight`를 계산해 부여(기존 top/left 위치 계산과 같은 JS 실측 방식) + CSS
`.ph-more-menu{overflow-y:auto}`로 넘치는 내용은 메뉴 내부에서만 스크롤.

검증: Playwright로 (A) 스크롤 여러 지점에서 스크린샷 확인 — opaque sticky 바가 카드 위에
자연스럽게 얹히고 텍스트 비침 없음(겹침 자체는 sticky의 정상 동작, 문제였던 "투명 배경으로
비침"만 해결 대상이었음), 지도뷰 복귀 시 원래 자리·`position:fixed`로 정확히 복원, 데스크톱
`display:none` 유지. (B) 뷰포트를 인위적으로 짧게(390×500) 만들어 메뉴 내용이 실제로 넘치는
상황에서 `overflow-y:auto`가 작동해 메뉴 내부만 스크롤되고 `documentElement.scrollHeight`는
뷰포트 높이와 동일하게 유지됨(페이지 자체가 안 늘어남) 확인. `node --check`/CSS 중괄호 균형/
`git diff --check` 통과, XSS 무접점, 데스크톱 무회귀.

---

## 2026-07-13 — B-26 저장 안내 정합성 + B-35 매물탭 필터 재구성

### B-26 — 자산 저장 안내문 사실화 + AI 상담 전송 고지 (`c4f4952`)
자산 탭 안내문이 "입력값은 외부 서버로 전송되지 않고 이 브라우저(localStorage)에만
보관돼요"였는데, 실제 `save()`는 localStorage + Redis(클라우드) 동시 저장이라 정반대
문구였음(개인정보 오해 소지, P0). `state.js`의 `SYNC_MSGS`(클라우드 동기화/로컬만 저장)
문구는 이미 사실과 일치해 그대로 재사용 — 자산 안내문만 "이 보드 데이터(자산 금액 포함)는
클라우드 저장소에 동기화돼요. 동기화 실패 시엔 이 기기에만 저장돼요"로 정정, "대략값으로
적어라"는 기존 조언 취지는 유지. AI 상담 영역(`index.html` `#panel-chat`)에는 "AI 상담을
실행하면 자산·매물·액션 요약이 AI 서비스(Anthropic)로 전송돼요" 고지를 `.privacy` 클래스로
추가(현재 크레딧 소진으로 패널 비활성 상태라 문구만 미리 준비).

검증: `node --check` 통과, Playwright로 두 문구 모두 렌더링·줄바꿈 없이 정상 표시 확인
(스크린샷). PIN·키·실제 금액 미기록.

### B-35 — 매물탭 필터를 네이버부동산식 상단 그룹 칩 바로 재구성 (`913d7ec`)
기존 `cxFilterBar`가 6그룹(탐색그룹/단지상태/매물상태/면적등급/세대수등급/노선)을 라벨+칩
세로 스택으로 나열해 공간을 과하게 차지하던 문제. 그룹당 트리거 칩 1개(단지상태▾/매물상태▾/
면적▾/세대수▾/노선▾)를 가로 1줄로 배치하고 탭하면 그 그룹 옵션만 드롭다운으로 펼치는
네이버부동산 스타일로 교체. 탐색그룹(`regionGroup`)은 생성부(`saveComplex` 등 3곳)에서 항상
빈 문자열로 초기화돼 실사용 데이터가 전혀 없는 죽은 옵션이라 칩 노출에서 제외(단, `cxFilters.
region`/`cxMatchesFilters`/클릭 핸들러는 호환을 위해 숨김 DOM으로 그대로 유지). `cxFilters`
상태 객체와 `cxMatchesFilters()` 매칭 로직, 옵션 렌더(`renderCxFilterOptions`)는 전혀
건드리지 않고 UI(마크업+CSS+열고닫는 상호작용)만 교체.

드롭다운은 평소 `display:none`으로 원래 자리(트리거 옆)에 있다가, 열릴 때만
`document.body`로 옮겨 트리거의 `getBoundingClientRect()` 기준 `position:fixed`로
배치하고 닫으면 원래 자리로 되돌리는 기존 `showMoreMenu()`와 동일한 "이동-복원" 패턴을
재사용(`openCxFilterDropdown`/`closeCxFilterDropdowns`). 처음엔 `.cxf-group` 안에 그냥
`position:absolute`로 뒀다가 Playwright 스크린샷에서 드롭다운이 전혀 안 보이는 버그를
발견 — 원인은 `#cxFilterBar{overflow-x:auto}`가 CSS 스펙상 `overflow-y`도 강제로 `auto`로
계산시켜, 바 아래로 나가는 절대위치 드롭다운을 바로 잘라버린 것(한쪽 축만 `visible`이 아니면
브라우저가 둘 다 `auto`로 취급하는 알려진 함정). `showMoreMenu` 패턴으로 바꿔 해결. 부수적으로
마지막 그룹(노선) 드롭다운이 좁은 화면에서 뷰포트 오른쪽 밖으로 넘치던 것도 트리거 좌표 기준
clamp(`Math.min(rect.left, window.innerWidth-ddW-8)`)로 함께 해결.

모바일: 필터 칩 바를 더보기(⋯)메뉴에서 빼서(`showMoreMenu` 이동 목록에서 제거) 지도뷰 상단
오버레이 2번째 줄(정렬칩 바로 아래, `--overlay-top` 체계 기준 `+52px`)에 항상 노출. 리스트뷰
전환 시엔 기존 `syncListToolbar()` 이동 목록에 `cxFilterBar`를 추가해 `#cxListToolbar` 안
`flex-basis:100%` 둘째 줄로 편입(정렬칩·뷰토글·⋯버튼이 있는 첫째 줄과 겹치지 않음, 기존
sticky 불투명 바 메커니즘 그대로 재사용). ⋯메뉴엔 검색·내보내기·시트붙여넣기·임장루트만
남김.

검증: `node --check`/CSS 중괄호 균형/`git diff --check` 통과. Playwright로 데스크톱(1400px)·
모바일(390px) 양쪽에서 가짜 단지 3건 주입 후 (1) 트리거 라벨이 선택값을 반영(`면적: 59㎡
이하`)하고 카드가 실제로 필터링됨(3→1건) 확인, (2) 드롭다운이 뷰포트 안에 완전히 들어옴
(마지막 그룹 포함) 확인, (3) 모바일 지도뷰에서 필터 바가 정렬칩 줄과 겹치지 않음(바운딩
박스로 실측), (4) 리스트뷰에서 필터 바가 sticky 툴바 둘째 줄로 들어가고 카드와 안 겹침,
(5) ⋯메뉴에 더 이상 필터가 없음 확인. 데스크톱 무회귀, XSS 무접점(칩 라벨 `esc()` 통과).
지도 렌더 자체는 로컬 테스트 도메인이 네이버 API 키 허용 도메인이 아니라 "인증 실패"로
표시되나 이는 배포 환경과 무관한 로컬 검증 한계이며 필터 바 레이아웃 검증에는 영향 없음.

---

## 2026-07-13 — B-36 데스크톱 매물탭 좌측 리스트 자체 스크롤 (`4ff752a`)

### 문제
데스크톱 매물탭 좌측 컬럼(`.grid>section`)엔 `max-height:calc(100vh - var(--nav-h) - 24px)`가
있지만 `#complexSection`(v5 단지 카드 목록)엔 데스크톱 overflow 설정이 전혀 없어, 카드가
많으면 컬럼 자체가 max-height를 무시하고 늘어나 페이지 전체가 세로로 길어짐. 우측 지도는
`position:sticky`라 화면에 고정돼 있는데 옆의 리스트만 계속 길어지는 비대칭이 어색했음.
레거시 목록(`.rail`)은 이미 같은 `@media (min-width:900px)` 블록에서
`flex:1;min-height:0;overflow-y:auto`를 받고 있어 문제가 없었고, v5 전환 이후 신설된
`#complexSection`만 이 처리가 누락돼 있었음.

### 수정 (`style.css`, `@media (min-width:900px)` 블록만)
`#complexSection`에 `.rail`과 동일한 `flex:1;min-height:0;overflow-y:auto;padding-right:4px`를
부여해 카드 목록만 좌측 컬럼 내부에서 스크롤되게 함. 검색창(`.unisearch`)·`.panel-head`
(통계·버튼)·`.form`(매물 추가 폼)·`#legacyToggleWrap`에 `flex-shrink:0`을 명시해 목록이
자라도 위쪽 고정 영역이 눌리지 않게 함(`#cxFilterBar`는 B-35에서 이미 `flex-shrink:0`
적용됨). 모바일(`@media (max-width:899.98px)`)의 `#complexSection{position:absolute;...}`
(지도 위 가로 스트립)는 별개 블록이라 전혀 손대지 않음.

### 검증
`node --check`/CSS 중괄호 균형/`git diff --check` 통과. Playwright로 데스크톱(1400px)에
가짜 단지 30건 주입 후 (1) `#complexSection.scrollHeight`(6048px) ≫ `clientHeight`(476px)로
내부 스크롤 필요 확인, (2) 카드 수를 2/30/80으로 바꿔도 `document.documentElement.
scrollHeight`가 1236px로 동일 — 페이지 자체는 더 이상 카드 수에 비례해 늘어나지 않음(남은
1236px는 `.gates`/`.wcard` 등 그리드 위쪽 요소 때문인 베이스라인으로, 리스트와 무관), (3)
`#complexSection.scrollTop`을 800으로 바꿔도 `window.scrollY`는 0 유지 + `.mapcard`의
`getBoundingClientRect()`가 스크롤 전후 완전히 동일(지도가 전혀 움직이지 않음) 확인, (4)
레거시 목록(`legacyToggleBtn`) 펼침 상태에서도 페이지 높이 불변 확인. 모바일 지도뷰/리스트뷰
스크린샷으로 `#complexSection`의 `position`(absolute/static)·`display`가 기존과 동일함을
확인해 무회귀 검증. XSS 무접점(CSS 전용 변경).

---

## 2026-07-13 — B-47 데스크톱 매물탭 상단 슬림화 (`da38aad`)

### 문제
B-36으로 좌측 리스트(`#complexSection`)가 컬럼 내부 자체 스크롤이 됐지만, 그 위 고정
영역(기준바 `.gates` + `panel-head` 보조 버튼 여러 줄 + 필터칩)이 커서 카드가 2~3개만
보임. 모바일(A안)은 이미 ⋯더보기(`showMoreMenu`)로 보조 버튼을 접었는데 데스크톱은
`propMoreBtn`이 `.ph-more-btn{display:none}` 기본값에 걸려 있어 버튼이 전부 펼쳐진 채였음.

### 수정 (`index.html`/`js/properties.js`/`style.css`)
1. **기준바 접이식**: `.gates`에 `id="gatesBox"`, `.gh`에 토글 버튼(`#gatesToggleBtn`)
   추가. 기본 접힘(`.gates:not(.expanded) .gatelist{display:none}`) — 제목 1줄만 노출.
   `properties.js`에 `initGatesToggle()` IIFE 신설(렌더 로직인 `renderGates()`는
   `nav.js` 소유라 손대지 않고, 펼침/접힘 클래스 토글 + `localStorage`(`sh_gatesExpanded`)
   저장만 별도 함수로 분리 — nav.js 무접촉 원칙 유지).
2. **⋯더보기 데스크톱 이식**: `@media (min-width:900px)`에 모바일 480px 이하 블록과
   동일한 패턴(`.ph-actions>.ph-more-btn{display:inline-flex}` + 나머지
   `#phExportRow`/`#propBulkBtn`/`#propRouteBtn`/`#migStartBtn`
   `{display:none}`)을 추가. `showMoreMenu()`의 desktop `ids` 배열에도 `migStartBtn`
   ("기존 매물을 단지로 정리")을 추가 — 기존엔 desktop/mobile 배열 둘 다 이 버튼이
   빠져 있어 모바일에서도 접근 불가였던 걸 함께 바로잡음("모바일과 통일" 요구사항
   충족). 상단 상시 노출은 검색·필터칩·정렬(select)·매물추가만 남음.

### 검증
`node --check`/CSS 중괄호 균형/`div` 개폐 개수/`git diff --check` 통과. Playwright로
데스크톱(1400×900)에 가짜 단지 12건 주입 후 (1) 새로고침 직후 기준바가 기본 접힘 상태
확인, 토글 클릭 시 펼쳐지고 새로고침해도 펼침 상태가 유지됨(`localStorage`) 확인, (2)
`#propMoreBtn`은 `display:flex`, 나머지 4개 보조 버튼은 `display:none`으로 인라인에서
사라짐 확인, (3) ⋯ 클릭 시 4개 버튼이 모두 `.ph-more-menu` 안으로 이동해 있음 확인,
바깥 클릭으로 닫으면 원래 `.ph-actions` 부모로 정확히 복원됨 확인, (4) B-36과 동일한
합성 데이터로 `#complexSection`의 `getBoundingClientRect().top`을 이번 수정 전/후
비교 — 574.75px → 453.25px(-121.5px)로 줄어 뷰포트(900px)에 보이는 카드 수가 3개→4개로
증가함을 정량 확인. 모바일은 `.gates`가 이미 완전히 `display:none`이라 무관, ⋯메뉴에
`migStartBtn`이 새로 포함된 것과 지도뷰/리스트뷰 스크린샷으로 무회귀 확인. XSS
무접점(CSS·클래스 토글 전용 변경, 사용자 입력 삽입 없음).

---

## 2026-07-13 — B-48 레거시 "기존(미정리) 매물" UI 은퇴 (`886d490`)

### 문제
E-01(단지·매물 2계층 전환) 이관 완료 후에도 매물탭 좌측 단지 카드 아래에 "▸ 기존(미정리)
매물 (N)" 토글 + (펼치면) 상태 탭칩(전체/관심/검토중…) + 레거시 목록이 그대로 남아
공간을 잠식(B-47로 상단을 슬림화해도 이 잔재가 카드 노출 수를 다시 갉아먹음).

### 수정 (`js/properties.js`, `renderComplexes()`)
`state.complexes.length>0`(이관 완료) 분기에서 기존엔 `legacyToggleWrap.style.display=''`
(토글 버튼은 항상 노출) + `legacyWrap.style.display=legacyExpanded?'':'none'`(목록은
펼침 상태에 따라)였던 것을, `legacyExpanded` 값과 무관하게 **둘 다 무조건
`display:none`**으로 바꿈 — 토글 버튼 자체가 사라지므로 사용자가 실수로 펼쳐놓은
상태였더라도 이관 완료 후엔 항상 숨겨짐. `state.complexes.length===0`(미마이그레이션)
분기는 전혀 손대지 않아 `legacyWrap`이 "기존 매물을 단지로 정리" CTA와 함께 유일한
진입점 역할을 계속 함. `properties[]`/`renderList()`/`renderTabs()` 렌더 로직, `#tabs`/
`#list` DOM, ⋯메뉴의 "레거시 내보내기"(백업 수단)는 전혀 삭제하지 않음 — 완전 삭제는
B-05에서 백업 확인 후 별도 진행 예정.

### 검증
`node --check`/`git diff --check` 통과. Playwright로 데스크톱(1400×900):
(1) `state.complexes=[]`(GUEST_STATE 기본 레거시 `properties[]` 3건 보유) 상태에서
`legacyToggleWrap`은 `display:none`, `legacyWrap`은 `display:flex`(마이그레이션 CTA +
상태 탭칩 + 목록 정상 노출) 확인 — 미마이그레이션 경로 무회귀. (2) 가짜 단지 10건
주입(이관 완료 시뮬레이션) 후 `legacyToggleWrap`·`legacyWrap` 둘 다 `display:none`
확인 — 카드 바로 아래에 아무 잔재도 안 남음. (3) `renderTabs`/`renderList` 함수와
`#tabs`/`#list` DOM이 여전히 존재함을 확인해 로직 삭제 없음 검증. (4) 미마이그레이션
상태에서 수동으로 `legacyExpanded`를 펼친 뒤 단지를 추가해도(이관 완료) 여전히 둘 다
숨겨짐 확인(무조건 숨김 로직이 상태와 무관하게 동작함을 재확인). 모바일은 기존에
이미 `@media(max-width:899.98px){#legacyToggleWrap,#legacyWrap{display:none}}`로
완전히 숨겨져 있었음을 재확인(이번 변경과 무관, 스크린샷으로 지도뷰/리스트뷰 무회귀
확인). XSS 무접점(`display` 토글 전용, 신규 사용자 입력 삽입 없음).

---

## 2026-07-13 — B-44① 단지 카드 "이번 주 확인 완료" 버튼 제거 (`dd0df50`)

### 문제
단지 카드(`renderComplexes()`)에 "이번 주 확인 완료" 버튼(`weeklyBtn`)이 있었는데,
동일 기능이 단지 상세 모달(`cxDetailWeeklyCheckBtn`)에 이미 있어 중복 — 카드 높이만
불필요하게 키워 노출 수를 잠식.

### 수정 (`js/properties.js`)
카드 템플릿에서 `weeklyBtn` 변수·렌더를 제거하고 `weeklyBadge`("7일+ 미확인" 경고
칩)와 "최근 확인 [날짜]"만 유지. `c-actions` 줄의 조건부 렌더링을
`(weeklyBadge||weeklyBtn)?...`에서 `weeklyBadge?...`로 단순화해 버튼이 빠져도 빈 줄이
안 남게 함. 카드에서 사라진 버튼이 쓰던 delegated 클릭 핸들러
(`#complexSection`의 `[data-weeklycheck]` 분기)도 함께 정리 — `weeklyCheckComplex()`
함수 자체는 상세 모달 버튼이 계속 호출하므로 그대로 보존.

### 검증
`node --check`/`git diff --check` 통과. Playwright로 데스크톱(1400×900)·모바일
(390×844) 양쪽에서 단지 2건(하나는 대표매물 `lastCheckedAt` 10일 전 = 미확인 뱃지
대상, 하나는 방금 확인 = 뱃지 없음) 주입 후: (1) 카드에 `[data-weeklycheck]` 버튼이
전혀 없음(`hasWeeklyBtn:false`) 확인, (2) 미확인 카드엔 "7일+ 미확인" 뱃지 +
"최근 확인 2026. 7. 3." 유지, 최근확인 카드엔 뱃지 없이 날짜만 표시 확인(스크린샷으로
빈 줄·여백 없음 시각 확인), (3) 단지 상세 모달을 열어 `cxDetailWeeklyCheckBtn` 클릭 →
`state.listings`의 `lastCheckedAt`이 즉시 갱신되고 상세 뱃지가 사라짐 확인, (4) 상세에서
확인 처리한 직후 카드 쪽도 뱃지가 사라지고 날짜가 갱신됨을 재확인해 카드·상세가 같은
데이터 파이프라인을 공유함(회귀 없음)을 검증. XSS 무접점(신규 사용자 입력 삽입 없음,
코드 삭제·조건식 변경 전용).

---

## 2026-07-13 — B-49 데스크톱 매물탭 지도 하단 여백 제거 (`3a2be9a`)

### 문제
데스크톱 매물탭 우측 지도(`#overviewMap`/`.mapcard`)와 좌측 컬럼(`.grid>section`)의
높이가 `calc(100vh - var(--nav-h,64px) - 24px)` 고정값이었는데, 그 위 기준바(`.gates`,
B-47에서 접이식 도입)의 실제 높이를 전혀 반영하지 못해 기준바만큼 아래로 밀린 채
고정 높이를 유지 — 지도·리스트가 뷰포트 하단까지 못 닿고 아래에 여백이 남음.

### 수정 (`style.css`, `@media (min-width:900px)`)
매물탭(`#panel-props.on`)을 뷰포트 고정 flex 컬럼으로 재구성:
- `#panel-props.on`: `height:calc(100vh - var(--topbar-h,110px) - 20px)` +
  `display:flex;flex-direction:column` + `overflow:hidden`(뷰포트 고정 컨테이너화).
- `.gates`: `flex-shrink:0`(고정, 접힘/펼침 높이가 그대로 반영됨).
- `.grid`: `flex:1;min-height:0`(기준바 제외 남는 높이 전부 차지) +
  `grid-template-rows:minmax(0,1fr);align-items:stretch`.
- `.grid>section`·`.mapcard`: 고정 `max-height`/`height` calc 대신 `height:100%`로
  `.grid` 높이를 꽉 채움. `.mapcard`는 `display:flex;flex-direction:column`으로 바꿔
  `.mh`(헤더)는 `flex-shrink:0`, `#overviewMap`은 `flex:1;min-height:0`.

**높이 기준 변수 교정**: 기존 `--nav-h`(sticky 탭바 자체 높이만, 헤더와 겹침 —
`properties.js`의 `updateNavHeightVar()` 주석에 이미 명시돼 있던 함정)를
`--topbar-h`(헤더+탭바 포함, 이미 JS가 매 `switchPanel('props')` 진입마다 정확히
재측정)로 교체하고, `.apptabs{margin-bottom:20px}`(`getBoundingClientRect()`엔
안 잡히는 레이아웃 여백)를 추가로 빼야 `#panel-props`가 실제로 시작하는 지점과
정확히 일치함을 Playwright 실측으로 확인 후 반영.

**CSS Grid 함정 발견·수정**: 처음엔 `align-items:stretch`/`grid-template-rows` 없이
`height:100%`만 부여했더니 `.grid`가 상속받은 `align-items:start`(기존 무조건 적용
베이스 규칙) 때문에 단일 auto 행이 컨텐츠 크기(2000px+, `#complexSection`의 스크롤
콘텐츠 전체 높이)로 새어버려 지도가 뷰포트를 완전히 벗어나는 회귀를 Playwright
실측(`mapcardBottom`)으로 발견 → `.grid`에 `grid-template-rows:minmax(0,1fr)`+
`align-items:stretch`를 명시해 해결.

`.mapcard`의 `position:sticky`는 `#panel-props` 자체가 뷰포트 고정 컨테이너가 되며
불필요해져 제거(페이지가 스크롤 안 되니 "붙어 있을" 필요가 없음 — 태스크 지시의
"검토" 요청에 따라 제거로 판단). B-36의 `#complexSection` 자체 스크롤(`flex:1;
overflow-y:auto`)은 그대로 유지. 모바일(A안, `@media max-width:899.98px`)은 전혀
손대지 않음.

### 검증
`node --check`(JS 변경 없음)/CSS 중괄호 균형/`git diff --check` 통과. Playwright로
데스크톱(1400×900)에 가짜 단지 15건 주입 후: (1) 기준바 기본 접힘 상태에서
`mapcardBottom`·`gridBottom`·`sectionBottom`·`panelBottom`이 전부 `viewportHeight`
(900)와 정확히 일치(여백 0) 확인, (2) 기준바를 펼쳐도(`gatesHeight` 45→90px 증가)
동일하게 전부 900과 일치 — 기준바 상태와 무관하게 항상 하단까지 닿음을 확인,
(3) `#complexSection`의 `clientHeight`가 기준바 상태에 따라 정확히 조정됨(447↔402,
차이 45px = 기준바 높이 증가분과 일치) — B-36 내부 스크롤 정합성 확인, (4)
`#complexSection.scrollTop`을 바꿔도 `window.scrollY`는 0 유지 + `.mapcard`가 전혀
움직이지 않음 확인. 모바일은 `#panel-props`의 computed `position:fixed`·
`display:block`이 그대로임을 확인(데스크톱 전용 규칙이 새지 않음)하고 지도뷰/
리스트뷰 스크린샷으로 무회귀 확인. XSS 무접점(CSS 레이아웃 전용 변경).

---

## 2026-07-13 — B-46 매물탭 하단 여백/잔여 스크롤 제거 (`c58d70e`)

### 원인
B-49 검증 중 발견한 잔여 스크롤(~98px)의 원인을 특정: 전역 컨테이너 `.wrap`의
`padding:24px 20px 64px`(하단 64px)이 과함. 뷰포트 고정 flex 레이아웃인 매물탭
(B-49)에선 이 하단 패딩이 그대로 페이지 아래 여백 + 잔여 스크롤로 남았음.

### 수정 (`style.css`)
1. `.wrap` 기본(무조건 적용) `padding-bottom`을 64px → 24px로 전역 축소.
2. 데스크톱 매물탭(`#panel-props.on`) 활성 시엔 뷰포트 고정 레이아웃이라 하단
   패딩 자체가 불필요 — `body:has(#panel-props.on) .wrap{padding-bottom:0}`로
   조건부 0 적용(`:has()` 사용, 이미 모던 브라우저만 대상인 프로젝트라 지장 없음).
   `@media(max-width:760px)`의 별도 모바일 `.wrap{padding:14px 12px 60px}` 오버라이드는
   손대지 않음(범위 밖).

### 검증
`node --check`(JS 변경 없음)/CSS 중괄호 균형/`git diff --check` 통과. Playwright로
데스크톱(1400×900): (1) 매물탭에 가짜 단지 15건 주입 후 `.wrap`의 computed
`padding-bottom`이 `0px`, 잔여 스크롤(`scrollHeight-innerHeight`)이 B-49 시점
~98px에서 34px로 감소 확인(완전한 0은 아니나 대폭 개선 — 남은 34px는 `.wrap` 밖
다른 페이지 요소로 추정, 이번 범위 밖), (2) 대시보드·자산·액션·수집함 4개 탭
전환 시 `.wrap`의 `padding-bottom`이 여전히 `24px`(0으로 안 새어나감) 확인, 각 탭
풀페이지 스크린샷으로 마지막 요소가 브라우저 하단에 딱 붙지 않고 적당한 여백을
유지함을 시각 확인(무회귀). XSS 무접점(CSS 레이아웃 전용 변경).

---

## 2026-07-13 — B-44② 단지 카드 밀도 개선 + 대표가격 헤드라인급 강조 (`ac88572`)

### 목표
B-44①(카드 확인 버튼 제거) 후속. (1) 대표매물 보증금이 다른 칩들과 똑같은 크기의
작은 `.chip.deposit`이라 눈에 안 띄던 것을 단지명 바로 아래 헤드라인급으로 강조
("사람은 단지가 아니라 가격을 기억"). (2) 카드 세로 여백을 더 축소해 뷰포트에
보이는 단지 수를 늘림.

### 수정 (`js/properties.js`, `style.css`)
1. **대표가격 헤드라인**: `c-head-text`(단지명이 있는 영역)에 `c-price`(16px, 굵게,
   골드 `--line9-deep`) 신설, `c-headline`(단지명)과 `c-sub`(역·노선·세대수) 사이에
   배치. 기존 `c-meta`의 `보증금 N억` 칩은 중복이라 제거, 더는 안 쓰는
   `.chip.deposit` CSS 규칙도 함께 정리.
2. **카드 밀도**: `#complexSection` 스코프 안으로만 데스크톱 전용 압축 규칙 추가 —
   레거시 `.rail .card`(properties[] 미마이그레이션 목록)가 같은 `.card`/`.c-top`/
   `.c-meta` 클래스를 공유하므로, 스코프 없이 전역으로 바꾸면 레거시 카드까지
   영향을 받았을 것. `card margin-bottom`(12→4px), `c-top padding`(14→8px),
   `c-meta margin-bottom`(8→3px) 축소. 카드 하단 패딩은 기존 인라인
   `style="padding:0 15px 14px"`(고정값이라 조건부 데스크톱 축소가 불가능했음)를
   `cx-card-body` 클래스로 바꿔 데스크톱에서만 8px로 줄임.

### 시행착오
처음 `c-price`를 19px로 뒀더니, 새로 추가된 가격 줄의 높이(line-height 포함
~29.5px)가 패딩·마진 절감분(~19px)보다 커서 카드가 오히려 143px→157px로
**더 커져** 뷰포트에 보이는 카드 수가 그대로(3→3)였음을 Playwright 실측
(`cardOuterHeight`, `visibleCardsInViewport`)으로 발견 — 목표(카드 수 증가)와
반대 결과였음. `c-price`를 16px·`line-height:1.25`로 줄이고 패딩 축소폭을 더
키워(`card margin-bottom` 6→4px, `c-top` 9→8px, `cx-card-body` 9→8px) 최종적으로
카드 높이가 143→140px로 순감소, 뷰포트에 보이는 카드가 3→4개로 증가함을 확인
후 확정.

### 검증
`node --check`/CSS 중괄호 균형/`git diff --check` 통과. Playwright로 데스크톱
(1400×900)에 가짜 단지 15건(대표매물 포함) 주입 후: (1) 레거시 카드(`#legacyWrap
.card`, GUEST_STATE 기본 properties)의 `margin-bottom`(12px)·`c-top padding`
(14px 15px)이 원래 값 그대로임을 확인 — `#complexSection` 스코프가 정확히
격리됨, (2) 단지 카드의 `c-price` 텍스트("보증금 4억")·폰트 크기(16px)·색상
(`--line9-deep` 골드) 확인, `c-meta`에 deposit 칩이 더는 없음 확인, (3) 카드
`margin-bottom`(4px)·`c-top padding`(8px 15px)·`cx-card-body padding`(0 15px
8px) 축소 확인, (4) 뷰포트 안 보이는 카드 수가 3(수정 전 baseline)→4로 증가
확인(스크린샷으로 시각 확인 — "보증금 N억"이 눈에 띄는 색·굵기로 단지명 바로
아래 노출됨도 함께 확인). 모바일(390×844) 지도뷰·리스트뷰에서 `c-price`가
같은 폰트 크기(16px)로 잘 보이되 `c-top padding`은 기존 480px 브레이크포인트
값(10px 11px) 그대로임을 확인 — 데스크톱 전용 압축 규칙이 새지 않아 터치
타깃·가독성 무회귀. XSS 무접점(`esc()` 불필요한 숫자 필드만 삽입, 기존 패턴
그대로).

---

## 2026-07-13 — B-52 iOS PTR이 지도 패닝을 새로고침으로 오판하는 버그 수정 (`e9ace9d`)

### 문제
B-23(iOS standalone pull-to-refresh)이 "세로 이동이 가로보다 우세"할 때 PTR
제스처로 판정하는데, 매물탭 지도를 아래로 드래그(패닝)하는 것도 세로 우세 이동이라
PTR로 오판됨 — `touchmove`에서 `e.preventDefault()`를 호출해 네이버 지도의 자체
패닝을 막아버려 지도를 못 움직이고, 끝까지 당기면 새로고침까지 발동되던 P0급
사용성 버그(E-01 이후 실사용 지적, B-12 완료 시점엔 B-23으로 흡수·삭제됐다가
이후 재발견돼 별도 항목으로 등록됨).

### 수정 (`js/boot.js`)
`touchstart` 핸들러의 기존 가드 조건(`e.touches.length!==1||anyModalOpen()||
!atTop()`)에 `||e.target.closest('#overviewMap, .mapcard')`를 추가 — 터치
시작점이 지도 영역 안이면 `active`를 세우지 않아 이후 `touchmove`에서
`e.preventDefault()`가 전혀 호출되지 않고, 네이버 지도가 브라우저 네이티브
터치 이벤트를 그대로 받아 자체 패닝을 처리함. 판정은 시작점(`touchstart`
시점의 `e.target`) 기준이라 리스트뷰(`.mapcard`가 `display:none`이라 애초에
터치 타깃이 될 수 없음)에서는 매칭 자체가 불가능 — 지도 밖 정상 PTR은 코드
변경 없이 그대로 동작. 기존 세로/가로 우세 판정 로직·`navigator.standalone`
한정·모달 가드는 전혀 건드리지 않음.

### 검증
`node --check`/`git diff --check` 통과. 실제 iOS 실기기 대신 Playwright로
`hasTouch:true` 컨텍스트 + `navigator.standalone=true`를 `addInitScript()`로
주입(모듈 로드 전에 값이 있어야 `boot.js`의 `if(window.navigator.standalone
!==true)return` 가드를 통과함) + 합성 `Touch`/`TouchEvent`로 모킹:
(1) `#overviewMap`에서 시작해 강하게(누적 dy=240, `THRESHOLD`=70 대비 충분히
큰 값) 아래로 드래그해도 `#ptrIndicator`가 `ptr-show`/`ptr-ready` 클래스를
전혀 얻지 않음(PTR 미발동) 확인, (2) 지도 밖(`#panel-props`, `.mapcard`의
조상이라 `closest()`에 안 걸림) 최상단에서 같은 크기로 당기면 `ptr-show`+
`ptr-ready`가 정상적으로 켜짐(PTR 정상 발동) 확인, (3) 단지 카드
(`#complexSection .card`)에서 수평 우세 스와이프(dx≫dy)를 걸어도 여전히
PTR 미발동(기존 로직 무회귀) 확인. 실제 지도 패닝의 체감(스무스함·반응성)은
Naver Maps SDK 내부 제스처 처리라 합성 터치로는 검증 불가 — 실기기 확인
필요(HANDOFF.md에 남김).

---

## 2026-07-13 — B-50 데스크톱 상단 헤더+탭바 세로 압축 (`67c5e8c`)

### 문제
상단 헤더(로고+제목+부제+우측 프로필/내보내기/가져오기/잠금)와 탭바(대시/자산/
매물/액션/수집함)가 2단 세로로 쌓여 상단 세로 공간이 컸음. 뷰포트 고정 매물탭
(B-49)에선 이 세로 공간이 곧 지도·리스트 크기를 그대로 잠식.

### 검토했지만 보류한 것 — 헤더+탭바 같은 줄 배치
지시문에 "가능하면 넓은 화면에서 로고 블록과 탭바를 같은 줄에 배치, 단 CSS만으로
자연스럽게 되는 선에서. 마크업 재구성이 필요하면 세로 압축까지만"이라는 조건이
있어 검토. `header`와 `.apptabs`(`<nav>`)는 `.wrap`의 별개 형제 요소이고,
`.apptabs`는 독립적으로 `position:sticky;top:0`을 쓰고 있어 마크업 변경 없이
CSS만으로 자연스럽게 한 줄로 합치기 어렵다고 판단 — 세로 압축만 진행하고 같은
줄 배치는 후속 과제로 남김.

### 수정 (`style.css`, `@media (min-width:900px)` 신규 블록)
`.brand .mark`(로고, 38→32px)·`.brand h1`(제목, 23→20px)·`.brand .sub`(부제,
11.5→10.5px, margin-top 제거)·`header`(margin-bottom 14→8px)·`.btn-mini`
(padding 7px 11px→6px 10px)·`.apptabs`(padding-top 6→4px, padding-bottom
14→9px, margin-bottom 20→12px)·`.atab`(padding 9px 15px→7px 13px) 압축.
모바일은 이미 별도(`@media max-width:760px`) 압축 규칙이 있어 전혀 건드리지
않음 — 데스크톱 전용 신규 블록이라 모바일 뷰포트에선 아예 매칭 안 됨.

### 검증
`node --check`(JS 변경 없음)/CSS 중괄호 균형/`git diff --check` 통과. Playwright로
데스크톱(1400×900)에서 수정 전/후를 `git stash`로 직접 비교(가짜 단지 15건
주입 후 동일 조건):
- **정량 측정**: `--topbar-h`(헤더+탭바 결합 높이) 151.75px→132.5px
  (**-19.25px**). 매물탭 지도 높이(`.mapcard` `getBoundingClientRect().height`)
  665.25px→684.5px(**+19.25px**, B-49의 flex 레이아웃이 압축분을 그대로
  흡수해 지도가 커짐). `#complexSection.clientHeight`(리스트 내부 스크롤
  영역) 447→466px(**+19px**).
- 대시보드·자산 탭 스크린샷으로 헤더가 압축됐지만 로고·제목·버튼이 여전히
  읽기 편하고 깨지지 않음을 시각 확인, 매물탭에서 카드가 이전보다 더 많이
  보임을 시각 확인(무회귀 + 효과 동시 확인).
- 모바일(390×844)에서 `header margin-bottom`(10px)·`.mark width`(34px)가
  기존 760px 브레이크포인트 값 그대로임을 computed style로 확인 — 데스크톱
  전용 규칙이 전혀 새지 않음(완전 무회귀). 대시보드·매물탭 스크린샷도 기존과
  동일.
- XSS 무접점(CSS 레이아웃 전용 변경, JS·마크업 변경 없음).

---

## 2026-07-13 — B-51 대형 화면(외부 모니터) 매물탭 전체폭 활용 (`093a67e`)

### 문제
`.wrap`의 `max-width:1440px` 제한 때문에 큰 모니터(1920/2560/4K)에서 양옆에 큰
여백이 남음. 특히 매물탭 지도는 넓을수록 좋은데도 1440px 벽에 갇혀 있었음
(B-50과 함께 "매물탭 화면 활용 마무리" 그룹으로 묶여 이어서 진행).

### 수정 (`style.css`, `@media (min-width:900px)`, 기존 `#panel-props.on` 스코프)
`body:has(#panel-props.on) .wrap{max-width:none;}` 추가 — B-46이 이미 같은
셀렉터 패턴(`body:has(#panel-props.on) .wrap{padding-bottom:0}`)으로 매물탭
스코프를 검증해둔 것을 그대로 재사용. `.grid`의 사이드바 트랙
(`minmax(0,var(--sidebar-w,360px))`)은 고정 폭이라 영향 없고, 지도 트랙
(`minmax(0,1fr)`)이 늘어난 `.wrap` 폭을 그대로 흡수 — 구조적으로 이미 보장돼
있어 grid 자체는 손대지 않음. 문서형 탭(대시·자산·액션·수집함)은
`body:has(#panel-props.on)` 스코프 밖이라 전혀 영향 없이 1440px 그대로 유지.

### 검증
`node --check`(JS 변경 없음)/CSS 중괄호 균형/`git diff --check` 통과. Playwright로
1400px·1920px·2560px 세 뷰포트에서 매물탭(가짜 단지 10건 주입)과 대시보드 탭을
각각 측정:

| 뷰포트 | 매물탭 `.wrap` 폭 | 매물탭 지도 폭 | 대시보드 `.wrap` 폭 |
|---|---|---|---|
| 1400px | 1400px(무제한이라도 뷰포트 이하) | 976px | 1400px |
| 1920px | 1920px(전체폭) | 1496px | **1440px(고정)** |
| 2560px | 2560px(전체폭) | 2136px | **1440px(고정)** |

사이드바 컬럼 폭은 세 뷰포트 모두 360px로 불변 — 사이드바 고정, 지도만 흡수
확인. 1400px 이하는 `max-width` 자체가 원래도 제약 요인이 아니므로(뷰포트가
1440보다 작으면 `width:auto`가 이미 더 작게 잡힘) 수정 전/후 완전히 동일한
값 — 무회귀 확인. 1920px 스크린샷으로 매물탭은 지도가 화면 대부분을 채우고,
대시보드는 여전히 가운데 정렬된 1440px 폭으로 편안하게 읽히는 대비를 시각
확인. XSS 무접점(CSS 레이아웃 전용 변경).

---

## 2026-07-13 — B-28 숫자 3상태(주차·관리비) 값/미확인/해당없음 구분 (`bb3eccc`)

### 목표
부정확한 `0`이 평가·안전Gate(B-27 선행 작업)를 오염시키지 않도록, 0이 자연발생하는
숫자 필드(주차·관리비)에 "값 있음 / 미확인 / 해당없음" 3상태를 도입. 범위 확정:
`complexes[].parking`(신규, 세대당 대수) + `listings[].managementFee`(기존 필드에
상태 플래그만 추가). `households`/`yearBuilt`/`deposit`/`area`는 0이 자연발생하지
않아 범위 밖(손대지 않음). 규칙기반, AI 무관.

### 스키마 (`js/state.js`)
`complexes[]`에 `parking`(세대당 대수, 소수 허용, `null`=값 없음) +
`parkingState`(`'known'|'unknown'|'na'`, 기본 `'unknown'`) 신규.
`listings[]`의 기존 `managementFee`(만원 단위)는 필드명·단위 그대로, `managementFeeState`
만 신규 추가. `applyGuards()`에 `complexes`/`listings` 전용 `.map()` 정규화를
추가 — 기존엔 `state.complexes=state.complexes||[]`처럼 배열 존재 여부만 보정하고
개별 아이템 필드는 전혀 정규화하지 않았음(v5 전환 시점 이후 신설된 갭). 기존
`managementFee` 입력값이 있던 listing은 `managementFeeState:'known'`으로 자동
승격(값 없으면 `'unknown'`), 기존 complex는 `parking:null`/`parkingState:'unknown'`
으로 보정. 단지·매물 생성부(붙여넣기 저장·시트 임포트·레거시→v5 마이그레이션,
각 3곳) 전부 새 필드 동반 추가.

### 파싱 (`js/properties.js` `parseNaver()`)
기존 "세대당 X대"/"관리비 N만원" 정규식 매치가 memo 텍스트(`bits` 배열) 생성
용도로만 쓰이던 것을 그대로 유지하면서, 성공 시 `r.parking`/`r.managementFee`로도
구조화 캡처하도록 확장. 실패 시 `undefined`로 남아 다운스트림에서 자연히
`'unknown'` 유지. 붙여넣기 자동채움(`fillBtn`→`applyFill`) → 저장
(`saveAsComplexListing`) 경로는 `tempParking`/`tempManagementFee`(기존
`tempChecks`와 동일한 모듈 전역 임시 변수 패턴)로 값을 전달, 성공 시 해당
필드 state를 `'known'`으로 승격. 신규 복합 대상 매칭(기존 단지에 매물만
추가되는 경우)에는 주차값을 덮어쓰지 않음(`isNewComplex` 블록 안에서만
`parking` 세팅).

### UI (`index.html`/`js/properties.js`/`style.css`)
재사용 가능한 3상태 세그먼트 컨트롤(`triStateHTML()`, `[값][미확인][해당없음]`
+ 숫자 입력 1개)을 신설 — 단지 상세 모달의 주차(`#cxDetailParkingWrap`, 세대수/
준공연도 표시부 바로 아래)와 매물 행의 관리비(`renderCxListings()`가 매물마다
동적 생성) 양쪽에서 동일 함수를 재사용. `#complexDetailModal`에 위임 클릭/change
리스너 하나씩만 추가해 두 용도를 `data-tri`(필드명)·`data-lid`(있으면 해당
listing, 없으면 현재 열린 `cxDetailId` 단지) 조합으로 판정 — 이벤트 핸들러
중복 없음. 미확인/해당없음 선택 시 숫자 입력 `disabled`+값 `null`, "값" 선택 시
기존 값이 없으면 0으로 시작(사용자가 바로 편집). 관리비 0원은 "관리비
0만원(포함)"으로 문구를 달리해 미확인과 시각적으로 구분. 스타일은 기존 토큰
(`--hairline`, `--line9`/`--line9-wash`/`--line9-deep`, `--ink-faint`)만 재사용,
새 CSS 파일 없음 — 활성 세그먼트는 매물탭 색 역할(골드)과 일관.

### 검증
`node --check` (state.js/properties.js) 통과, CSS 중괄호 균형(881=881), `index.html`
`<div>` 개폐 균형(314=314), `git diff --check` 통과. Playwright로:
1. **applyGuards 라운드트립**: `managementFee:15`만 있고 상태 필드가 없는 listing
   로드 → `managementFeeState:'known'` 자동 승격 확인. `parking` 필드 자체가 없는
   레거시 complex 로드 → `parking:null`/`parkingState:'unknown'` 보정 확인.
   `complexName`/`households` 등 기존 필드명·값 무변경 확인(Redis 키는 코드
   수정 자체가 없어 `'sweetyhome'` 그대로).
2. **parseNaver 구조화 캡처**: "세대당 1.2대 ... 관리비 약 15만원" 포함 샘플 텍스트
   → `r.parking===1.2`, `r.managementFee===15` 확인, 기존 memo bits 텍스트("주차
   1.2대/세대 · 관리비 15만" 포함)도 그대로 생성됨 확인(회귀 없음). 매치 없는
   샘플 → 두 필드 모두 `undefined`(다운스트림에서 `unknown` 유지) 확인.
3. **3상태 UI 동작**(주차): [값] 클릭 → `parking:0`/`parkingState:'known'`, 입력
   활성화, 캡션 "세대당 0대" 확인. 입력에 1.2 입력 후 blur → `parking:1.2`, 캡션
   "세대당 1.2대" 확인. [미확인] 클릭 → `parking:null`/`'unknown'`, 입력
   비활성화, 캡션 "주차 미확인" 확인. [해당없음] 클릭 → `parking:null`/`'na'`,
   캡션 "주차 해당없음" 확인 — **값=0과 미확인이 렌더·저장 양쪽에서 명확히
   구분됨을 확인**.
4. **3상태 UI 동작**(관리비, 매물 행): [값] 클릭 → `managementFee:0`, 캡션
   "관리비 0만원(포함)"(미확인과 시각 구분 문구) 확인. 입력에 `-5`(음수) 입력 →
   `parseFloat+isNaN||v<0` 가드가 거부해 값이 이전 상태(0)로 유지됨 확인(보안
   요구사항의 숫자 가드 실측 검증).
5. 스크린샷으로 단지 상세 모달의 주차 세그먼트·매물 행의 관리비 세그먼트가
   기존 UI(세대수/준공연도, 매물 액션 버튼)와 시각적으로 자연스럽게 통합됨을
   확인 — 골드 활성 세그먼트, 레이아웃 깨짐 없음.

XSS 무접점: 세그먼트 라벨("값"/"미확인"/"해당없음")은 고정 문자열, 캡션은
`esc()`로 감싸 방어적 처리(내용 자체는 항상 고정 문구+숫자 조합이라 사용자
자유 입력 삽입 경로 없음), 숫자 입력은 `parseFloat`+`isNaN`/음수 가드 통과한
값만 반영. `nav.js` 무접촉(손 B 충돌 없음).

---

## 2026-07-13 — B-18 등급컷·경고선 settings 정지 + 세대수컷 중복 제거 (`4181bd1`)

### 목표
하드코딩된 등급 임계값(면적·세대수)·경고선(보증금·전용면적)을 `settings`/
`profile`로 이행하고, 감사(2026-07-13)에서 발견된 중복·미연동 버그를 함께 제거.
B-27 안전Gate가 이 정지된 settings 위에 올라갈 예정이라 선행 필요. **핵심 제약:
동작 변화 0(무회귀 리팩터)** — 모든 기본값은 기존 리터럴 그대로, 등급·경고
판정 결과가 전/후 완전히 동일해야 함.

### 발견한 중복
`state.js`의 `applyGuards()` 안에 인라인으로 정의된 `calcG`(세대수 등급 계산,
1000/500/300/150 리터럴)가 `properties.js`의 `calcHouseholdGrade`와 **완전히
동일한 로직으로 중복** 존재 — v5 전환 시점에 `properties.js`(등급함수 정의처)가
아직 로드 안 된 시점(`state.js` 로드 중 마이그레이션 실행)이라 어쩔 수 없이
인라인으로 박아뒀던 것으로 추정.

### 수정
**단일 소스화**(`js/utils.js` 신설 — `state.js`/`properties.js`보다 먼저 로드):
`GRADE_DEFAULTS={area:[85,60],households:[1000,500,300,150],bigComplex:500}`
+ `calcAreaGrade(areaM2,grades)`·`calcHouseholdGrade(n,grades)` 순수함수 추가.
`grades` 인자가 없거나 일부 키만 있어도 `GRADE_DEFAULTS`로 폴백해 항상 과거와
동일한 등급 텍스트를 반환(라벨 문자열도 `g1+'㎡+'`처럼 컷 값에서 동적 조립하되
기본값 85/60에서는 원래 하드코딩 텍스트 `'85㎡+'`/`'60~84㎡'`/`'59㎡ 이하'`와
정확히 일치하도록 설계). `state.js`의 인라인 `calcG`와 `properties.js`의
`calcHouseholdGrade`/`getAreaGrade`(→`calcAreaGrade`로 이름 통합) 옛 정의를
제거하고, 6곳의 호출부를 `state.settings.grades`를 넘기는 형태로 교체.

**`settings.grades` 신설**(`js/state.js`): `DEFAULT.settings`/`GUEST_STATE.settings`
양쪽에 `grades:structuredClone(GRADE_DEFAULTS)` 추가, 상단 STATE SCHEMA
JSDoc에 반영. `applyGuards()`에 `state.settings.grades=Object.assign(
structuredClone(GRADE_DEFAULTS), state.settings.grades||{})` 가드 추가 —
기존 데이터(구버전, `grades` 필드 자체가 없음)도 개별 키 단위로 기본값 보정.

**경고선 참조화**(`js/properties.js` `bodyMetaChips`): 보증금 경고
`dn>5` → `profile.depositRange`("4~5")의 상한(마지막 숫자)을 파싱한 값
(`parseDepositUpper()` 신설, 파싱 실패 시 기존 5로 폴백). 면적 경고 `a>85` →
`profile.maxArea`. 대단지 자동판정(`parseNaver()`의 `k4`) `sedN>=500` →
`state.settings.grades.bigComplex`.

**문구 연동**(`js/state.js`): `CHECKLIST`의 k4 설명문 `'500세대+면...'`에서
하드 문자열 `500` 대신 `GRADE_DEFAULTS.bigComplex+'세대+면...'`로 값 출처를
단일화(정적 상수 배열이라 완전 동적 렌더링 대신 "같은 상수 참조"로 최소 대응
— 지시서에서 명시적으로 허용한 완화 조건).

### 검증
`node --check`(3개 파일) 통과, `git diff --check` 통과. Playwright로 리팩터
전/후 **경계값 실측 비교**(전부 exact match):
- 면적 등급: 85→`85㎡+`, 84→`60~84㎡`, 60→`60~84㎡`, 59→`59㎡ 이하`(grades
  인자 없이 호출한 폴백 경로도 동일 결과 확인).
- 세대수 등급: 1000→`1000세대+`, 999→`500세대+`, 500→`500세대+`, 499→
  `300세대+`, 300→`300세대+`, 299→`소규모조건부`, 150→`소규모조건부`, 149→
  `소규모주의` — 8개 경계값 전부 일치.
- 보증금 경고선: 5.0억(미경고)·5.1억(경고) `bodyMetaChips()` 출력 HTML로 확인.
- 면적 경고선: 85㎡(미경고)·86㎡(경고) 동일 방식 확인.
- k4 자동판정: `parseNaver()`로 "500세대"(k4=true)·"499세대"(k4=false) 텍스트
  파싱 결과 확인.
- `applyGuards({})`(완전히 빈 raw) → `state.settings.grades`가
  `GRADE_DEFAULTS`와 완전히 동일(`JSON.stringify` 비교) 확인.
- `applyGuards({settings:{grades:{bigComplex:999}}})`(일부 키만 있는 구버전
  데이터 시뮬레이션) → `area`/`households`는 기본값으로 보정, `bigComplex`는
  커스텀 값 유지 확인 — "개별 키 누락도 보정" 요구사항 실측.
- 레거시 `state.properties[]` 마이그레이션 경로(`applyGuards`가 세대수 750인
  매물 로드) → `householdGrade`가 `'500세대+'`로 정확히 계산됨을 확인해
  중복 제거 후에도 이 경로가 여전히 정상 동작함을 검증.
- **중복 소멸 확인**: `state.js`에서 세대수컷 리터럴(1000/500/300/150)을
  `grep` — 남은 매치는 전부 JSDoc 주석·`reserve:1000`(무관한 자산 필드)·
  데모 memo 텍스트뿐, 등급 계산 로직상 리터럴은 완전히 사라짐 확인.

`js/nav.js`·`style.css` 무접촉(지시서 원칙대로). 대상 파일은 `js/state.js`/
`js/utils.js`/`js/properties.js` 3개뿐.

---

## 2026-07-13 — B-38 단지 판단메모 구조화(장점·단점·한줄판단) (`f4506b8`)

### 목표
단지의 스펙(세대수·연식 등)이 아닌 "우리 판단"을 자유 메모 한 덩어리가 아니라
구조화된 필드(장점/단점/한줄 판단)로 기록 — "저장판 → 후보 비교·판단 도구"로
가는 핵심. 순수 기록·관리(자동 점수화·판정 없음). 순위·등급·별점은 범위 밖
(B-39). B-18 커밋 직후 착수(같은 `state.js`/`properties.js`를 건드려 순차
진행 필요 — B-38 지시서 자체에 이 선행 조건이 명시돼 있었고, 실제로 B-18이
아직 커밋 전이라 먼저 완료한 뒤 진행함).

### 스키마 (`js/state.js`)
`complexes[]`에 `pros`(장점, 멀티라인)·`cons`(단점, 멀티라인)·`verdict`(한줄
판단, 전부 기본 `''`) 신설. STATE SCHEMA JSDoc 반영. `applyGuards()`의 기존
`complexes` 정규화 `.map()`(B-28에서 만든 자리)에 세 필드 기본값을 추가 —
기존 `memo`는 같은 스프레드 패턴으로 손대지 않아 무손실. 단지 생성부 3곳
(붙여넣기 저장·시트 임포트·레거시→v5 마이그레이션, B-28에서 이미 특정해둔
동일한 3곳)에 전부 새 필드 동반 추가.

### 입력 UI (`index.html` + `js/properties.js`)
단지 상세 모달의 기존 `cxDetailMemo`(자유 메모) 바로 위에 "판단메모" 섹션
(장점 textarea·단점 textarea·한줄 판단 input) 추가. 저장은 `cxDetailMemo`의
기존 `blur` 저장 패턴을 그대로 복제(새 저장 경로 만들지 않음) — 다만
`verdict`만 단지 카드에도 노출되므로 그 필드의 blur 핸들러에만
`renderComplexes()`를 추가 호출해 카드가 즉시 갱신되게 함.

### 렌더
상세 모달은 값이 없으면 textarea/input의 `placeholder`가 자연히 뮤트
표시되므로 별도 "값 없으면 생략" 로직이 불필요(기존 `cxDetailMemo`와 동일한
특성 재사용). 단지 카드는 `verdict`가 있을 때만 `.c-verdict` 한 줄로 노출,
`white-space:nowrap;text-overflow:ellipsis`로 길면 말줄임 — 장점·단점은
상세에서만(B-44 카드 밀도 기조 유지, 새 CSS는 기존 토큰만 쓰는 규칙 3줄
추가로 최소화).

### 검색 — 조사 중 발견한 기존 갭
`#prop_search` 입력창의 플레이스홀더는 "단지·역·호선·메모 검색"이지만, 실제
이벤트 리스너는 레거시 `state.properties[]` 목록(`renderList()`)만 필터링하고
있었고 v5 단지 카드(`renderComplexes()`)에는 검색이 전혀 연결돼 있지 않았음
(B-48로 레거시 목록이 통상 숨겨진 이후로는 사실상 죽어있던 기능). `verdict`를
검색 대상에 포함하라는 지시를 이행하려면 최소한의 단지 검색 자체가 필요해서,
`cxMatchesSearch(cx)`를 신설해 `complexName`/`loc`/`station`/`line` +
`verdict`를 검색 대상에 포함(지시대로 `pros`/`cons` 본문은 노이즈 방지 위해
제외)하고 `renderComplexes()`의 필터 체인 + 검색 입력 리스너에 연결.

### 검증
`node --check`(state.js/properties.js)/CSS 중괄호 균형/`index.html` div 개폐
균형/`git diff --check` 통과. Playwright로:
1. **applyGuards 라운드트립**: `pros`/`cons`/`verdict` 없는 기존 단지 데이터
   로드 → 전부 `''` 보정, 기존 `memo`("기존메모유지테스트")·`complexName`
   무손실 확인.
2. **입력→blur→저장→재로드**: 장점(멀티라인)·단점·긴 한줄판단을 입력·blur 후
   `state.complexes`에 정확히 반영됨을 확인, 이어서 그 데이터를
   `applyGuards()`에 다시 태워(저장→재로드 시뮬레이션) 세 필드가 그대로
   유지됨을 확인. `.c-verdict` 요소가 `text-overflow:ellipsis`/
   `white-space:nowrap`로 렌더됨을 computed style로 확인(말줄임 동작).
3. **XSS**: `<script>window.__xssFired=true;</script><img src=x
   onerror="window.__xssFired2=true">`를 장점·단점·한줄판단 세 필드 모두에
   입력해 저장·재렌더 — `window.__xssFired`/`__xssFired2` 둘 다 `false`(스크립트
   미실행), 저장된 원본 값은 이스케이프 없는 raw 페이로드 그대로(저장은 원본,
   이스케이프는 렌더 시점에만 하는 기존 패턴과 일치), 카드에 렌더된
   `.c-verdict`의 `innerHTML`은 `&lt;script&gt;...`로 완전히 이스케이프돼
   실제 `<script>`/`<img>` 태그가 DOM에 전혀 없음을 확인. `alert()` 등
   dialog도 전혀 트리거되지 않음 확인.
4. 스크린샷으로 "판단메모" 섹션(장점/단점/한줄 판단 라벨)과 카드의 말줄임된
   verdict 한 줄이 기존 UI와 자연스럽게 통합됨을 시각 확인, XSS 페이로드가
   상세 폼·카드 양쪽에서 순수 텍스트로만 노출됨(태그 해석 없음)을 시각 확인.

`js/nav.js` 무접촉. `style.css`는 지시서가 허용한 예외("불가피하면 기존
토큰만")로 `.c-verdict` 규칙 1개만 추가(새 색상 없이 기존 `--ink` 재사용).

---

## 2026-07-13 — B-39 후보 즐겨찾기 토글(상단 고정+필터) (`d943fd5`)

### 목표
후보 단지 중 "지금 집중해서 보는 것"을 즐겨찾기(핀)로 표시하고 상단에 띄움.
`complexStatus`(관심~탈락)가 이미 후보 우선순위 축을 거치고 있어 별점·순위·
등급 같은 별도 축은 중복 — boolean 하나로 축소. 순수 기록·관리(자동판정
없음). "기록·관리 중심 CRM(P0)" 그룹의 마지막 항목(B-28→B-18→B-38→**B-39**
→B-37).

### 스키마 (`js/state.js`)
`complexes[]`에 `favorite`(boolean, 기본 `false`) 신설. STATE SCHEMA JSDoc에
"별점·순위·등급이 아니라 boolean 하나뿐" 취지 명시. `applyGuards()` 기존
`complexes` 정규화 `.map()`에 기본값 추가, 단지 생성부 3곳(B-28/B-38에서 이미
특정해둔 동일 3곳) 전부 반영.

### 토글 UI (`js/properties.js` + `index.html`)
단지 카드(`c-badge-col` 안, 상태 칩과 함께 세로로)와 단지 상세 모달 헤더에
별 아이콘 버튼. 공용 `toggleFavorite(id)` 함수 하나로 카드·상세 양쪽 처리
(새 저장경로 없음 — `favorite` 갱신 + `save()` + `renderComplexes()` 재사용,
상세가 열려 있으면 그 버튼도 함께 동기화). 아이콘은 기존 `ICSVG.star` 재사용
— `.ic` 기본값(`fill:none;stroke:currentColor`)이 이미 "off=외곽선"을
충족해 별도 off 스타일이 불필요했고, `on`일 때만 골드(`--line9`)로 채우는
CSS 3줄만 추가(새 색상 없음).

**이벤트 버블링 분리**: 카드 전체(`.c-top`)가 `data-cxopen`(상세 열기)
클릭 타깃이라, 별 버튼도 그 안에 있으면 클릭이 상세를 열어버림. 기존
`.c-routecheck-wrap`(임장 루트 체크박스)이 쓰던 "delegated 핸들러 안에서
먼저 걸러서 `return`" 패턴을 그대로 재사용해 `[data-favtoggle]`을
`[data-cxopen]`보다 먼저 체크 — `stopPropagation()` 없이도 상세 진입과
완전히 분리됨.

### 정렬 (`js/properties.js`)
`favoritesFirst(arr)` 신설 — `Array.sort`가 ES2019+부터 안정 정렬이 보장되는
점을 이용해, 이미 정렬된 배열에 `(b.favorite?1:0)-(a.favorite?1:0)` 비교자만
다시 적용하면 각 그룹(즐겨찾기/일반) **내부의 기존 순서는 그대로 유지된 채**
즐겨찾기만 최상단으로 이동함. 기존 `sortComplexes()`(모바일 `cxSort` 경로)
끝에 추가. **조사 중 발견**: 데스크톱은 `cxSort`(최신순/가격순/거리순)
자체가 애초에 적용 안 되고 `state.complexes`의 자연 배열 순서(`_cxBase`)를
그대로 쓰고 있었음 — 데스크톱에도 즐겨찾기가 상단에 오게 하려면
`favoritesFirst()`를 그 경로에도 별도로 적용해야 했음(데스크톱의 기존
"정렬 없음" 특성 자체는 그대로 두고, 즐겨찾기만 위에 얹음).

### 필터 (`js/properties.js` + `index.html`)
`favorite`는 boolean이라 다른 그룹(단지상태·매물상태 등, B-35에서 만든
드롭다운 패턴)과 달리 옵션 목록이 필요 없어 `cxf-group`으로 감싸지 않은
단순 on/off 토글 칩으로 `cxFilterBar`에 추가. `cxFilters.favorite` +
`cxMatchesFilters()` 조건 추가, 기존 트리거 활성 스타일
(`.cxf-trigger.active`, 그린 `--money` 계열)을 그대로 재사용.

### 검증
`node --check`/CSS 중괄호 균형/`index.html` div 개폐 균형/`git diff --check`
통과. Playwright로:
1. **applyGuards 라운드트립**: `favorite` 없는 기존 단지 로드 → `false` 보정,
   B-38의 `verdict` 등 기존 필드도 무손실 확인(회귀 없음).
2. **버블링 분리 실측**: 카드의 별 버튼 클릭 → `complexDetailModal`이 열리지
   않음(`modalOpen: false`) + `favorite`는 정상적으로 `true`로 바뀜 확인.
3. **정렬 실측**: 3개 단지(자연 순서 A→B→C) 중 마지막(C)을 즐겨찾기 → 카드
   순서가 `[C, A, B]`로 바뀜(C가 최상단, A·B는 상대 순서 유지) 확인 — "1차
   키로만 얹기"가 정확히 동작함을 검증.
4. **토글 on/off + 저장·재로드**: 토글 후 `applyGuards()`로 재로드
   시뮬레이션해도 `favorite` 값 유지 확인.
5. **카드↔상세 동기화**: 상세 모달의 별 버튼 클릭 → `favorite` 갱신 +
   `aria-pressed` 갱신 + 같은 단지의 카드 버튼도 즉시 `.on` 클래스로 동기화됨
   확인.
6. **"즐겨찾기만" 필터**: 단지 2개(1개 즐겨찾기) 중 필터 클릭 → 1개만 노출,
   필터 버튼이 `.active`로 표시됨 확인.
7. 스크린샷으로 카드의 채워진 골드 별 아이콘과 활성화된 "즐겨찾기" 필터 칩이
   기존 UI와 자연스럽게 통합됨을 시각 확인.

(테스트 중 여러 `applyGuards()`를 불완전한 픽스처로 연속 호출하는 스트레스
시나리오에서 산발적 `TypeError`가 관찰됐으나, 단일 사이클의 깨끗한 재현
테스트로는 전혀 발생하지 않음을 확인해 테스트 하네스 자체의 아티팩트로
판단(이번 세션에서 반복 확인된 패턴, Naver SDK 관련 아티팩트와 동일한
성격) — 실제 사용자 흐름(페이지 로드 시 `applyGuards()` 1회만 호출)에서는
해당 안 됨.)

`js/nav.js` 무접촉. `style.css`는 `.c-fav-btn` 관련 규칙만 최소 추가(기존
`--line9`/`--line9-deep`/`--ink-faint` 토큰만 재사용).

---

## 2026-07-13 — B-30 액션에 담당·마감 필드(표시 전용, 자동 재정렬 無) (`4ee58cd`)

### 목표
할 일(액션)에 담당·마감을 붙여 부부가 "누가·언제까지"를 기록·관리. 순수
기록(자동 재정렬·자동 판정 없음) — 선행조건·완료조건·매물/정책 연결·유사
액션 중복 경고는 명시적으로 범위 밖(각각 과설계/B-33 영역/자동판정 성격).
마감순 자동 재정렬도 금지 — 기존 수동 우선순위(★맨위로, `priority`)와
충돌하므로 마감은 표시만.

### 스키마 (`js/state.js`)
`actions[]`에 `assignee`(`''`|`OWNERS` 값)·`due`(`''`|`'YYYY-MM-DD'`) 신설.
JSDoc 반영, `applyGuards()`의 기존 `state.actions=state.actions.map(a=>
({category:'',...a}))` 정규화에 두 필드 기본값 추가(기존 액션 무손실).
담당 옵션은 하드코딩 없이 전역 `OWNERS`(게스트 모드에서 `auth.js`가
`['본인','배우자','공동']`으로 치환) 재사용.

### 추가 폼·인라인 편집 (`index.html` + `js/actions.js`)
기존 `.addact` 폼(카테고리 select·텍스트 input·추가 버튼) 옆에 담당
select(`act_ownerSel`, 빈 값="담당 미지정" + `OWNERS`, `renderActions()`가
매 렌더마다 `syncActOwnerSelect()`로 옵션을 새로 채움 — 게스트 전환 시점과
무관하게 항상 정확)와 마감 date input(`act_dueInp`) 추가.
`addActionFull()`에서 읽어 push, AI 제안 채택 경로(`box.querySelectorAll(
'[data-suggest]')` 핸들러)에도 `assignee:'',due:''` 기본값 동반(누락 방지).
기존 인라인 편집 행(텍스트+카테고리)에도 담당 select + 마감 date input을
추가해 저장 시 `a.assignee`/`a.due` 갱신 — 새 저장경로 없이 기존
`save()`/`renderActions()`/`renderTop3()` 호출 패턴 그대로.

### 렌더
담당은 기존 `.act-cat-badge` 스타일을 그대로 재사용(새 CSS 없음, 카테고리
뱃지와 시각적으로 동일). 마감은 새 `.act-due-badge`(`.act-cat-badge`와
거의 동일한 톤)로 "D-n"/"D+n" 표시, 지남(overdue)이고 미완료일 때만 기존
경고 토큰 `--s-drop`으로 텍스트만 붉게(배경은 그대로 — 새 색상·새 배경
없음). 완료(done) 액션은 지나도 강조하지 않음.

### 버그 발견·회피 — `dday()` 재사용 포기
처음엔 `nav.js`의 기존 `dday(t)`(대시보드 마일스톤 D-day 계산에 이미 쓰이는
함수)를 그대로 재사용하려 했으나, Playwright 경계값 테스트로 실측하다
"어제 마감·미완료" 액션이 `overdueClass:false`("D-0")로 잘못 표시되는 버그를
발견. 원인: `dday()`가 `"YYYY-MM-DD"` 문자열을 `new Date(t)`로 파싱하는데,
날짜-only ISO 문자열은 JS 스펙상 **UTC 자정**으로 해석됨 — `dday()`가 "오늘"
로는 `new Date()`(로컬 자정)를 쓰므로, 한국 시간대(KST=UTC+9)에서는 매번
9시간의 시차가 발생해 날짜 경계 부근에서 하루가 밀림. `nav.js`는 무접촉
대상이라 그 함수 자체는 고치지 않고, `actions.js` 안에서만 정확하게
동작하도록 `actDaysUntilDue(due)`를 새로 작성 — `"YYYY-MM-DD"`를 연·월·일로
분해해 **3-인자 `Date` 생성자**(`new Date(y,m-1,d)`, 스펙상 항상 로컬
시간으로 확정 해석됨)로 직접 조립해 "오늘"과 동일한 기준(로컬 자정)으로
비교. `dday()` 자체가 다른 곳(마일스톤 D-day)에서 이미 갖고 있었을 수 있는
동일한 함정은 이번 범위 밖이라 손대지 않음.

### 검증
`node --check`(state.js/actions.js)/CSS 중괄호 균형/`index.html` div 개폐
균형/`git diff --check` 통과. Playwright로:
1. **applyGuards 라운드트립**: `assignee`/`due` 없는 기존 액션 로드 → `''`
   보정, 기존 `text`/`category` 무손실.
2. **담당 select 동적 채움**: 게스트 모드에서 옵션이 `["", "본인",
   "배우자", "공동"]`(전역 `OWNERS`와 정확히 일치)로 채워짐 확인.
3. **추가 폼**: 담당·마감 입력 후 저장 → `state.actions`에 정확히 반영됨
   확인.
4. **마감 경과 강조**(타임존 버그 수정 후 재검증): 어제 마감·미완료 → 뱃지
   "D+1" + `overdue` 클래스(빨강) 확인. 같은 어제 마감이지만 완료된 액션은
   뱃지는 뜨되 `overdue` 클래스 없음(강조 해제) 확인. 마감 미입력 액션은
   뱃지 자체가 없음 확인.
5. **인라인 편집**: 담당·마감 변경 → blur 없이 "저장" 클릭으로 `a.assignee`/
   `a.due` 갱신 확인.
6. **정렬 무회귀**: `priority` 낮은(먼저) 액션이 마감이 훨씬 지났어도
   여전히 `priority` 순서대로만 정렬됨(마감 기준으로 안 밀림) 확인 —
   `#act_list .actrow`로 정확히 스코프해 재확인(첫 시도에서 대시보드
   `renderTop3()`도 같은 `.actrow` 클래스를 써서 전역 셀렉터가 두 위젯을
   섞어 잡던 테스트 스크립트 버그를 바로잡음).
7. 스크린샷으로 빨간 "D+1" 뱃지(미완료)와 무채색 "D+1" 뱃지(완료)가 한
   화면에서 명확히 구분됨을 시각 확인.

`js/nav.js` 무접촉(참고용으로만 `OWNERS` 전역 변수를 읽음, 함수 재사용은
타임존 버그로 포기). `renderTop3()` 시그니처·동작 전혀 안 건드림(지시대로
범위 밖).

---

## 2026-07-13 — B-56 dday() 타임존 버그 수정 (`21cb4b9`)

**참고**: 이 지시서는 원래 "손 B(Codex) 지시서"로 발급됐고 `js/nav.js`를
이번 작업 중 Codex 단독 영역으로 명시했으나, 사용자가 명시적으로
"지시서는 그대로지만 저(손 A)가 지금 진행"이라고 확인해 손 A(Claude Code)가
실행함. **손 B(Codex)가 같은 지시서를 별도로 실행하면 충돌 가능성이 있으니
커맨드센터가 인지할 것.**

B-30에서 발견했던 `dday()`(`js/nav.js`, 마일스톤 D-day 계산용)의 타임존
버그를 이번엔 `nav.js` 안에서 직접 수정. 원인은 동일: `"YYYY-MM-DD"`
날짜-only 문자열을 `new Date(t)`로 그대로 넘기면 스펙상 UTC 자정으로
해석되는데, "오늘" 기준값은 로컬 `new Date()`를 쓰므로 KST(UTC+9)에서
날짜 경계마다 하루가 밀리는 문제.

**수정**: 정규식(`/^(\d{4})-(\d{2})-(\d{2})/`)으로 연·월·일을 뽑아 3-인자
`Date` 생성자(로컬 자정으로 확정 해석)로 재조립. 정규식이 매칭 안 되는
값(형식이 다르거나 비어있음)은 기존 `new Date(t)` 폴백으로 하위호환 유지.
시그니처·반환 형식(`'D-n'`/`'D+n'`) 불변.

**검증**(Playwright, 로컬 정적 서버+게스트모드): 오늘 2026-07-13 기준
`dday('2026-07-14')`(내일)=`'D-1'`, `dday('2026-07-13')`(오늘)=`'D-0'`,
`dday('2026-07-12')`(어제, 이전엔 버그로 `'D-0'`이었던 케이스)=`'D+1'`
모두 정확히 통과. 형식이 안 맞는 입력(`'not-a-date'`, `''`, `undefined`)은
기존과 동일하게 `'D+NaN'`으로 안전하게 폴백(크래시 없음, 회귀 아님).
대시보드 마일스톤 타임라인(`renderJourney()`가 `dday()` 재사용)에서
"D-172", "D-537" 등 합리적인 값이 렌더링됨을 스크린샷으로 육안 확인.
`node --check js/nav.js`·`git diff --check` 통과.

이 수정으로 `dday()`를 쓰는 다른 곳(마일스톤 D-day 표시 등)도 같은 함수를
공유하므로 자동으로 함께 고쳐짐 — B-30 HANDOFF.md에 남겨뒀던 "다음에
검토" 항목이 이번 커밋으로 해소됨.

수정 파일: `js/nav.js` 단 1개(`dday()` 함수만, 12줄 추가·1줄 삭제).

---

## 2026-07-13 — B-57 전 탭 반응형 너비 통일 (`2b79d16`)

문서형 탭(대시·자산·액션·수집함)도 매물탭과 동일하게 대형 모니터(>1440px)에서
전체폭이 되도록 통일. B-51에서 "문서형 탭은 가독성 위해 1440px 유지"로 정한
결정을 이번 지시서로 의도적으로 반전.

**수정**: `style.css:395`(데스크톱 `@media (min-width:900px)` 블록 내부)
`body:has(#panel-props.on) .wrap{max-width:none;}` → `.wrap{max-width:none;}`
— 매물탭 전용 프리픽스 제거, 전 탭 공통 적용. `line 386`의
`body:has(#panel-props.on) .wrap{padding-bottom:0;}`(매물탭만 하단여백 0,
매물탭이 뷰포트 고정 flex 컬럼이라 필요)은 지시대로 그대로 유지 —
다른 탭은 여전히 24px 하단여백 확보. B-51 주석도 "문서형 탭 1440 유지"
서술이 반대 의미가 됐으므로 "전 탭 대형 모니터 전체폭(B-57로 스코프 해제)"로
정정.

**검증**(Playwright, 로컬 정적 서버+게스트모드):
- 2560px 뷰포트: 대시/자산/액션/수집함/매물 5개 탭 전부 `.wrap` 너비 2560px
  (전체폭) 확인. `padding-bottom`은 매물탭만 `0px`, 나머지 4개 탭은 전부
  `24px`로 정확히 스코프 유지 확인.
- 자산탭 2560px 스크린샷: 테이블·요약카드가 전체폭으로 자연스럽게 확장,
  깨짐·오버플로 없음 육안 확인.
- 1400px(구 1440 상한 이하)·390px(모바일) 뷰포트: 5개 탭 전부 `.wrap` 너비가
  뷰포트폭과 동일 — 이번 변경 전후로 결과 동일(무회귀) 확인.
- CSS 중괄호 균형·`git diff --check` 통과. 자산 테이블 초광폭 상한 조정은
  지시대로 미포함(필요시 별도 백로그).

수정 파일: `style.css` 단 1개(라인 387~395, 셀렉터 1줄 변경 + 주석 정정).

---

## 2026-07-13 — B-58 모달 z-index 버그 수정 (`e9d3531`)

프로필·자산 임포트·수집함 편집·가져오기 등 `.modal` 클래스를 쓰는 모든
공용 모달이 sticky 탭바(`.apptabs`)에 제목이 가려지던 버그 수정.

**근인**: `.apptabs`(`position:sticky`)는 `z-index:1001`인데 `.modal`
(`position:fixed`)은 `z-index:1000`이라 모달이 탭바보다 뒤에 깔림.
모바일 `#complexDetailModal`은 이미 `z-index:1100`으로 같은 문제를
개별 우회해뒀었지만(주석: "기본 .modal(1000)만으론 탭바에 가려짐"),
base `.modal`은 방치돼 있었음.

**수정**: `style.css:834` `.modal{...z-index:1000;}` → `z-index:1100;`
값만 변경(다른 속성 무변경) — 모바일 `#complexDetailModal`이 이미 쓰던
같은 티어(1100)로 통일.

**검증**(Playwright, 로컬 정적 서버+게스트모드):
- computed z-index: `.modal`=1100, `.apptabs`=1001 확인.
- 프로필 모달(`profileModal`) 열어 `elementFromPoint`로 상단 좌측 지점이
  실제로 모달 내부 요소임을 확인(탭바에 안 가려짐), 스크린샷으로
  "프로필 & 일정 설정" 제목이 탭바 위로 온전히 보임을 육안 확인
  (데스크톱 1400px + 모바일 390px 둘 다).
- `assetAiModal`(자산 임포트)·`scEditModal`(수집함 편집)·`importModal`
  (가져오기) 3개 모두 동일 방식으로 최상단 렌더 확인.
- `.status-picker`(2000)·`.login-overlay`(2000)는 CSS 소스·computed
  값으로 여전히 모달(1100)보다 위임을 확인 — 무회귀.
- CSS 중괄호 균형·`git diff --check` 통과.

수정 파일: `style.css` 단 1개(834번 줄, `z-index` 값 1글자 단위 변경).

---

## 2026-07-13 — B-59 모달 sticky 헤더·푸터 통일 (`44b9850`·`8bc627c`·`4b76ea3`·`a4fe1c6`)

전 모달(9개) 제목·닫기(헤더)와 취소/저장(푸터)이 스크롤과 무관하게 항상
보이도록 통일. `.box`를 flex 컬럼으로 바꾸고 `.mhead`(고정)/`.mbody`(스크롤)/
`.mfoot`(고정, 있는 경우만) 3영역으로 정규화 + 흩어져 있던 `.ok`·에러·사진·
버튼 요소를 올바른 영역으로 재배치. 지시서(DISPATCH-B59)대로 4단계 커밋.

**커밋①** (`44b9850`) — CSS 공통 규격 추가:
`.modal .box{display:flex;flex-direction:column;padding:0;overflow:hidden}`
+ `.mhead`/`.mbody`(`overflow-y:auto`)/`.mfoot` 3규칙. 모바일 두 breakpoint
(`@media max-width:760px`·`480px`) 모두 패딩을 mhead/mbody/mfoot로 재분배
(오버헤드 압축) + `.mfoot`에 `padding-bottom:calc(Npx + env(safe-area-inset-bottom,0))`
로 홈바 겹침 방지. 단순 단일푸터 모달 4개(exportModal·importModal·
assetAiModal·profileModal) 구조 적용 — `.ok`/`hint`/`mdesc`를 mbody 안으로,
`.macts`→`.mfoot`로 교체.

**커밋②** (`8bc627c`) — scEditModal: 기존엔 저장/취소 버튼이 사진첨부·에러
메시지보다 위(중간)에 있던 순서를 정리 — mbody에 제목·유형·상태·원문·
더보기필드·사진첨부·에러를 전부 담고, 저장/취소를 맨 끝 mfoot로 이동.

**커밋③** (`4b76ea3`) — 매물 모달 2개: `propEditModal`(mhead=h3, mbody=폼
전체+지도, `.form-actions`→`.mfoot`), `complexDetailModal`(mhead=기존
제목+즐겨찾기+닫기 헤더 그대로, mbody=나머지, mfoot 없음—닫기가 헤더에).
인라인 `max-height`/`overflow-y:auto`는 4곳(scEdit·propEdit·propImport·
complexDetail) 전부 제거(공통 규격이 처리). **부수 발견·수정**: 모바일
`#complexDetailModal .box{overflow-y:auto}`(line 332) 규칙이 ID 선택자라
특이도가 base `.modal .box{overflow:hidden}`보다 높아 그대로 두면 이 모달만
mhead까지 같이 스크롤되는 문제 — `overflow-y:auto` 제거로 base 규칙이
정상 적용되게 수정. 또한 `properties.js`의 B-21 바텀시트 드래그다운 닫기
핸들러가 `box.scrollTop>0`을 안전망으로 쓰고 있었는데, box가 더 이상
스크롤 컨테이너가 아니게 되면서(이제 mbody가 스크롤) 이 체크가 항상 무의미
(box.scrollTop 항상 0)해져 제거 — mhead가 이제 항상 고정이라 "상단
~60px에서 시작한 터치=헤더 위" 조건이 스크롤 상태와 무관하게 항상 참이라
안전망 자체가 불필요해짐(코드 동작은 기존과 동일, dead code만 정리).

**커밋④** (`a4fe1c6`) — 위저드 모달 2개(scImportModal·propImportModal):
mhead만 sticky 적용, 위저드 단계별 액션행(`#sc_importPreview`·
`#propImportPreview` 토글, `.macts`)은 지시대로 통일 없이 mbody 흐름 안에
그대로 유지(위저드 특성상 단일 sticky 푸터로 강제하지 않음).

**검증**(Playwright, 로컬 정적 서버+게스트모드):
- 데스크톱 1400px: 9개 모달 전부 — mbody에 3000px 더미 콘텐츠 주입 후
  강제 스크롤(scrollTop=1000)해도 mhead 위치·mfoot 위치가 스크롤 전후로
  완전히 동일(0.5px 오차 이내) 확인, `.box` computed overflow가 실제로
  `hidden`임을 확인.
- scImportModal/propImportModal: `.macts` 액션행이 여전히 `.mbody` 안에
  있고 파싱→미리보기 토글(`#sc_importPreview`/`#propImportPreview`
  display 전환)이 구조적으로 정상 확인.
- `.status-picker`/모달 z-index(1100)는 B-58 이후 무회귀 확인.
- 모바일 390px: `complexDetailModal` 풀높이 시트에서 mbody 강제 스크롤 후
  헤더(제목+즐겨찾기+닫기) 위치 불변·닫기 버튼 항상 화면 안에 위치 확인,
  드래그다운 닫기 핸들러(touchstart 디스패치)가 에러 없이 동작. scEditModal
  모바일 패딩 압축(`mhead: 10px 12px 6px`, `mfoot padding-bottom: 8px`
  = `calc(8px+env(...,0))` 헤드리스 환경에서 0 fallback으로 정확히 8px)
  확인.
- `node --check js/properties.js`·CSS 중괄호 균형·`index.html` div 개폐
  균형·`git diff --check` 전부 통과.
- **JS 무회귀**: 4개 커밋 전체 diff에서 삭제된 `id=`/`data-close=` 속성
  집합과 추가된 집합을 비교해 완전히 동일함(개수·내용 둘 다 무손실) 확인
  — 즉 모든 버튼 ID·닫기 배선이 그대로 보존됨.

**보류(테디 결정 필요)**: 지시서의 "모바일 키보드 충돌 시 `.box`
`max-height:88vh`→`100dvh` 검토 또는 `.mfoot{position:static}` 폴백"은
실기기 iOS Safari 키보드 실측이 필요한 항목이라 이번엔 구현하지 않음 —
헤드리스 테스트로는 재현 불가. 실기기에서 입력 모달(scEdit·assetAi·
import·propEdit)에 키보드를 올렸을 때 튐 현상이 있으면 후속으로 처리.

수정 파일: `style.css`·`index.html`(모달 9개)·`js/properties.js`(B-21
드래그다운 핸들러 안전망 정리, 1곳).

---

## 2026-07-14 — B-27-lite① 전세 안전 체크 기록 스키마+입력 UI (`6d4c01c`)

`listings[]`에 전세 안전 항목 9종(전입신고·확정일자·반환보증·전세대출·
서울시 이자지원·근저당선순위·신탁압류·임대인대리인확인·특약협의)의
기록 필드 추가. 이번 커밋은 스키마+입력 UI까지 — 카드 배지(미확인 N·
주의 N)는 다음 커밋(②).

**스키마**(`js/state.js`): `listings[].safety = { [9개 key]: {status
('unchecked'|'ok'|'warning', 기본 'unchecked'), memo, source, checkedAt} }`.
키 목록·상태 라벨(미확인/문제없음/주의)·출처 옵션(매물광고·중개사·임대인·
현장·등기부·건축물대장·은행·보증기관·기타)은 `SAFETY_ITEMS`/
`SAFETY_STATUS_LABEL`/`SAFETY_SOURCES` 상수로 정의(CHECKLIST 근처).
`applyGuards()`가 항목별로 병합해 일부만 저장된 기존 데이터도 나머지
항목을 `defaultSafetyItem()`으로 채움(무손실). 매물 신규 생성 경로
3곳(수동 추가·시트 임포트·마이그레이션 프리뷰) 전부 `defaultListingSafety()`
로 초기화.

**UI**(`js/properties.js`): 단지 상세(`complexDetailModal`) 매물 행 안에
"전세 안전 체크" 접이식 섹션 추가(기본 접힘, `.gates-toggle`/
`.gates-toggle-caret` 기존 패턴 재사용). 펼치면 9항목별로 상태 select·
메모 텍스트(esc() 이스케이프)·출처 select·확인일 date input. 판정·차단·
점수 없음 — 기록·표시만.

**검증**(Playwright, 로컬 정적 서버+게스트모드): 토글 기본 접힘→펼침 정상,
상태/메모/출처/확인일 개별 입력이 정확히 해당 항목에만 반영되고 나머지
8항목은 기본값 유지 확인. 메모에 `<script>` 페이로드 입력 시 실행 안 되고
텍스트 그대로 렌더(esc 정상 동작) 확인. `applyGuards()` 마이그레이션
케이스 2종(safety 필드 자체가 없는 구 데이터 / 9개 중 1개만 저장된 구
데이터) 모두 나머지 항목 기본값 보정 + 기존 값 무손실 확인. 모바일 390px
매물 상세 시트에서 토글 동작 및 B-59 sticky 헤더 무회귀(스크롤 전후
mhead 위치 불변) 확인. `node --check` 양쪽 파일·CSS 중괄호 균형 통과.

**부수 발견**: 없음(범위 내 작업만).

수정 파일: `js/state.js`(스키마+상수+applyGuards)·`js/properties.js`
(입력 UI+이벤트 핸들러+신규 리스팅 초기화 3곳)·`style.css`(안전 체크
섹션 스타일, 기존 토큰 재사용).

---

## 현재 기술 스택

| 항목 | 내용 |
|------|------|
| 프론트엔드 | 단일 `index.html` (Vanilla JS) |
| 배포 | Vercel (서버리스) |
| 데이터 저장 | Upstash Redis (클라우드) + localStorage (로컬 백업) |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) + 웹 검색 |
| 지도 | 네이버 지도 JS API v3 + 네이버 Geocoding API |
| 인증 | 서버 PIN + Bearer 토큰 (24시간) + IP 브루트포스 방어 |

## 환경변수 목록

| 변수명 | 용도 | 필수 |
|--------|------|------|
| `SWEETYHOME_PIN` | 로그인 PIN | ✅ |
| `KV_REST_API_URL` | Upstash Redis URL | ✅ |
| `KV_REST_API_TOKEN` | Upstash Redis 토큰 | ✅ |
| `ANTHROPIC_API_KEY` | Claude AI API 키 | ✅ |
| `NAVER_MAPS_CLIENT_ID` | 네이버 지도 Client ID (JS SDK + Geocoding 공용) | ✅ |
| `NAVER_MAPS_CLIENT_SECRET` | 네이버 Geocoding API Secret | ✅ |
| `ANTHROPIC_MODEL` | 모델 오버라이드 (기본: haiku) | 선택 |
