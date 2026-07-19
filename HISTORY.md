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

## 2026-07-14 — B-27-lite② 매물 카드 안전 체크 요약 배지 (`e9563c2`)

커밋①(`6d4c01c`)의 `listings[].safety`·`SAFETY_ITEMS`를 그대로 읽기만
해서 매물 행(단지 상세)에 요약 배지 추가. **스키마 변경 없음, 상수
중복 정의 없음.**

**구현**(`js/properties.js`): `safetyBadgeChip(l)` 함수 신규 —
`SAFETY_ITEMS` 9개를 순회해 `unchecked`/`warning` 개수 집계 +
`checkedAt` 중 최신값(문자열 정렬로 최댓값) 계산. 9개 전부 `ok`면
"안전 체크 완료 · 마지막 확인 YYYY.MM.DD"(마지막 확인일 없으면 날짜
생략), 그 외엔 "미확인 N · 주의 N"(+ 있으면 마지막 확인일). 주의가
1개 이상이면 기존 `.chip.warn` 토큰(경고색 1가지) 추가 — 새 CSS 없음.
`cx-listing-top`(단지상태·대표매물 칩 옆)에 배지 삽입. 안전 체크 섹션
`change` 핸들러에 `renderCxListings()` 호출을 추가해 상태 변경 시
배지가 즉시 갱신되도록 함(기존엔 `save()`만 하고 재렌더 안 했음 —
집계 배지가 생기며 필요해진 최소 변경).

**구현 안 함(지시대로)**: 배지 기반 정렬·필터·숨김·색상 등급화 없음.
표시만.

**검증**(Playwright, 게스트모드+모바일 390px): 3가지 조합(전부 미확인 /
혼합 · 주의 포함 / 전부 문제없음) 배지 문구·클래스 정확성 확인. 안전
체크 섹션에서 상태 select 변경(1개 unchecked→warning) → 배지 즉시
"미확인 8 · 주의 1"로 갱신 확인, 9개 전부 ok로 전환 시 "안전 체크
완료" 문구로 정확히 전환 확인. `applyGuards()`로 보정되는 구 데이터
(safety 필드 자체가 없던 리스팅)도 크래시 없이 "미확인 9 · 주의 0"
정상 렌더 확인. 모바일 390px 배지 노출 + B-59 sticky 헤더 무회귀
확인. `node --check` 통과.

**부수 발견**: 없음.

수정 파일: `js/properties.js` 1개(함수 추가·배지 삽입·핸들러 1줄
추가). 스키마·CSS 변경 없음.

**→ B-27-lite 전체 완료** (커밋① `6d4c01c` + 커밋② `e9563c2`). 다음
지시는 B-61(출퇴근 2인) 예정.

---

## 2026-07-14 — B-61 출퇴근 2인 설정 + 기록 (`43640e1`+`dee9064`)

R-07(통근 기준지) 구조 해소. B-27-lite와 같은 원칙 — 자동 경로계산·판정
없음, 기록·표시만. `js/nav.js` 무접촉.

**커밋①**(`43640e1`, `state.js`+`profile.js`+`index.html`) —
`state.settings.commuters = [{name, dest}, {name, dest}]` 고정 2개
(기본 테디→강남역/연정→신사역). `applyGuards()`가 항목별 병합이라 구
데이터(필드 자체가 없거나 1개뿐이거나 name/dest 일부만 있어도) 정확히
2개로 보정. 프로필 모달에 "통근 기준지" 섹션 추가(`pf_commuter0_name`·
`pf_commuter0_dest`·`pf_commuter1_name`·`pf_commuter1_dest`, 다른
프로필 필드와 동일하게 빈 입력은 기존값 유지). **하드코딩 없음** — 기본
값도 `DEFAULT.settings.commuters`를 통해서만 존재, 코드 다른 곳에서
"강남역"/"신사역" 참조 없음.

**커밋②**(`dee9064`, `state.js`+`properties.js`+`style.css`+
`index.html`) — `complexes[].commutes = [{minutes, transfers,
destSnapshot}, {...}]`(index 0/1 = `settings.commuters[0/1]`) +
`complexes[].commuteMemo`. 단지 상세에 인별 소요시간(분)·환승 횟수
입력 추가(`commutesInputHTML()`), 저장 시 `destSnapshot`에 그 시점의
`settings.commuters[i].dest`를 자동 스냅샷. 표시(`commuteSummaryHTML()`)
는 계산만: "테디 37분 · 연정 34분 (차이 3분)" 형태, `destSnapshot`이
있고 현재 `dest`와 다르면 그 사람 시간 옆에만 "기준지 변경됨 · 재확인
필요"(기존 `.chip.warn` 토큰) 표시. `minutes`가 `null`(미입력)이면
"미확인", `0`이면 "0분"으로 명확히 구분(엄격 비교). 기존
`commuteGangnam`/`commuteSinsa`(레거시 강남역/신사역 전용 필드)는
전혀 건드리지 않음 — 완전히 별개의 신규 필드. 신규 단지 생성 경로
3곳 모두 `defaultComplexCommutes()`로 초기화.

**검증**(Playwright, 게스트모드+모바일 390px):
- (①) 기본값 테디/강남역·연정/신사역 노출, 이름·목적지 수정 후 저장 →
  `state.settings.commuters` 정확히 반영. `applyGuards()` 마이그레이션
  2케이스(commuters 필드 자체 없음 / 1개·일부 필드만 있는 malformed
  데이터) 모두 정확히 2개로 보정 확인.
- (②) 두 사람 모두 미확인 상태에서 시작 → 소요시간 입력 시 요약이
  실시간으로 정확히 갱신(차이 계산 포함) 확인. 저장 시 `destSnapshot`이
  그 순간의 목적지로 정확히 기록됨 확인. 프로필에서 목적지만 변경 →
  기존 소요시간·환승 기록은 그대로 유지된 채 그 사람 옆에만 "기준지
  변경됨" 배지가 뜨는 것 확인(다른 사람은 영향 없음). 이름만 변경(테디→
  규범) → 표시 라벨만 바뀌고 소요시간 등 기록은 index 매칭이라 완전히
  무손실 확인. `minutes` 0과 빈 값(null)이 각각 "0분"/"미확인"으로
  정확히 구분 렌더 확인(`=== 0` 엄격 비교). `applyGuards()`로 보정되는
  구 단지(commutes 필드 자체가 없던 데이터)도 무손실·무크래시 확인
  (`commuteMemo` 등 다른 필드도 그대로 보존). 모바일 390px 입력·요약
  표시 정상, 가로 스크롤 없음, B-59 sticky 헤더 무회귀 확인.
- `node --check js/state.js`·`node --check js/properties.js`·`node
  --check js/profile.js`·CSS 중괄호 균형·`index.html` div 개폐 균형
  전부 통과.

**구현 안 함(지시대로)**: 경로 API 자동 계산, 시간·차이 기준 부적합
판정, 정렬·필터 자동 연동. 전부 기록·표시만.

**부수 발견**: 없음.

**작업 방식 메모**: 커밋①과 커밋② 모두 스키마(`state.js`) 변경이 서로
다른 최상위 키(`settings.commuters` vs `complexes[].commutes`)를
건드려서, 한 세션에서 먼저 전체 구현 후 `git checkout`으로 되돌렸다가
커밋①분만 재적용→커밋, 이어서 커밋②분을 재적용→커밋하는 방식으로 두
커밋의 diff를 깨끗하게 분리함(중간에 임시로 정의되지 않은 함수를
참조하는 상태가 잠깐 있었으나 스테이징 전에 정리, 커밋 시점엔 항상
`node --check` 통과 상태만 커밋).

수정 파일: `js/state.js`(양쪽 커밋에 걸쳐 스키마+상수+applyGuards)·
`js/profile.js`(①)·`js/properties.js`(②)·`style.css`(②, 최소 신규
규칙만)·`index.html`(양쪽, 프로필 섹션+단지상세 섹션).

**→ B-61 완료**. R-07 해소. BACKLOG.md ⭐ 섹션은 커맨드센터가 확인 후
정리할 차례.

---

## 2026-07-17 — 매물 필드 편집 기능 (B-63)

`BACKLOG.md` ⭐ 섹션 B-63. 단지 상세의 매물 행에서 dongHo(동/호수)·
areaM2(전용면적)·areaText(면적 텍스트)·deposit(보증금)·listingStatus
(매물상태)·memo(메모) — 추가 후 편집 불가능하던 6개 필드에 편집 수단을
추가. `js/properties.js` 1개 파일, 커밋 1개.

**착수 전 진단**: 편집 가능하던 필드는 managementFee(triState 세그먼트
버튼)·safety(9항목, B-27-lite 접이식)·isRepresentative(대표매물 설정
버튼)뿐이었음. 나머지(dongHo·areaM2·areaText·deposit·memo)는 추가 시점
값이 고정이었고, listingStatus는 3개 버튼(게시중 확인/사라짐 처리/
가격변동 기록)의 부수효과로만 간접 변경 가능해 5개 상태값 중
`다른동호수등장`은 UI에서 도달 불가능한 상태였음(필터 드롭다운에는
있었지만 설정할 방법이 없었음).

**구현**: B-27-lite의 접이식 패턴(`safety-wrap`/`gates-toggle`) 그대로
재사용한 `listingEditHTML(l)` — 기본 접힘, 매물 행 안에서 토글해서
펼침(`cxListingEditExpanded` Set, 안전체크와 동일 방식). 안에 dongHo/
areaText(텍스트), areaM2/deposit(숫자, `.tri-num` 재사용), listingStatus
(select, 필터 드롭다운과 동일한 5개 값 — `LISTING_STATUS_OPTIONS`),
memo(textarea) — 전부 `data-editfield`+`data-lid`로 마킹해 `#cxDetailListings`
위임 change 핸들러 하나가 처리(safety 필드 저장과 동일 패턴). areaM2·
deposit은 triState 숫자 입력과 동일하게 빈 값→null(미입력), 0은 그대로
숫자 0 저장(0 vs null 엄격 구분), 음수·NaN은 입력값을 이전 값으로 되돌리고
저장하지 않음. listingStatus 직접 편집은 게시중확인/사라짐처리/
가격변동기록 버튼의 기존 부수효과(lastCheckedAt 갱신 등)와 무관한 별도
경로 — 두 방식 공존, 서로 방해 없음. areaGrade는 별도 저장 없이 기존과
동일하게 항상 `calcAreaGrade(l.areaM2,...)`로 실시간 계산.

**스키마 변경 없음** — dongHo/areaM2/areaText/deposit/listingStatus/memo
모두 `state.js` 스키마와 `applyGuards()`에 이미 존재하던 필드(v5 매물
스키마 최초 설계 시점부터 있었으나 편집 UI만 없었음). `js/state.js`
무접촉.

- **검증**(Playwright, 로컬 정적 서버+게스트모드, 데스크톱 1280px+
  모바일 390px):
  - 6개 필드 각각 수정 → `state.listings[]`에 정확히 반영 + 매물 행
    요약(동호수 라벨·`보증금 X억 · 전용 Y㎡` 헤드라인·상태 칩)에 즉시
    반영 확인.
  - areaM2·deposit: 빈 값→null, `0` 입력→숫자 0(둘 다 정확히 구분 저장),
    음수 입력 시 거부(입력값 원복, 저장 안 됨) 확인.
  - listingStatus를 select로 `다른동호수등장`(기존엔 도달 불가능하던
    상태)으로 직접 설정 → 정확히 저장 + 칩 텍스트 갱신 확인.
  - memo에 `<script>` 태그 입력 → `state.listings[].memo`엔 원본 그대로
    저장되지만(저장 계층에서 임의로 자르지 않음), 렌더링된 textarea
    HTML은 `esc()`로 이스케이프되어 스크립트가 실행되지 않음 확인(XSS
    없음).
  - 회귀 없음 확인: managementFee triState·안전 체크 9항목 토글·
    대표매물 배지 전부 정상 동작.
  - 모바일 390px: 편집 섹션 펼침 정상, 가로 스크롤 없음, B-59 sticky
    헤더(`.mhead`) 스크롤 중 위치 불변 확인(`.box` 자체는 스크롤 안 됨,
    `.mbody`만 스크롤).
  - `node --check js/properties.js`·중괄호 균형 통과.
  - 로컬 python 테스트 서버·Playwright 스크립트는 세션 종료 전 전부
    삭제(레포 바깥 scratchpad에서만 실행, 레포에 흔적 없음).

**localStorage 실제 저장(새로고침 유지)은 이번에도 게스트/데모 모드
특성상 직접 확인 못 함**(데모 모드는 `save()`가 조기 반환 — 기존 설계,
버그 아님). 실사용 환경에서 저장→새로고침 유지는 테디가 실제 사용 중
확인 요망. 다만 편집 대상 필드는 모두 기존 스키마 필드 그대로이고 저장
경로(`save()`→localStorage+Redis)도 기존 안전 체크·관리비 편집과 완전히
동일한 코드 경로를 타므로 회귀 위험은 낮음.

**→ B-63 완료**. BACKLOG.md ⭐ 섹션은 커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-17 — 로그인 유지 (B-65)

`BACKLOG.md` ⭐ 섹션 B-65. R-02(자동 로그인) 가결 항목 구현. `sh_token`을
sessionStorage(탭 닫히면 소멸) → localStorage(만료시각 별도 저장)로 전환해
새로고침·탭 닫힘·모바일 브라우저 재시작에도 24h 내 재로그인 없이 유지되게
함. `js/auth.js` 1개 파일만 수정, `api/` 서버 코드·다른 프론트 파일
전부 무접촉(B-63과 파일 무충돌·병렬 진행).

**구현**: `SH_TOKEN_TTL_MS`(24*60*60*1000, 서버 `api/_auth.js`의
`SESSION_TTL=86400`초와 동일 값 — TTL은 시크릿이 아니라 상수로 코드에
둠) 상수 하나로 통일. `setToken()`/`clearToken()` 헬퍼 신설 —
`setToken()`은 로그인 성공 시 `sh_token`+`sh_token_exp`(now+TTL) 두 키를
함께 localStorage에 저장, `clearToken()`은 두 키를 함께 삭제.
`getToken()`은 만료시각을 확인해 지났으면 `clearToken()` 호출 후 null
반환 → 기존 로그인 화면 진입 플로우 그대로 재사용(추가 분기 없음).
`sh_token`을 직접 건드리던 5곳(`getToken`·`forceLogin`·`tryLogin` 성공
분기·boot IIFE의 토큰 검증 실패 분기·로그아웃 버튼) 전부 새 헬퍼로
교체. 기존 sessionStorage에 남아있던 토큰은 그냥 무시되고(localStorage에
없으니 `getToken()`이 null 반환) 재로그인 1회로 자연 정리 —
지시대로 별도 마이그레이션 코드 없음.

- **검증**(Playwright, `/api/login`·`/api/state`·`/api/health` 라우트
  모킹 — 실제 PIN 없이 로그인 플로우 재현):
  - 로그인 성공 → `sh_token`·`sh_token_exp`(정확히 24h 후) 둘 다
    localStorage에 저장, sessionStorage엔 저장 안 됨 확인.
  - 새로고침 → 로그인 화면 재노출 없이 그대로 유지 확인.
  - `sh_token_exp`를 과거 시각으로 조작 후 새로고침 → 로그인 화면으로
    복귀 + 두 키 모두 자동 삭제 확인.
  - 로그아웃 버튼 → 두 키 모두 삭제 확인.
  - `/api/state`가 401 반환하도록 모킹 → 기존 `forceLogin()` 경로가
    두 키를 정리하고 로그인 화면으로 유도, 이후 재로그인 플로우도
    정상 동작(무회귀) 확인.
  - 틀린 PIN → 토큰 저장 안 됨, 로그인 화면 유지 확인(회귀 없음).
  - `node --check js/auth.js` 통과.
  - 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-65 완료**. BACKLOG.md ⭐ 섹션은 커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-17 — HTML/마크다운 렌더링 깨짐 진단 (B-64 ①, 코드 무변경)

`BACKLOG.md` ⭐ 섹션 B-64. 사용자 실사용 보고: "HTML 양식이 3곳에서
깨짐 — ①붙여넣기 임포트 ②수집함 카드 표시 ③매물 상세 표시". 이 커밋은
**진단 전용**(코드 무변경) — `scraps-import.js`·`scraps-render.js`·
`properties.js`·`utils.js`의 렌더 경로를 전수 확인하고, Playwright로
실제 `<script>`·`onerror`·`javascript:` payload를 렌더시켜 실행 여부를
실측함.

### ⚠️ 보안 최우선 — XSS 실행 가능 지점 2건 발견 (보고된 3곳과 무관한 별도 위치)

**신고된 3곳 자체에서는 XSS 실행 지점을 찾지 못함.** 대신 전수 조사
과정에서 **프로필 마일스톤 라벨**(`state.profile.milestones[].label`,
프로필 모달의 자유 텍스트 입력) 필드가 두 곳에서 `esc()` 없이
`innerHTML`에 삽입되는 것을 발견 — Playwright로 실제 `<img src=x
onerror="...">` 를 이 필드에 넣고 렌더시켜 **실행됨을 확인**:

1. **`js/nav.js:61`** — `renderJourney()`(대시보드 "우리의 여정" 타임라인,
   `<div class="jt">${s.t}</div>`, `s.t=m.label`). `renderDash()`가
   `renderAll()`(모든 `load()`/렌더 사이클)마다 호출되므로 **로그인 시
   기본 탭(대시보드)에서 매번 자동 실행** — 가장 심각.
2. **`js/ai.js:26`** — `renderChat()`(AI 채팅 빠른질문 칩,
   `chips.innerHTML=chatChips().map(c=>'<button>${c}</button>')`,
   `chatChips()`의 `chip4`가 다음 마일스톤 라벨을 그대로 사용). AI
   탭을 열 때 실행.

같은 `state.profile.milestones[].label` 필드가 **프로필 모달 자체
편집 UI**(`js/profile.js:5`, `value="${esc(m.label)}"`)에서는 정확히
`esc()` 처리돼 있어 안전함 — 딱 이 표시(read-only 렌더) 경로 2곳만
빠짐. 실제 악용 가능성은 PIN으로 이미 접근 권한이 있는 사람(본인)이
자기 프로필에 넣는 셀프-XSS 형태라 외부 공격 표면은 좁지만, 실행되면
`localStorage`의 `sh_token`(B-65로 방금 이전한 로그인 토큰) 등 페이지가
접근 가능한 모든 것에 접근 가능 — 발견 즉시 보고. **수정은 각각
`esc(s.t)`/`esc(c)` 1줄씩, 매우 작고 안전한 패치** — 별도 지시로
착수 권장.

### 1. 재현 — ①붙여넣기 임포트 (`scraps-import.js`)

`scAutoDetect()`가 frontmatter(`---`) → 마크다운 표(`|`) → `key: val`
블록 → 자유텍스트 순으로 시도. 임포트 입력창(`#sc_importInput`)이
일반 `<textarea>`라 붙여넣기 시 브라우저가 자동으로 `text/plain`만
넣음(HTML 태그가 raw로 살아남을 경로 자체가 없음 — 이 파일엔 HTML
태그 문자열이 존재해도 항상 "문자"로만 취급됨). 네이버 매물 페이지처럼
구조화 안 된 실제 웹페이지를 통째로 복사해 붙여넣으면 frontmatter·표·
`key:val` 패턴에 전혀 안 맞아 거의 항상 `scFreeText()`로 폴백 —
첫 번째 비어있지 않은 줄을 제목으로 추측하는데, 페이지 전체 복사본의
첫 줄은 보통 네비게이션·광고 등 실제 매물명과 무관한 텍스트라 **"제목
추측 실패 + 전체가 raw 한 덩어리로 뭉침"** 형태로 깨짐 — HTML 렌더
문제가 아니라 **파싱 휴리스틱이 실제 웹 카피 형태를 못 맞추는 문제**.
미리보기 표(`scShowImportPreview`)의 모든 필드는 `esc()` 처리됨
(`js/scraps-import.js:138-141`) — 표시 자체는 안전.

### 2. 렌더 경로 전수 — ②수집함 카드 표시 (`scraps-render.js`)

`s.raw`(원문)만 `renderMd()`(marked.js parse → DOMPurify.sanitize,
`js/utils.js:134-141`)를 거쳐 `sc-card-raw`에 삽입
(`js/scraps-render.js:68`). 나머지 필드(title·location·price·area·
schedule·tags 등)는 전부 `esc()`. **DOMPurify가 로드돼 있고
(`index.html:14`) 정상 동작 확인** — `<script>`·이벤트 핸들러 속성·
위험 태그 전부 제거됨(아래 3번 실측 참고). 다만 marked.js는 일반
마크다운 파서라 붙여넣은 실제 매물 텍스트에 흔한 문자(줄 맨 앞
`#`(해시태그), `-`/`1.`(목록 오인식), `>`(인용 오인식))가 있으면
의도치 않게 제목·목록·인용으로 변환돼 레이아웃이 깨져 보임 — 이것도
보안 문제가 아니라 **마크다운 오인식에 의한 시각적 깨짐**.

### 2-계속. 매물 상세 표시 (`properties.js`) — 구체적 원인 특정

`properties[].memo`(레거시 매물 카드) 편집 모달의 `em_memo`에는
마크다운 서식 툴바(굵게·기울임·제목·목록·인용, `index.html:829-836`)가
붙어있어 사용자가 마크다운 문법으로 서식을 넣도록 유도함. 그런데 카드
표시(`js/properties.js:774`, `${p.memo?'<div class="c-memo">${esc(p.memo)}</div>':''}`)는
`esc(p.memo)`만 쓰고 `renderMd()`를 호출하지 않음 — 입력한
`**굵게**`·`## 제목`·`- 목록` 문법이 절대 렌더되지 않고 별표·해시
문자 그대로 노출됨. **에디터가 약속한 서식과 실제 표시가 어긋나는
WYSIWYG 불일치가 "매물 상세 표시 깨짐"의 구체적 원인으로 확인됨**
(보안 문제 아님 — `esc()`가 걸려있어 오히려 안전한 쪽으로 깨짐).
`listings[].memo`(B-63 신규 필드)는 서식 툴바 자체가 없어 이 불일치가
해당 없음.

### 3. ⚠️ 보안 실측 — renderMd()의 방어 범위 (Playwright로 실제 DOM 삽입 후 실행 확인)

`<script>`·`onerror`·`onload`·`javascript:` URL·`<svg>`·`<iframe>`·
`ontoggle` 등 7종 payload를 `renderMd()`에 통과시켜 실제 DOM에 삽입
후 실행 여부 확인 — **전부 무력화됨**:
- `<script>...</script>` → 태그 전체 제거, 텍스트만 남음
- `<img src=x onerror="...">` → `onerror` 속성 제거, `<img src="x">`만 남음(깨진 이미지 아이콘, 무해)
- `<svg onload="...">` → `<svg>` 자체가 허용 태그 목록에 없어 전체 제거
- `<a href="javascript:...">` → `href` 속성 자체가 제거됨(`<a>텍스트</a>`만 남음)
- `<iframe src="javascript:...">` → 전체 제거
- `<details open ontoggle="...">` → `ontoggle`만 제거, `open` 속성은 유지(무해)

CLAUDE.md엔 "XSS `<script>` 태그 제거 포함"이라고만 적혀있으나 실제로는
DOMPurify(`USE_PROFILES:{html:true}`)가 이벤트 핸들러 속성·`javascript:`
URL·비허용 태그까지 포괄적으로 막고 있음을 실측으로 확인 — 문서 설명이
실제 방어 범위를 과소평가하고 있었을 뿐, 코드 자체는 이미 안전한 설계.

### 4. 수정 방안 제안

**A. 보안 수정(최우선, 별도 지시로 즉시 착수 권장)** — `js/nav.js` 1줄
(`${s.t}`→`${esc(s.t)}`) + `js/ai.js` 1줄(`chatChips()`가 반환하는
`c`를 삽입할 때 `esc(c)}`). 스키마·구조 변경 없음, 초소형 패치.
렌더 시 정화(esc) 방식을 그대로 유지 — 이미 전체 코드베이스에
일관되게 쓰이는 패턴이고 이번 결함도 "빠뜨림" 문제일 뿐 설계 결함이
아니므로, 저장 시 정화로 바꿀 필요 없음(오히려 저장 시 정화는 원본
데이터 손실 위험 + 향후 모든 저장 경로에서 빠짐없이 챙겨야 하는 부담이
더 큼).

**B. ③매물 상세 렌더 수정(작음)** — `js/properties.js:774`의
`esc(p.memo)` → `renderMd(p.memo)` 1줄 교체로 `em_memo` 툴바가
약속한 마크다운 서식이 실제로 렌더되게 함. `renderMd()`는 이미
DOMPurify로 안전 확인됨(위 3번). 영향 범위: 레거시 `properties[]`
카드 뷰 1곳.

**C. ②수집함 카드 마크다운 오인식(중간, 제품 판단 필요)** — 스트레이
`#`/`-`/`>` 등이 서식으로 오인식되는 문제는 마크다운 파서의 본질적
동작이라 코드만으로 "완전 해결"은 어려움. 후보안: (i) 원문 앞에
"입력 그대로 보기" 토글 추가, (ii) 리스트·헤딩 트리거를 줄 시작
공백 요구 등으로 더 엄격화, (iii) 붙여넣기 시 자동 이스케이프 제안.
실제 네이버 매물 붙여넣기 샘플로 테디 확인 후 방향 결정 권장.

**D. ①붙여넣기 임포트 파싱 개선(가장 큼, 제품 판단 필요)** — 구조화
안 된 실제 웹 카피 텍스트에 대한 파싱 정확도 개선은 휴리스틱 재설계가
필요해 범위가 큼. 최소 대안: 자유텍스트 폴백 시 "인식 실패, 제목을
직접 입력해주세요" 안내 + 제목 필드를 프리뷰 단계에서 바로 수정
가능하게. 전체 재설계(예: 네이버 부동산 특화 파서)는 별도 스코프 논의
필요.

**예상 수정 파일**: A(보안)=`js/nav.js`+`js/ai.js`, B=`js/properties.js`,
C=`js/scraps-render.js`(+`style.css` 소폭), D=`js/scraps-import.js`.
A는 이번 진단 직후 별도의 작은 보안 패치 커밋으로 즉시 처리 권장,
B~D는 B-64 ②(수정 단계) 지시 발급 시 착수.

- **검증 방법**: Playwright로 로컬 정적 서버 기동 후 게스트 모드
  진입, `renderMd()`/`esc()` 각 싱크에 7종 payload를 실제 주입해
  DOM에 삽입 후 `window.__xss*` 플래그로 실행 여부 확인(코드는
  일절 수정하지 않고 브라우저 콘솔 동작만 관찰). 마일스톤 라벨
  XSS는 `renderDash()`(대시보드) 및 `renderChat()`(AI 채팅) 두
  경로 모두에서 재현. 로컬 python 테스트 서버·Playwright 스크립트는
  레포 바깥 scratchpad에서만 실행, 세션 종료 전 전부 삭제. 이번
  커밋은 문서(`HISTORY.md`)만 변경 — `js/`·`css/` 무변경, `node --check`
  대상 코드 자체가 없음(진단 전용 커밋).

**→ B-64 ① 진단 완료**. 보안 수정(A)은 최우선 별도 지시 권장. ②~④(B/C/D)는
BACKLOG.md B-64 "수정" 단계 지시 대기.

---

## 2026-07-17 — 모바일 에디터/입력 UI 공통 깨짐 진단·수정 (B-66)

`BACKLOG.md` ⭐ 섹션 B-66. 사용자 실사용 보고: "모바일에서 에디터/입력
양식 깨짐 — 4영역 공통: ①매물 메모(`em_memo`) ②자산 노트(`a_notes`·
`an_mdPreview`) ③수집함 편집 모달(`scEditModal`·`sem_text`) ④수집함
입력폼(`sc_form`·`sc_mdSplit`)". 지시대로 `style.css`만 수정 — 손 A가
B-64로 `scraps-*.js`·`properties.js`·`utils.js` 작업 중이라 JS는
무접촉.

### 진단 — 4영역 공통 원인 특정

Playwright로 390px(모바일)·1280px(데스크톱) 양쪽에서 4영역 전부
캡처·측정(넘침·줄바꿈·분할뷰 붕괴·버튼 잘림 4개 유형 점검). 시각적
overflow·버튼 잘림·줄바꿈 깨짐은 **4곳 모두 발견되지 않음**(스크린샷
비교로 확인) — `sc_mdSplit`은 이름과 달리 실제 "분할뷰"가 아니라
`position:relative` 포지셔닝 컨테이너 하나(슬래시 메뉴 위치 기준)일
뿐이라 "분할뷰 붕괴"류 증상 자체가 해당 없음.

대신 **컴퓨티드 스타일 실측으로 4영역 중 2곳에서 공통 원인을 확인**:
`style.css:1140-1142`의 iOS Safari 자동확대 방지 규칙
(`input,select,textarea{font-size:16px !important}`, "16px 미만 입력
포커스 시 자동 확대 방지" 주석 있음)이 **`<textarea>`/`<input>`
요소만 대상**으로 하고 있었음. 그런데 ③④(수집함 편집모달·입력폼)의
`sem_text`/`sc_text`는 `<textarea>`가 아니라 **`contenteditable`
`<div>`**(`.sc-md-editor`, `js/utils.js`의 라이브 마크다운 렌더용) —
이 규칙 대상에서 완전히 빠져 있었음:

| 영역 | 요소 | 수정 전 mobile 390px font-size | 비고 |
|---|---|---|---|
| ①매물 메모 | `em_memo` (real textarea) | **16px** | 이미 안전 |
| ②자산 노트 | `a_notes` (real textarea) | **16px** | 이미 안전 |
| ③수집함 편집모달 | `sem_text` (contenteditable div) | **13px** | ⚠️ 확대 트리거 |
| ④수집함 입력폼 | `sc_text` (contenteditable div) | **14px**(`#sc_text` ID 규칙) | ⚠️ 확대 트리거 |

iOS Safari는 포커스되는 요소의 실제(computed) font-size가 16px 미만이면
`<textarea>`뿐 아니라 `contenteditable` 요소에도 동일하게 자동 확대를
건다 — 즉 ③④는 탭해서 입력을 시작하는 순간 화면 전체가 확대되는
"튐" 현상이 발생했을 것으로 판단됨(Chromium 기반 Playwright는 이
iOS 전용 동작을 재현하지 않아 스크린샷엔 안 보이지만, 원인 코드
자체가 명확히 다름). ①②(진짜 `<textarea>`)는 이미 해당 규칙 적용
대상이라 문제 없었음 — **"입력폼 4개 중 정확히 contenteditable
2개만" 증상이 겹친다는 사용자 보고와 정확히 일치**.

### 수정 (style.css만, 1규칙)

`style.css:1140-1145`(`@media (max-width:480px)`) — 기존 규칙의
셀렉터에 `.sc-md-editor` 추가:

```css
input,select,textarea,.sc-md-editor{font-size:16px !important;}
```

`!important`라 기존 `#sc_text{font-size:14px}`(760px 미디어쿼리, ID
셀렉터) 같은 더 높은 특이도 규칙보다도 확실히 우선 적용됨. `.mk`
마커·`.md-h1/h2/h3` 헤딩 크기는 전부 절대 px라 이 변경으로 깨지지
않음(fontsize 상속 없음).

- **검증**(Playwright, 390px+1280px):
  - 수정 후 `sem_text`·`sc_text` computed font-size가 390px에서 정확히
    `16px`로 확인(수정 전 13px/14px).
  - `em_memo`·`a_notes`는 수정 전후 동일하게 `16px` 유지(무변화 확인).
  - **데스크톱 1280px 4영역 전부 완전 무회귀** — `.sc-md-editor` computed
    font-size 13px 그대로(미디어쿼리가 480px 이하에서만 적용되므로),
    스크린샷 비교로도 픽셀 단위 차이 없음 확인.
  - 390px 스크린샷 재비교(수정 전/후) — 4영역 모두 overflow·줄바꿈·
    버튼 잘림 없음, 폰트가 약간 커진 것 외 레이아웃 변화 없음.
  - CSS 중괄호 균형 통과. `js/`·`index.html` 전혀 건드리지 않음(diff
    `style.css` 1파일, +4/-2줄).

### JS 원인 잔여분 (이번 커밋에서 미수정, 목록화)

이번 진단에서 4영역에 **CSS로 못 고치는 JS/HTML 구조 원인은 발견되지
않음** — 유일하게 확인된 공통 원인(iOS 확대)이 CSS 한 줄로 완전히
해결됨. 다만 아래는 이번 조사 중 참고로 확인한 사항으로, 후속 판단에
참고할 수 있어 남겨둠:
- `.sc-md-split`이라는 이름이 실제 동작(단순 포지셔닝 컨테이너)과
  안 맞음 — 혼동 방지용 리네이밍은 JS/HTML 변경(class 참조 위치
  다수)이 필요해 이번 범위 밖. 기능적 문제는 아님.
- `sc_mdToolbar`가 좁은 화면에서 가로 스크롤 스트립으로 동작하는 것은
  기존 의도된 설계(주석 확인됨, B-59 이전 작업) — 깨짐 아님.

### B-60(모바일 키보드 충돌)과의 관계 판별

B-60은 "iOS 키보드가 올라올 때 `.mfoot`/스크롤이 튀는지"(뷰포트 높이
변화로 인한 sticky/스크롤 위치 문제, 실기기 확인 시에만 착수 조건부)를
다루는 반면, 이번에 고친 것은 **포커스 순간 화면 전체가 확대되는
현상**(폰트 크기 문제, 키보드 등장과는 별개 메커니즘)으로 서로 다른
버그. 다만 비개발자 입장에서는 "탭하면 화면이 훅 움직인다"는 동일한
체감으로 보고될 수 있어, **B-60 실기기 재확인은 이번 B-66 패치 배포
후에 진행 권장** — 이번 확대 버그가 원인이었던 체감 "튐"이 이걸로
해소됐을 가능성이 있어, B-60의 조건부 착수 여부(튐이 실제로 남아있는지)
재판단 시 오탐을 줄일 수 있음.

**→ B-66 완료**. `style.css` 1파일만 수정. BACKLOG.md ⭐ 섹션은
커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-18 — 🚨 XSS 핫픽스: 마일스톤 라벨 esc 누락 (B-75 ①)

`BACKLOG.md` ⭐ 섹션 B-75 최우선(0순위) 지시. B-64 진단(`79c6a86`)
중 발견한 실행 가능 XSS 2건의 핫픽스. `state.profile.milestones[].label`
(프로필 모달 자유 텍스트)이 `js/nav.js:61`(대시보드 "우리의 여정"
타임라인, 로그인 시 `renderDash()`로 매번 자동 렌더)·`js/ai.js:26`
(AI 채팅 빠른질문 칩)에서 `esc()` 없이 `innerHTML`에 삽입되던 것을
수정. B-65로 로그인 토큰이 `sessionStorage`→`localStorage`로 옮겨간
직후라 실행 시 토큰 탈취 가능성까지 있어 다른 모든 작업보다 우선
처리.

**nav.js 직접 수정은 B-56 선례에 따라 사용자 승인 하에 진행**(B-56:
`dday()` 타임존 버그 수정 시 이미 손 A가 nav.js를 직접 고친 전례,
`21cb4b9`) — Codex와의 중복 작업 방지를 위해 이 사실을 여기 명시.

**수정 범위**: `js/nav.js`(`renderJourney()`의 `${s.t}`→`${esc(s.t)}`,
`${s.d}`→`${esc(s.d)}`, `${dday(s.date)}`→`${esc(dday(s.date))}` 3곳
— 세 번째는 `dday()`가 항상 `D±숫자` 형식의 안전한 문자열만 반환해
실질적 위험은 없지만 지시대로 같은 블록 전부 방어)·`js/ai.js`
(`chatChips().map(c=>...)`의 `${c}`→`${esc(c)}`). 두 파일을 전체
재검토했으나 이 4곳 외 추가로 esc() 빠진 사용자 입력 보간 지점은
없음을 확인 — `renderGates()`의 `p.city`/`p.depositRange`/`p.transport`는
이미 esc() 적용돼 있었고, `p.maxArea`는 `+value||…`로 항상 숫자
타입 강제(`profile.js:43`)라 애초에 문자열 주입이 불가능해 그대로 둠
(신규 로직 추가 아님 — 이미 안전한 곳은 손대지 않음). 새 이스케이프
함수·검증 로직 추가 없이 기존 `esc()` 감싸기만 진행.

- **검증**(Playwright): 마일스톤 라벨에 `<img src=x
  onerror="window.__xss=1">` 저장 후 `renderDash()`/`renderChat()`
  재실행 → 두 경로 모두 **실행 안 됨**, 대시보드 타임라인·채팅 칩
  둘 다 `&lt;img src=x onerror="..."&gt;` 형태로 이스케이프된 텍스트만
  노출 확인(B-64 진단 때 실행 확인했던 것과 동일 payload로 재현→방어
  확인). 정상 라벨("결혼식", 날짜 "2027-01-15") → 타임라인에 라벨·
  "2027.1"(기존 포맷 그대로, 일자는 원래도 표시 안 함) 정상 노출,
  채팅 칩도 "이사 준비 체크" 정상 노출 — 무회귀 확인. `dday()` 출력
  "D-167" 등 이중 이스케이프로 깨지지 않음 확인. `renderGates()`
  (기존 esc 3곳) 무회귀 확인. `node --check js/nav.js`·`js/ai.js`
  통과.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-75 ① 완료**(커밋②는 별도 항목). **이번 커밋은 push 보류하지
않고 즉시 push** — 배포본에 XSS가 살아있던 상태라 커맨드센터에 push
완료를 명시적으로 보고.

---

## 2026-07-18 — 매물 메모 카드 표시에 renderMd 적용 (B-64 수정분 / B-75 ②)

`BACKLOG.md` ⭐ 섹션 B-75 지시서에 포함된 B-64 수정분. B-64 진단
(`79c6a86`)에서 특정한 원인 그대로 수정: `em_memo`(매물 수정 모달)에
마크다운 서식 툴바(굵게·기울임·제목·목록·인용)가 있는데 카드 표시
(`js/properties.js:774`)는 `esc(p.memo)`만 써서 서식이 전혀 렌더되지
않던 WYSIWYG 불일치.

**수정**: `esc(p.memo)` → `renderMd(p.memo)`(marked.js+DOMPurify,
B-64에서 7종 XSS payload 무력화 실측 완료된 경로 그대로 재사용 —
새 정화 로직 없음). 컨테이너 클래스에 `sc-md-content` 추가 —
`renderMd()`를 쓰는 다른 모든 곳(수집함 카드 원문, 자산 노트
미리보기)이 전부 이 클래스와 짝을 이뤄 마크다운 요소별 스타일
(`.sc-md-content h1/h2/h3/ul/li/strong/...`, `style.css:810-826`)을
받고 있어, 동일 패턴을 따르지 않으면 `<strong>`/`<li>` 자체는 렌더돼도
브라우저 기본 스타일만 적용돼 다른 마크다운 표시 영역과 시각적으로
어긋남 — `renderMd()` 적용에 필수로 따라붙는 최소 동반 변경(신규
CSS 없음, 기존 클래스 재사용).

- **검증**(Playwright): 매물 메모에 `**굵게 텍스트**`+`- 목록1\n-
  목록2` 입력 → 카드에 `<strong>`·`<li>` 2개로 정상 렌더 확인(수정
  전엔 별표·대시 문자 그대로 노출됐던 것 확인 완료·B-64 진단 시
  기록). 같은 경로에 `<script>` + `<img onerror>` payload 재주입 →
  **둘 다 무력화 재확인**(`<script>` 태그 완전 제거, `onerror` 속성
  제거된 `<img src="x">`만 남음 — B-64 때의 DOMPurify 실측과 동일
  결과, 회귀 없음). 빈 메모(`''`)일 때 카드가 크래시 없이 정상
  렌더되는 것도 확인(빈 문자열 조건 분기 무회귀).
  `listings[].memo`(B-63 신규 필드, 서식 툴바 없음)는 이번 변경
  대상이 아님 — 그대로 `esc()` 유지, 별도 판단 불필요.
- `node --check js/properties.js` 통과.

### 문서 수정 (같은 커밋)

`CLAUDE.md`의 `renderMd` 설명을 B-64 실측 결과에 맞게 갱신 — "XSS
`<script>` 태그 제거 포함"(실제 방어 범위 과소 기술) →
"marked.js v9 + DOMPurify(`USE_PROFILES:{html:true}`) — `<script>`
태그·이벤트 핸들러 속성(onerror 등)·`javascript:` URL·비허용 태그
(svg/iframe 등) 포괄 차단(B-64 실측 확인)"으로 교체.

**→ B-64 수정분(WYSIWYG 불일치) 완료**. B-64에서 분리된 나머지
2건(①임포트 파싱 폴백→B-77, ②수집함 마크다운 오인식→B-76)은 별도
지시 대기. **B-75 커밋②도 즉시 push** — 커밋①과 함께 배포.

---

## 2026-07-18 — 대시보드 액션 더보기 → 액션탭 이동 (B-70)

대시보드 액션 Top 3 아래 요약 영역(`d_actMore`)에 기존
`switchPanel('actions')` 호출을 연결했다. 액션 요약의 정렬·완료 처리와
`renderTop3()` 렌더 로직은 변경하지 않았다.

- 검증: Playwright 데스크톱·모바일에서 요약 영역 클릭 시 액션탭 활성화,
  액션 목록 표시, 대시보드 탭으로 복귀 정상 확인.

---

## 2026-07-18 — 사진 UX 개선 (B-67, 커밋 2개)

`BACKLOG.md` ⭐ 섹션 B-67. ① 추가 시점 사진 제거·교체(스키마 무변경)
② 수집함 다중 사진(스키마 확장, `img`→`imgs[]`). 손 B가 `nav.js`로
B-70 작업 중이라 `nav.js` 무접촉(파일 무충돌 확인, 착수 전 `git status`).

### 커밋① `5cd66c8` — 추가 시점 사진 제거·교체

**진단**: 매물 폼(`#form`, `f_img`/`f_imgClear`/`f_imgPreview`)은 이미
추가 시점 제거·교체가 완전히 동작하고 있었음(코드 확인+Playwright
재검증 완료, 변경 불필요). 수집함 추가폼(`sc_file`/`sc_preview`)만
첨부 후 제거·재선택 UI가 아예 없었음(HTML에 ✕ 버튼 자체가 없음) —
실제 문제는 수집함 추가폼 1곳.

**수정**: `sc_preview` 아래에 `sc_imgClear`(✕ 제거) 버튼 추가, 기존
`f_imgClear`/`sem_imgClear` 패턴 그대로 재사용. `compressImage()` 기존
경로 무변경. `scClearForm()`에도 새 버튼 초기화 반영.

- 검증(Playwright): 첨부→썸네일+제거버튼 노출→제거 클릭→초기화→
  재첨부 정상. 파일 재선택 시 기존 첨부를 교체(중첩 안 됨) 확인.
  저장된 스크랩에 `img` 필드 정상 반영, 폼 재오픈 시 리셋 확인. 매물
  폼의 기존 제거·교체 기능도 회귀 없이 정상 동작 재확인.

### 커밋② — 수집함 다중 사진

**스키마**: `state.scraps[].img`(1장, 레거시) 옆에 `imgs[]`(배열, 신규)
추가. `applyGuards()`에서 `imgs`가 없고 `img`가 있으면
`imgs=[img]`로 무손실 이관 — **`img` 필드는 삭제·개명하지 않고 그대로
보존**, 이후 저장 시에도 `img`를 `imgs[0]`의 미러로 계속 채워 넣어
구버전 클라이언트·다른 코드 경로가 `img`만 읽어도 항상 대표사진을
받도록 함(하위호환 이중 안전장치). `state.js` JSDoc 갱신.

**장수 상한**: `SC_MAX_IMGS=5`(상수, `scraps-form.js`) — base64
그대로 Redis에 저장되는 구조라 장수를 무제한으로 두면 안 되고, 기존
`compressImage()`의 압축 스펙(max 600px, JPEG 0.65)은 그대로 유지한
채 개수만 제한. 초과 선택 시 앞에서부터 자르고 "사진은 최대 5장까지
첨부할 수 있어요" 안내(기존 에러 표시 영역 `sc_formErr`/`sem_err`
재사용, 새 DOM 없음).

**렌더**: 수집함 카드(`scraps-render.js` 목록·갤러리 뷰 2곳) 전부
`s.imgs[0]`(첫 장 대표) 기준으로 변경 — `applyGuards()`가 항상
`imgs`를 배열로 보정하므로 별도 null 체크 불필요.

**UI**: 추가폼(`sc_file`)·편집모달(`sem_img`) 둘 다 `multiple` 속성
추가(한 번에 여러 장 선택 가능) + 썸네일 그리드(`scRenderImgThumbs()`
공용 함수, 두 폼이 공유)로 교체 — 각 사진마다 개별 ✕ 삭제 버튼(기존
단일-슬롯 UI였던 커밋①의 `sc_imgClear`/`sem_imgClear`/
`sem_imgPreview`는 이 다중 슬롯 UI로 완전히 대체돼 제거). 새 CSS
클래스 3개(`sc-img-thumb`·`sc-img-thumb-del`, 기존 `sc-img-preview`는
flex 컨테이너로 확장) — 새 CSS 파일 없이 `style.css`에 추가.

**매물(listings/complexes) 사진 점검**: `state.listings[]`·
`state.complexes[]` 스키마를 확인한 결과 **사진 필드 자체가 아예
없음**(레거시 `state.properties[].img`만 사진 필드 보유, 이미
add/edit 양쪽에서 완전한 제거·교체 지원 중). 즉 "같은 버그"가 아니라
"애초에 없는 기능" — 구조가 근본적으로 다르므로 이번 범위에서 제외.
사진 기능이 필요하다면 버그 수정이 아니라 신규 기능 추가로 별도
지시 필요.

- **검증**(Playwright, 데스크톱 1280px+모바일 390px):
  - 구 데이터(`img`만 있고 `imgs` 없는 스크랩) → `applyGuards()` 통과
    후 `imgs=[img]`로 정확히 이관, `img` 필드는 그대로 보존, 카드·
    갤러리 뷰 양쪽에서 이미지 정상 표시 확인(무손실).
  - 추가폼: 3장 첨부→3개 썸네일, 1장 제거→2개, 4장 추가 시도(방 3자리)
    →정확히 5장에서 캡+최대 장수 경고 노출 확인. 저장된 스크랩의
    `imgs.length===5`, `img===imgs[0]` 미러 정확 확인. 저장 후 폼
    재오픈 시 리셋(썸네일 0개) 확인.
  - 편집모달: 기존 5장 썸네일 정상 표시→2장 제거→3장 남음→저장→
    `imgs.length===3` 반영 확인.
  - `applyGuards()` 라운드트립(저장→불러오기 시뮬레이션)에서도 `imgs`
    데이터 손실 없음 확인.
  - 데스크톱 1280px 전 시나리오 동일 통과, 모바일 390px에서도 썸네일
    그리드 가로 스크롤·잘림 없이 정상 배치 확인(스크린샷 비교).
  - `node --check js/scraps-form.js`·`js/scraps-render.js`·`js/state.js`
    통과, CSS 중괄호 균형 통과.
  - 로컬 python 테스트 서버·Playwright 스크립트·테스트 PNG는 레포
    바깥 scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-67 완료**(커밋① `5cd66c8` + 커밋②). BACKLOG.md ⭐ 섹션은
커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-18 — 담당자 목록 설정화 (B-69)

액션 담당자·자산 소유자에 공통으로 쓰던 전역 `OWNERS`의 기준 데이터를
`state.settings.owners`로 이동했다. 기본값은 기존 목록과 같고,
`applyGuards()`가 필드 없는 구 데이터와 잘못된 배열을 안전하게 보정한 뒤
전역 `OWNERS`를 같은 배열로 동기화하므로 `properties.js`를 포함한 기존
참조는 수정 없이 호환된다. 게스트 목록도 `GUEST_STATE.settings.owners`를
통해 설정된다.

프로필 모달에 담당자 추가·이름변경·삭제 UI를 추가했다. 저장 시 액션
담당자와 자산 소유자 드롭다운·자산 합계·AI 자산 요약에 즉시 반영한다.
이름변경·삭제는 설정 목록만 바꾸며 기존 `actions[].assignee`와
`assets.items[].owner` 문자열은 자동 치환하지 않는다. 현재 목록에서
빠진 과거 값은 액션 배지·편집 드롭다운과 자산 드롭다운·필터·합계에서
`(이전: X)`로 표시한다.

- 검증: Playwright 데스크톱 1440×900·모바일 390×844 모두 통과.
  `settings.owners` 없는 구 데이터가 기존 기본 목록으로 보정되고 액션·
  자산 데이터가 무손실인 것, 담당자를 `테디·공동·가족`으로 변경한 뒤
  양쪽 드롭다운에 반영되는 것, 제거된 `규범`이 기존 액션·자산에서
  `(이전: 규범)`으로 표시되면서 저장 문자열은 그대로인 것을 확인했다.
- 보안: 사용자 입력 담당자 이름을 HTML에 표시하는 모든 신규 경로에서
  기존 `esc()`를 적용했다.
- 회귀: 관련 JS 6개 `node --check`, `git diff --check` 통과.

---

## 2026-07-18 — 레거시 버튼 제거 · 매물 추가 시 단지 자동 매칭 제안 (B-68 + B-19확, 커밋 2개)

`BACKLOG.md` ⭐ 섹션 B-68·B-19확, 한 지시서·커밋 분리. 손 B가 `state.js`·
`profile.js`·`actions.js`·`assets.js`로 B-69 작업 중이라 `properties.js`
외 무접촉 — 이번 두 커밋 모두 `properties.js` 1파일만 수정, 스키마 변경
없음(지시대로 원천 배제).

### 커밋① `df51966` — B-68: 레거시 마이그레이션 버튼 노출 제거

이관 완료 후에도 남아있던 "기존 매물을 단지로 정리" 진입 버튼 2곳
제거: `.ph-actions` 툴바의 `migStartBtn`(`migInjectUI()`)과 단지가
0개일 때 빈 상태에 뜨던 `cxGoMigrateBtn`(`renderComplexes()`). **마이그레이션
코드 본체(`migApply`·`renderMigPreview`·`migPreviewModal` 등)는 삭제하지
않고 그대로 유지**(B-05에서 백업 후 일괄 삭제 예정) — 진입 버튼만 주입을
멈춰 사실상 비활성화. `showMoreMenu()`의 더보기 메뉴 id 목록에서도
`migStartBtn` 참조 제거(더 이상 존재하지 않는 요소라 `.filter(Boolean)`로
무해하게 걸러지긴 했지만, 같은 변경의 일부라 함께 정리). 빈 상태 문구는
"아직 등록된 단지가 없어요. 매물 탭에서 단지를 추가해보세요."로 교체.

- 검증(Playwright): `migStartBtn`·`cxGoMigrateBtn` 둘 다 DOM에 없음,
  빈 상태 새 문구 노출·구 문구("기존 매물을 단지로 정리") 미노출 확인.
  `migPreviewModal`·`migApply`·`renderMigPreview`는 코드상 그대로 남아
  있음(함수 존재 확인). 더보기(⋯) 메뉴가 참조 제거 후에도 에러 없이
  정상 동작. 단지가 있을 때의 일반 렌더 경로 무회귀.

### 커밋② — B-19확: 매물 추가 시 기존 단지 자동 매칭 제안

**문제**: 단지 매칭이 (단지명+지역) 문자열 완전일치(`cxMergeKey`)라
"래미안 원베일리" vs "래미안원베일리(아파트)" 같은 표기 차이만으로도
중복 단지가 생성됨.

**구현**: 완전일치 실패 시에만 퍼지 후보를 찾는 `findComplexCandidates()`
신설 — ①이름 유사: `fuzzyComplexName()`(괄호와 내용·끝의 "아파트"
접미사·모든 공백 제거 후 비교, 기존 완전일치 dedup용 `normalizeStr()`는
그대로 두고 별도 함수로 분리) ②좌표 근접: 기존 `haversineM()` 재사용,
300m 이내(`CX_MATCH_RADIUS_M`). 후보가 있으면 **"이 단지에 추가할까요?"
제안 모달**(`showComplexMatchPrompt()`, Promise 기반)을 띄워 사용자가
후보 중 하나를 고르거나 "새 단지로 만들기"/"취소"를 선택해야 진행됨 —
**자동 병합·자동 배정 없음, 어떤 경우에도 사용자 확인 후에만 배정**.
`properties.js` 외 무접촉 제약이라 모달 HTML은 `document.body`에
동적 주입(`cxMatchInjectUI()` IIFE, 기존 `migInjectUI()`와 동일 패턴),
새 CSS 파일·클래스 없이 기존 `.modal`/`.mhead`/`.mbody`/`.mfoot`
구조와 `--ink-soft` 토큰만 재사용(인라인 스타일).

**적용 경로 2곳**:
- `saveAsComplexListing()`(매물 폼 수동 추가) — 완전일치 실패 시 후보
  확인 → 제안 모달 → "취소" 선택 시 함수가 `false`를 반환하고 호출부
  (`saveBtn` 핸들러)가 폼을 닫지 않고 그대로 둠(입력값 유실 방지).
- `calcCxImportStatus()`/`renderImportPreview()`(TSV 붙여넣기 임포트)
  — 완전일치 실패+퍼지 후보 있음 → `cxJudgment='fuzzy'`, 미리보기
  테이블의 "단지 판정" 셀에 "비슷한 단지 있음" 배지(기존
  `dup-badge.dup-이름유사` 클래스 재사용) + 후보 선택
  드롭다운(`.pi-cxsel`) 노출. **기본값은 "새 단지로 만들기"**(자동
  병합 아님) — 사용자가 드롭다운에서 명시적으로 골라야 기존 단지에
  붙는다. TSV엔 좌표 컬럼이 없어 이 경로는 이름 유사만 적용(좌표
  근접은 매물 폼 경로에서만 유효).

**B-20 해소 여부**: **해소 안 됨** — B-20("수동 매물 추가에 매물 중복
가드 없음")은 완전일치로 같은 단지를 찾은 뒤 그 단지에 동일한 매물
(같은 동/호·면적·보증금)을 또 추가해도 걸러지지 않는 문제인데, 이번
제안 UI는 "어느 단지에 배정할지"만 다루고 "이미 같은 매물이 있는지"는
전혀 확인하지 않음(완전일치로 단지를 바로 찾으면 `!cx`가 거짓이라 제안
로직 자체가 실행되지 않음). 실제 해소하려면 `saveAsComplexListing()`에
임포트 경로가 이미 쓰는 `listingExists()` 호출을 추가해야 하는데, 이번
지시서엔 포함되지 않아 손대지 않음 — **B-20은 별도 지시 필요**.

- **검증**(Playwright, 데스크톱 1280px+모바일 390px, 시나리오별 독립
  페이지로 상태 오염 없이 검증):
  - 표기 변형("래미안 원베일리" vs 시드 "래미안원베일리(아파트)") →
    제안 모달 노출, 후보에 시드 단지 정확히 표시 확인.
  - 후보 선택 → 새 단지 생성 안 됨, 기존 단지에 매물 정확히 추가,
    모달·폼 정상 닫힘 확인.
  - 완전 무관한 이름 → 제안 없이 바로 신규 단지 생성(무회귀) 확인.
  - 제안 뜬 상태에서 "취소" → 단지·매물 둘 다 생성 안 됨, 폼이 입력값
    그대로 유지된 채 열려있음(유실 없음) 확인.
  - 제안 뜬 상태에서 "새 단지로 만들기" → 비슷한 이름이어도 명시적
    선택 시 새 단지 생성됨 확인(사용자 의사 존중).
  - 좌표만 근접(다른 이름, ~15m 거리)해도 "위치 근접" 사유로 제안 노출
    확인(이름 매칭과 별개로 좌표 매칭 단독 동작).
  - 완전일치(기존 단지와 이름·지역 정확히 동일) → 제안 없이 기존
    로직 그대로 바로 배정(기존 동작 무회귀) 확인.
  - 임포트 경로: 퍼지 후보 있는 행에 드롭다운 정상 노출, "비슷한 단지
    있음" 배지 표시, 드롭다운에서 후보 선택 후 제출 → 새 단지 생성 없이
    기존 단지에 매물 추가 확인. 드롭다운 그대로 두고(기본값) 제출 →
    자동 병합 없이 신규 단지 생성(안전한 기본값) 확인.
  - `node --check js/properties.js` 통과, `properties.js` 1파일만
    diff(+126/-8줄).
  - 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-68 완료. B-19확 완료(B-20은 미해소, 별도 지시 필요)**. `properties.js`
외 무접촉 준수(손 B의 B-69와 파일 무충돌 병렬 진행). BACKLOG.md ⭐
섹션은 커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-18 — 게스트 모드 담당자 표시 복원 (B-79)

B-69 이후 게스트 담당자 표시가 실명 기본값에 의존하지 않도록 게스트
`load()` 분기에서 `applyGuards(GUEST_STATE)` 직후
`state.settings.owners=['본인','배우자','공동']`으로 명시적
오버라이드하고 `syncOwners()`를 호출한다. 게스트 분기는 `save()`를
호출하지 않으므로 Redis·localStorage의 실사용 데이터는 변경하지 않는다.

- 수정 위치: 지시 대상이었던 `auth.js`가 아니라 `js/state.js`. 게스트
  진입 시 `auth.js`의 `unlockApp(true)`에서는 아직 `state`가 로드되기
  전이라, 상태 생성 직후인 `load()` 게스트 분기가 안전한 적용 지점이다.
- 검증: Playwright에서 게스트는 본인·배우자·공동, 일반 로딩은 저장된
  사용자 설정값을 표시하고 게스트 진입 전 localStorage가 바뀌지 않음을
  확인했다.

---

## 2026-07-18 — 자산 테이블 모바일 표시 개선 (B-73)

390px Before 실측에서 가로 스크롤·컬럼 잘림은 없었지만, 자산 행이
1열로 강제되어 한 행 높이가 443px였고 입력·선택 높이는 33~35px,
삭제 터치 영역은 26×32px에 불과했다.

`style.css`의 480px 이하 표시 규칙만 수정해 2열 카드형을 유지하고,
자산 항목명·메모는 기존처럼 전체 폭을 사용한다. 입력·선택·행 추가
버튼과 삭제 영역은 최소 44px로 확대했다. 스키마·`LIQUIDITY` enum·
`sumMobImmediate()`·자산 저장 로직은 변경하지 않았다.

- After 실측(390×844): 가로 스크롤 없음, 행 높이 385px, 두 열 각
  151px, 이름·메모 310px, 모든 입력·선택과 삭제 영역 44px.
- Playwright: 데스크톱 1440×900에서 기존 8열 테이블 유지, 모바일
  390×844에서 2열 카드·터치 영역 확인. 양쪽 모두 금액·소유자 편집,
  노트 저장과 마크다운 미리보기가 정상 동작했다.
- Before/After 캡처는 레포 밖 임시 경로에서 비교 후 정리했다.

---

## 2026-07-18 — 수집함 유형 수정(진단 결과: 이미 완료) · 수동 매물 중복 확인 (B-71 + B-20, 커밋 1개)

`BACKLOG.md` ⭐ 섹션 B-71+B-20, 한 지시서·커밋 분리 예정. 손 B가
`auth.js`·`assets.js`·`style.css`로 B-79·B-73 작업 중이라 해당 파일
무접촉. 새 CSS 필요 시 기존 클래스 재사용 원칙.

### ⚠️ B-71 — 착수 전 진단 결과: 이미 완전히 구현돼 있음, 코드 변경 없음

지시서는 "scEditModal에 SC_TYPE select 추가(현재는 추가 시에만 선택
가능)"를 요청했으나, 착수 전 코드 확인 결과 `sem_typeChips`(수정 모달
유형 선택 UI)가 **이미 완전히 구현·동작 중**이었음:
- `index.html:650`에 `sem_typeChips` 칩 UI가 추가폼(`sc_typeChips`)과
  동일한 8개 유형으로 이미 존재.
- `js/scraps-form.js`의 `semUpdatePropFields()`(`scUpdatePropFields()`
  와 완전히 동일한 구조)가 `openScEdit()` 시점과 칩 클릭 시점 양쪽에서
  호출돼 SC_PROPLESS(note·ai_log) ↔ 매물성 유형 전환 시
  `sem_fieldPrice`/`sem_rowAreaSchedule`를 정확히 표시/숨김.
- 저장 핸들러(`sem_save`)가 `#sem_typeChips .sc-type-chip.on`의
  `dataset.type`을 정확히 읽어 저장.
- `git log -S`로 확인한 결과 이 구현은 최초 모듈 분리 리팩터
  (`b1862f0`) 시점부터 존재 — 최근에 추가된 게 아니라 애초에 계속
  있었던 기능. 별도의 죽은/미사용 `sem_type` select 요소도 없음(grep
  확인) — 지시서가 요청한 "select 추가"를 만들면 오히려 기존 칩 UI와
  중복·충돌하는 새 컨트롤이 생겨 UX가 나빠짐.

**Playwright로 실측 재확인**(데스크톱 1280px+모바일 390px): 매매(sale)
매물에 보증금 "3.5억"·전용 "84"·일정 등을 입력한 스크랩을 메모(note)/
AI기록(ai_log)으로 전환 → 가격·면적·일정 필드가 숨겨지지만 입력값은
그대로 DOM에 남아있고, 저장 후 다시 매매로 되돌리면 값이 정확히
복원됨(삭제되지 않음, 지시서의 세 번째 요구사항도 이미 충족). 저장
직후 재오픈해도 유형·숨김 필드 값 모두 정확히 유지 확인.

**→ B-71은 코드 변경 없이 완료 처리 권장** — BACKLOG.md에 "이미
구현됨"으로 기록 정정 요청. 커밋은 만들지 않음(변경 사항이 없어 커밋할
diff 자체가 없음 — 빈 커밋은 만들지 않는다는 원칙 준수).

### 커밋 `86dcd40` — B-20: 수동 매물 추가 중복 확인

`saveAsComplexListing()`(매물 폼 수동 추가)에 임포트 경로가 이미 쓰는
`listingExists()`(`cxListingDupKey` 기반, URL 우선·없으면 동호수+전용
면적+보증금 조합) 호출 추가. **자동 차단이 아니라 확인 안내** —
`confirm('같은 동호수·보증금 매물이 있어요. 그래도 추가할까요?')`로
사용자가 강행 추가 가능(취소 시 B-19확과 동일하게 저장 중단+폼 유지,
입력값 유실 없음). 새 로직은 기존 `listingExists()` 재사용뿐, 새
중복판정 함수 없음.

- **검증**(Playwright, 데스크톱 1280px+모바일 390px):
  - 신규 매물(중복 없음) 저장 → 확인창 없이 바로 추가.
  - 동일 단지에 동호수·전용면적·보증금이 전부 같은 매물을 또 추가 →
    지시서에 명시된 정확한 문구로 확인창 노출, **취소** → 아무것도
    저장 안 되고 폼이 입력값 그대로 유지됨(유실 없음), **확인** →
    중복임에도 강행 추가됨(사용자 의사 존중, 자동 차단 아님).
  - 동호수만 다른 매물(같은 단지·면적·보증금) → 확인창 없이 바로
    추가(무회귀).
  - `node --check js/properties.js` 통과, `properties.js` 1파일만
    diff(+10/-3줄).

### 협업 노트

착수 전 `git status` 확인 결과 `style.css`·`HISTORY.md`가 손 B의
B-73(자산 테이블 모바일 개선) 작업으로 이미 커밋 안 된 상태였음 —
`js/properties.js`만 스테이징해 커밋, Codex의 진행 중 작업은 전혀
건드리지 않음(이 HISTORY.md 항목도 Codex의 B-73 기록 다음에 이어
붙이는 방식으로 추가, 삭제·덮어쓰기 없음).

로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥 scratchpad에서만
실행, 세션 종료 전 전부 삭제.

**→ B-71 완료(변경 없음, BACKLOG 기록 정정 필요) · B-20 완료**.
`properties.js` 외 무접촉 준수. BACKLOG.md ⭐ 섹션은 커맨드센터가
확인 후 정리할 차례.

---

## 2026-07-18 — 매물 카드 출퇴근 칩 일원화 (B-62)

실제 단지 카드와 숨겨진 레거시 카드가 함께 쓰는
`commuteCardChips()`를 `properties.js`에 추가했다. 신규
`complexes[].commutes`에 소요시간이 하나라도 있으면
`settings.commuters[].name` 기준으로 신규 값만 표시하고, 신규 값이
전부 비어 있을 때만 `commuteGangnam`·`commuteSinsa`를
`settings.commuters[].dest` 라벨로 표시한다. 두 체계가 모두 있어도
중복 표시하지 않으며 데이터 이관·삭제는 하지 않는다.

`destSnapshot`과 현재 목적지가 다른 신규 기록은 상세 화면과 같은
`.chip.warn` 및 "기준지 변경됨 · 재확인 필요" 문구를 카드에도
표시한다. 사용자 설정 이름·목적지와 시간·레거시 문자열은 모두 기존
`esc()`를 거쳐 렌더한다. 새 CSS 없이 기존 chip 클래스만 재사용했다.

- Playwright 데스크톱 1440×900·모바일 390×844: 신규만, 레거시만,
  둘 다, 둘 다 없음 네 조합 통과. 둘 다일 때 신규 우선·레거시 미표시,
  빈 값일 때 칩 미표시, 기준지 불일치 재확인 배지를 확인했다.
- 프로필에서 통근 이름·목적지를 변경하면 신규 칩 이름과 레거시
  fallback 목적지 라벨이 즉시 갱신되는 것을 양쪽 화면에서 확인했다.
- CSV 내보내기·임포트 및 레거시 필드 저장 경로는 변경하지 않았다.

---

## 2026-07-18 — 수집함 카드 가독성 · 초광폭 유연 레이아웃 (B-72 + B-74, 커밋 2개)

`BACKLOG.md` ⭐ 섹션 B-72·B-74, 한 지시서·커밋 분리(둘 다 `style.css`
겹침이라 한 손 순차 처리). 손 B가 `properties.js`로 B-62 작업 중이라
`properties.js` 무접촉 — 두 커밋 모두 `properties.js` 전혀 안 건드림.

### 커밋 `67f01a5` — B-72: 수집함 카드 필드 표기 가독성

**진단 먼저**(Playwright 캡처): 위치·가격·면적·일정을 `&nbsp;·&nbsp;`
로 이어붙인 한 줄 텍스트(`.sc-card-meta`, 전부 동일한 회색·굵기)가
길어지면 값들이 서로 구분 안 되고 흘러넘쳐 어디까지가 어떤 값인지
안 읽힘을 실측 확인(예: "서울 동작구 이수역 도보 5분 대로변 코너 ·
전세 4.2억 (융자 없음, 즉시입주 가능) · 전용 59.98㎡ ... · 즉시입주
가능 · 2026년 8월 초 협의"가 한 줄로 이어짐).

**수정**: 필드별로 개별 칩(`.chip` 재사용 + 신규 `.sc-meta-chip`/
`.sc-meta-chip-text`)으로 분리. 값 텍스트는 `--ink`(진한 색)로 아이콘
(라벨 역할, 기존 `ic-muted`)과 구분, 칩마다 `max-width`+말줄임
(`text-overflow:ellipsis`) 적용하고 잘린 값은 `title` 툴팁으로 전체
텍스트 확인 가능. 모바일(480px 이하)은 칩 `max-width`를 더 축소
(220px→150px)해 좁은 화면에서 칩 1개가 과점하지 않게 함. **마크다운
본문 렌더 영역(`.sc-card-raw`, B-76 대기)은 전혀 건드리지 않음** —
구조화 필드 표기(`.sc-card-meta`)만 수정.

- 검증(Playwright 데스크톱 1280px+모바일 390px): 4개 필드 전부 칩으로
  분리 렌더 확인, SC_PROPLESS(메모·AI기록)는 칩 자체 미노출(무회귀),
  긴 값에 정확한 `title` 툴팁 확인, 마크다운 raw 영역 렌더·펼치기/
  접기 토글 무회귀, 갤러리 뷰 무회귀, 편집 모달 필드 값 정확히
  채워짐(데이터 모델 무변경) 확인.

### 커밋 `eb7566d` — B-74: 초광폭 유연 레이아웃

**배경 실측**(Playwright 2560px 캡처, B-57 직후 상태): B-57이 전 탭
`.wrap{max-width:none}`을 적용해 대시보드·자산·액션·수집함(문서형
탭)이 대형 모니터에서 과도하게 넓어짐을 시각 확인 — 액션 행은
체크박스~삭제 버튼 사이가 텅 비고, 대시보드 타임라인 점이 화면
양끝까지 벌어지고, 수집함 카드 1장이 2560px 폭 전체를 차지.

**방향 결정**(실측 후 판단): 콘텐츠 유형에 따라 상한을 다르게 —
- **자산**: 소유자~메모 7개 컬럼의 실제 표라 넓을수록 각 컬럼이
  널널해짐 → 넓은 상한(`clamp(1440px,82vw,1800px)`, 2560px에서 1800).
- **대시보드·액션·수집함**: 타임라인·단일 컬럼 리스트·카드라 넓혀도
  내용이 늘지 않고 텍스트~버튼 사이 여백만 벌어짐 → 보수적 상한
  (`clamp(1440px,60vw,1600px)`, 2560px에서 1536).
- **매물(지도)**: 뷰포트 고정 flex 레이아웃 그대로 전체폭 유지
  (`max-width:none`, 변경 없음).

기존 `body:has(#panel-props.on) .wrap{...}` 패턴(B-46)을 그대로
재사용해 패널별로 스코프 분리. `clamp()`라 1440px 이하 뷰포트에선
min값(1440px)이 항상 이겨 기존 레이아웃과 완전히 동일(하드 컷오프
없음), 1440~2560 구간에서 뷰포트가 커질수록 완만히 넓어지다 상한에서
멈춤 — B-51의 하드 고정 1440과도, B-57의 무제한과도 다른 절충.

- 검증(Playwright, 1280/1440/1920/2560px 4구간 × 5개 패널 25개 시나리오
  + 모바일 390px): 1280·1440px에서 전 패널 무변화(자연폭, 상한 미작동)
  확인. 1920px에서 자산 1574px(확장 중)·대시/액션/수집함은 아직 1440
  (60vw<1440이라 미확장) 확인. 2560px에서 매물 2560(전체폭 유지)·자산
  1800(상한 도달)·대시/액션/수집함 1536(상한 1600 이내로 확장) 확인.
  2560px 스크린샷 재비교로 실제 여백이 합리적 수준으로 줄어든 것을
  시각 확인. 모바일 390px 전 패널 가로 스크롤 없음(무회귀) 확인.

### 검증 공통

- `node --check` 대상 JS(`scraps-render.js`) 통과, CSS 중괄호 균형
  통과(2개 커밋 모두).
- 로컬 python 테스트 서버·Playwright 스크립트·캡처 이미지는 레포
  바깥 scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-72 완료 · B-74 완료**. `properties.js` 무접촉 준수(손 B의 B-62와
파일 무충돌 병렬 진행, 착수 전 `git status` 확인 — B-62는 이미 커밋
완료 상태였음). BACKLOG.md ⭐ 섹션은 커맨드센터가 확인 후 정리할 차례.

---

## 2026-07-18 — 🔴 저장 유실 방지: 이탈 flush + 디바운스 maxWait (B-84)

`BACKLOG.md` "코드 점검 발견" 섹션 B-84(감사 확정 발견, 높음·데이터
유실). 손 B가 `utils.js`·`scraps-import.js`·`scraps-render.js`·
`scraps-form.js`·`properties.js`로 B-83 작업 중이라 `state.js`·
`boot.js` 외 무접촉 — `state.js` 1파일만 수정, `boot.js`는 안 건드림
(기존 `pagehide`/`visibilitychange`가 뷰 상태 저장용으로 이미 있어
그대로 두고, `state.js`에 별도 리스너를 추가로 등록해 둘 다 실행되게
함 — 이벤트 리스너는 여러 개 등록해도 서로 방해 없이 전부 실행됨).

### 문제 확정(감사 발견 그대로)

`save()`는 localStorage 즉시 + Redis 800ms 디바운스인데, 페이지
이탈(`pagehide`) 시 아무 flush가 없었음(`boot.js`의 기존 리스너는
`sh_lastView`만 저장) — 마지막 편집 후 800ms 안에 탭을 닫거나
당겨서 새로고침하면 그 편집은 Redis에 영영 반영 안 됨(localStorage엔
남아있어 기기 안에서는 안 사라지지만, 다른 기기·재로그인 시 최신
내용을 못 받음). 추가로 `save()` 연타 시 `clearTimeout`이 매번
리셋돼 손실 창이 800ms를 넘어 무한정 늘어날 수 있었음(예: 10초간
연속 타이핑하면 그 10초 내내 Redis엔 아무것도 안 감).

### 구현

1. **이탈 시 즉시 flush** — `flushPendingSync()` 신설, `pagehide`+
   `visibilitychange`(hidden) 둘 다에 등록. 대기 중인 디바운스 타이머
   (`syncTimer`)가 있을 때만 동작 — 없으면(이미 동기화됐거나 변경
   없음) 아무 것도 안 함. Bearer 토큰 헤더가 필요해 `sendBeacon()`은
   못 쓰고 `fetch(url,{keepalive:true,...})` 사용.
2. **미동기 플래그(B-80 대비)** — keepalive 요청은 본문 64KB 제한이
   있어 사진 포함 state는 실패할 수 있고, 페이지가 사라지는 도중이라
   응답을 못 받을 수도 있음 — 그래서 순서를 "먼저 미동기로 표시하고
   (`markUnsynced()`, `localStorage.sh_unsynced='1'`), 성공 응답을
   실제로 받았을 때만 지움(`clearUnsyncedFlag()`)"으로 짜서 실패를
   조용히 삼키지 않게 함(응답을 못 받고 페이지가 죽으면 플래그가
   그대로 남아 있는 게 안전한 기본값). `syncToRedis()`(기존 800ms
   디바운스 경로)도 동일한 성공/실패 기준으로 같은 플래그를 갱신 —
   플러시든 일반 디바운스든 "마지막 시도 결과"를 하나의 신호로 통일.
   이번엔 플래그를 정확히 남기는 것까지만 — 사람이 보는 표시(예:
   재로그인 시 배너)는 B-80에서 이 플래그를 소비해 구현할 예정.
3. **디바운스 maxWait** — `SYNC_DEBOUNCE_MS=800`(기존 값 무변경)에
   `SYNC_MAX_WAIT_MS=5000` 추가. `save()`가 처음 호출된 시각
   (`syncBurstStartedAt`)을 기준으로 경과 시간을 계산해, 5초가
   넘었으면 다음 타이머 지연을 0(즉시)으로, 아직이면
   `min(800, 5000-경과)`로 계산해 디바운스가 계속 리셋돼도 최초 편집
   기준 5초를 넘겨 밀리지 않게 함. 타이머가 실제로 발화하면
   `syncTimer`/`syncBurstStartedAt`을 `null`로 되돌려 다음 `save()`가
   새 버스트로 인식하게 함(이전엔 `syncTimer`가 발화 후에도 만료된
   ID를 계속 들고 있어 "대기 중" 여부를 정확히 판별할 수 없었음 —
   이번에 같이 정리).

### 검증(Playwright, `/api/state` 라우트 모킹 — 실제 PIN 없이 재현)

- **일반 흐름 무회귀**: `save()` 1회 → 정확히 800ms 후 POST 1건만
  발생(변경 없음 확인).
- **maxWait**: 300ms 간격으로 10초간 `save()` 연타 → POST가 정확히
  ~5005ms·~10157ms 시점에 발생(연타 중에도 5초마다 강제 전송 확인,
  총 2건 — 디바운스만 있었다면 마지막 호출 후 800ms인 ~10.3초 시점에
  1건만 발생했을 것).
- **이탈 flush**: `save()` 호출 후 800ms가 되기 전(100ms 시점)에
  `pagehide` 발생 → 즉시 POST 1건 발생 확인(디바운스를 기다리지
  않음), 요청에 `Authorization: Bearer` 헤더 정상 포함, 성공 응답
  후 `sh_unsynced` 플래그 정상 해제.
- **flush 가드**: 대기 중인 타이머가 없을 때(`save()` 미호출) 이탈
  이벤트 발생 → 불필요한 POST 없음(정확히 0건) 확인.
- **flush 실패 처리**: POST가 실패(네트워크 abort)하도록 모킹 →
  `sh_unsynced` 플래그가 정확히 설정됨 확인.
- **visibilitychange 경로**: `document.visibilityState`를 `hidden`
  으로 바꾸고 이벤트 발생 → `pagehide`와 동일하게 flush 동작 확인.
- `node --check js/state.js` 통과.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-84 완료**. `state.js` 1파일만 수정(+44/-5줄), `boot.js`·손 B의
B-83 대상 5개 파일 전부 무접촉(착수 전·커밋 전 매번 `git status`로
확인해 손 B 파일 스테이징 안 함). BACKLOG.md "코드 점검 발견" 섹션은
커맨드센터가 확인 후 정리할 차례. 다음 순번 B-80(저장 실패 표시)이
이번에 남긴 `sh_unsynced` 플래그를 소비할 예정.

---

## 2026-07-18 — URL 스킴 검증·이미지 속성·esc 방어 강화 (B-83)

- 규제뉴스 출처 URL을 열기 전에 공통 `safeUrl()`로 `http:`/`https:`
  스킴만 허용하고, 새 창에는 `noopener`를 적용했다. 기존
  `properties.js`의 `safeUrl()`은 로드 순서상 공통 유틸인 `utils.js`로
  옮겨 기존 호출부의 함수명과 동작을 유지했다.
- 매물 카드, 수집함 목록·갤러리, 수집함 입력 미리보기의 이미지
  `src` 보간값에 `esc()`를 적용했다. 정상 data URL 이미지는 그대로
  표시된다.
- 공통 `esc()`가 작은따옴표도 `&#39;`로 이스케이프하도록 보강했다.
- Playwright 데스크톱·390px 모바일 검증: 정상 뉴스 URL 열림,
  `javascript:` URL 차단, 매물·수집함 data URL 이미지 표시,
  `O'PARK` 텍스트 표시, 주요 탭 스모크 모두 통과.
- 대상 JavaScript 5개 파일 `node --check` 및 `git diff --check` 통과.
- 병행 작업 중인 `state.js`·`boot.js`는 수정하지 않았다.

**→ B-83 완료**. 보안 경계만 강화했으며 정상 입력의 기능 변화는 없다.

---

## 2026-07-18 — 매물 루트 메뉴 재오픈 리스너 수정 (B-87)

- 루트 메뉴의 document capture 리스너 참조를 메뉴 DOM 인스턴스에
  묶고, `closeRouteMenu()`의 모든 종료 경로에서 리스너를 먼저
  해제하도록 수정했다. 닫힌 메뉴의 옛 리스너가 새 메뉴를 닫는
  재오픈 버그와 지연 등록 경쟁 조건을 함께 제거했다.
- 같은 파일의 `⋯ 더보기` 메뉴도 동일하게 close 경로가 리스너를
  해제하지 않는 같은 원인이어서 동일 구조로 함께 수정했다.
- Playwright 데스크톱·390px 모바일에서 두 메뉴 각각
  열기→닫기→재열기→외부 클릭을 10회 반복해 즉시 닫힘이 없음을
  확인했다. 저장 루트 삭제 후 메뉴 재렌더와 새 루트 항목 동작도
  통과했다.
- `node --check js/properties.js` 및 `git diff --check` 통과.
- 병행 작업 중인 `state.js`·`utils.js`는 수정하지 않았다.

**→ B-87 완료**. 메뉴 동작 외 상태·스키마·스타일 변경은 없다.

---

## 2026-07-18 — applyGuards 배열 타입 가드 + 부수 가드 (B-86)

`BACKLOG.md` "코드 점검 발견" 섹션 B-86(감사 발견, 중·견고성). 손 B가
`properties.js`로 B-87 작업 중이라 `properties.js` 무접촉 —
`state.js` 1파일만 수정.

### 문제(감사 발견 그대로)

`applyGuards`의 핵심 배열 5종(actions·properties·complexes·listings·
scraps)은 `||[]`(또는 `||기본값`)만 있어 **falsy만 걸렀고 truthy
비배열(문자열·객체 오염)은 그대로 통과**시켰음 — 통과된 값에 뒤이어
`.map()`을 호출하는 순간 `TypeError`가 나 `applyGuards()` 자체가
중단되고 `renderAll()`도 실행 안 돼 **앱 전체가 빈 화면으로 멈춤**
(단일 실패점). 배열 가드는 milestones·owners·commuters·tags·imgs
에만 있고 이 5종엔 없었음.

### 구현

1. **배열 5종 가드** — 공용 헬퍼 `guardArr(val,fallback,label)` 신설.
   `Array.isArray`로 실제 검사해 아니면 안전한 기본값으로 대체(값이
   있는데 타입이 틀린 경우만 `console.warn` 1줄, 단순 누락은 정상
   케이스라 조용히 기본값 적용). `actions`는 기존처럼
   `DEFAULT.actions`(시드 3건)로, `properties`/`complexes`/
   `listings`/`scraps`는 기존처럼 `[]`로 폴백해 falsy 케이스의 기존
   동작은 그대로 유지 — truthy 비배열만 새로 막음.
2. **`settings.grades.area`/`households` 비배열 가드** —
   `calcAreaGrade`/`calcHouseholdGrade`(utils.js)가 `[g1,g2]=grades.area`
   처럼 배열 구조분해를 쓰는데, `grades.area`가 오염돼 있으면
   `Object.assign`으로 병합된 후에도 오염값이 그대로 남아 구조분해에서
   크래시 — `guardArr`로 동일하게 방어. utils.js 자체는 안 건드리고
   데이터가 이미 안전한 형태로 들어가게 `applyGuards`에서 막음.
3. **`listings[].safety[key]` 비객체 가드** — `{...safety[key],
   ...(l.safety&&l.safety[key])}`가 크래시는 안 나지만(문자열 스프레드는
   인덱스 키로, 숫자·불린 스프레드는 무시됨) 조용히 이상한 모양의
   객체를 만들 수 있어 — 객체(배열 제외)일 때만 병합하고 아니면 기본값
   유지, 오염 시 경고.
4. **`actions` priority 이관부 NaN 방지** — `Math.max(...state.actions
   .map(x=>x.priority))`가 priority 비숫자 항목 하나로도 NaN에
   오염되면 이후 `++p`로 이관되는 모든 prep/steps 항목이 `priority:NaN`
   이 돼 정렬이 깨짐 — 숫자인 priority만 필터링해 최댓값 계산, 하나도
   없으면 0.
5. **`milestone.label` 누락·오염 보정** — `ai.js`의 `profileLine()`이
   `m.label.includes(...)`를 호출하는데 `label`이 없거나 문자열이
   아니면 크래시. **`ai.js`는 건드리지 않고** `applyGuards`에서
   milestone마다 `label`을 문자열로 강제(누락은 조용히 `''`, 값이
   있는데 타입이 틀리면 경고 후 `''`).

가드 원칙은 "대체 후 유지"만 — 오염 데이터를 그대로 화면에 흘려보내지
않되, 조용히 삭제하지도 않고 `console.warn` 1줄로 원인 추적 가능하게
남김(자동 정리·알림 UI는 범위 밖).

### 검증(Playwright, 73개 체크)

- **배열 5종 × 오염 3종(문자열/객체/null) = 15개 시나리오**: 전부
  `applyGuards` 무크래시, 필드가 정확히 배열로 복구, truthy 오염
  (문자열·객체)일 때만 `console.warn` 발생(null은 정상 누락이라
  무경고), 페이지 레벨 미처리 예외 없음 확인.
- **grades 오염**: `area`/`households`를 객체·문자열로 오염 → 무크래시,
  `calcAreaGrade`/`calcHouseholdGrade` 정상 호출 확인.
- **safety 오염**: `moveInReport`를 문자열로, `fixedDate`를 배열로
  오염 → 무크래시, 기본 `{status:'unchecked',memo:'',source:'',
  checkedAt:''}` 형태로 정확히 복구 확인.
- **priority 오염**: 비숫자 priority 액션 + 미이관 prep/steps 존재 →
  무크래시, 이관된 항목의 priority가 NaN 아닌 유효 숫자(1) 확인.
- **milestone 오염**: label 누락 1건 + 숫자로 오염된 1건 + 정상 1건
  혼재 → `applyGuards`+`profileLine()`+`chatChips()` 전부 무크래시,
  누락·오염 항목은 `''`로, 정상 항목("결혼식")은 그대로 보존 확인.
- **라운드트립 무손실**: 정상적으로 구성된 전체 state(프로필·자산·
  설정·액션·단지·수집함 등)를 `applyGuards`에 통과 → 순서 무관 깊은
  비교로 완전히 동일(코드가 `{...defaults,...원본}` 스프레드 패턴을
  써서 키 순서만 바뀌는 것은 실제 데이터 손실이 아님을 확인 후 순서
  무관 비교로 검증).
- **전 탭 스모크**: 5개 필드+grades+milestones를 한 번에 전부 오염시킨
  state로 `applyGuards`+`renderAll()` → 대시보드·자산·매물·액션·
  수집함 5개 탭 전부 전환 시 실제 콘텐츠가 정상 렌더(빈 화면 아님),
  전체 과정에서 미처리 예외 없음 확인.
- `node --check js/state.js` 통과, `state.js` 1파일만 diff(+42/-7줄).
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-86 완료**. `properties.js` 무접촉 준수(손 B의 B-87과 파일
무충돌 병렬 진행, 착수 전 `git status` 확인 — B-87은 이미 커밋 완료
상태였음). BACKLOG.md "코드 점검 발견" 섹션은 커맨드센터가 확인 후
정리할 차례. 착수 순서상 다음은 B-80·B-88·B-89.

---

## 2026-07-18 — 수집함 배치 임포트 ID 충돌 방지 (B-88)

- 수집함 배치 임포트에서 기존 시간+랜덤 ID 뒤에 배치 내 증가
  시퀀스를 추가했다. 기존 ID 접두와 구성은 유지되며 기존 저장
  데이터에는 영향을 주지 않는다.
- Playwright 데스크톱·390px 모바일에서 30행 임포트를 3회 실행해
  생성된 90개 ID가 모두 유일함을 확인했다. 기존 스크랩 수정·삭제
  동작도 통과했다.
- `node --check js/scraps-import.js` 및 `git diff --check` 통과.
- 병행 작업 중인 `state.js`·`auth.js`·`api/state.js`는 수정하지
  않았다.

**→ B-88 완료**. 임포트 데이터 내용과 화면 동작 변경은 없다.

---

## 2026-07-18 — 프로덕션 CORS localhost 허용 제거 (B-89)

- 배포 도메인 허용 목록은 유지하고, `http://localhost` 오리진은
  `VERCEL_ENV !== 'production'`인 로컬·프리뷰 환경에서만 허용하도록
  제한했다. 완전한 localhost 오리진 형식을 검사해 접두가 비슷한
  외부 호스트는 허용하지 않는다.
- CORS 단위 검증: 프로덕션 배포 도메인 허용, 프로덕션 localhost
  거부, 개발 환경 localhost 허용, 유사 악성 호스트 거부, Origin 없는
  게스트·로컬 파일 경로의 기존 처리 유지 확인.
- Playwright 데스크톱·390px 모바일에서 게스트 진입과 전체 탭 스모크
  통과.
- `node --check api/_auth.js` 및 `git diff --check` 통과.
- 병행 작업 중인 `state.js`·`auth.js`·`api/state.js`는 수정하지
  않았다.

**→ B-89 완료**. 배포 도메인과 앱 기능에는 변경이 없다.

---

## 2026-07-18 — 저장 실패·미동기·만료 상태 표시 (B-80, 커밋 2개)

원칙: 실패·미동기를 **드러내기만** 한다. 자동 삭제·자동 압축·자동
복구는 하지 않는다.

**커밋① (`js/state.js`·`index.html`·`style.css`)**
- `localStorage.setItem` 실패(`save()` 내 `catch`)를 조용히 삼키지
  않고 동기화 칩을 새 `localfail` 상태로 반영, 콘솔 warn에 실패한
  state의 크기(KB)를 포함해 원인 추적을 돕는다. Redis 동기화는 로컬
  저장 성공 여부와 무관하게 그대로 시도(로컬이 실패했다면 Redis가
  유일한 백업이 되므로).
- B-84의 `sh_unsynced` 플래그를 `load()`에서 확인해, 플래그가 남아
  있으면(=지난 세션 변경분이 서버 반영 안 됐을 수 있음) 1회성 배너
  (`#unsyncedBanner`)를 노출한다. 실제 동기화 성공이 확인되면
  (`clearUnsyncedFlag()`) 플래그와 배너 모두 자동 해제. 배너 닫기
  버튼은 이번 표시만 숨기고 플래그 자체는 지우지 않는다(데이터가
  실제로 안전해진 게 아니므로).
- `syncToRedis()`가 401을 기존처럼 `local`로 뭉뚱그리지 않고 새
  `expired` 상태로 분리, `load()`의 401 처리와 동일하게 기존
  `forceLogin()`을 재사용해 로그인 오버레이를 다시 띄운다(`auth.js`는
  무수정 — 기존 함수 재사용만으로 충분했음). 413도 별도 `toolarge`
  상태로 분리.
- `style.css`는 기존 `.chip-warn`과 동일한 경고 색(`#fff3cd`/
  `#856404`)을 재사용, 새 CSS 변수·파일 없음.

**커밋② (`api/state.js`)**
- POST body(state) 크기 상한 4MB 추가. 초과 시 413 + 크기·상한을
  명시한 에러 메시지 반환, 구조 검증은 최소(객체 여부)만 유지(과검증
  금지 지시 준수). 클라이언트는 이를 `toolarge` 상태로 표시.

**검증 (Playwright, 데스크톱 1280px + 모바일 390px, 총 24개 체크
전부 통과)**
- `localStorage.setItem` 모킹 실패 → `localfail` 칩 + KB 포함
  console.warn 확인.
- `sh_unsynced` 플래그 있는 상태로 `load()` → 배너 노출, 이후 정상
  동기화 성공 시 플래그 해제 + 배너 자동 숨김 확인.
- 세션 중 401 모킹 → `expired` 칩(기존 `local`이 아님) + 로그인
  오버레이 재노출 + 저장된 토큰 삭제 확인.
- 413 모킹 → `toolarge` 칩 + 용량 안내 메시지 확인.
- 정상 흐름(200 응답) → POST 정확히 1회, 칩 최종 `ok` 상태로 무회귀
  확인.
- `node --check js/state.js`·`node --check api/state.js` 통과,
  `style.css`는 브레이스 균형·중첩 깊이 확인(기존 `:root` 중첩 패턴
  그대로 따름, 신규 미디어쿼리 없음).
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.
- 서버 413 분기는 로컬에 Redis 자격 증명이 없어 실제 배포 핸들러
  end-to-end 대신 (a) 크기 계산 경계값 검증 (b) 문법 검사 (c) 클라
  측 413 응답 처리 전체를 모킹으로 검증하는 방식으로 대체.

**→ B-80 완료**. `js/auth.js`는 지시에 수정 가능 파일로 포함됐으나
기존 `forceLogin()` 재사용만으로 충분해 무수정. `scraps-import.js`·
`api/_auth.js`는 손 B의 B-88·B-89 작업 파일이라 무접촉 준수(작업
착수 전 확인한 시점에 이미 커밋 완료 상태였음).

---

## 2026-07-18 — CLAUDE.md(SSOT) 스키마·저장·인증 서술 갱신 (B-82, 문서만)

코드 무변경 — `CLAUDE.md`만 수정. 실코드(주로 `js/state.js` 상단
JSDoc, `js/auth.js`, `api/state.js`)를 진실의 원천으로 두고 문서
서술을 거기에 맞췄다.

- **상태 스키마 요약**: flat `state.properties[]` 단일 서술을
  2계층(`complexes[]`/`listings[]`) 기준으로 교체. 이번 트랙 신규
  필드 반영 — `listings[].safety`(9항목, 상태 3종), `complexes[].
  commutes`/`commuteMemo`(2인 기록, index 매칭), `scraps[].imgs`(+
  `img` 미러 규칙: imgs[0]과 항상 동기화되는 레거시 대표사진, 삭제·
  개명 금지), `settings.owners`/`commuters`. 레거시 `properties[]`는
  "E-01로 2계층 전환 완료·B-05 삭제 대기, 수정 경로 일부 아직
  활성(`properties.js:1002` saveBtn) — 신규 기능은 여기 손대지
  말 것"으로 명시.
- **Redis 키 표기**: 실제 서버 키 `'sweetyhome:state'`(`api/state.js`
  KEY 상수)와 localStorage 키 `'sweetyhome'`(`js/state.js` `save()`)를
  분리 명기 — 기존 문서는 `'sweetyhome'` 하나로 뭉뚱그려 혼동 소지가
  있었음.
- **저장 패턴**: B-84/B-80 반영 — 디바운스 800ms+maxWait 5s,
  이탈 flush(`flushPendingSync()`, keepalive), `sh_unsynced` 플래그
  (실패 표시 전용, 자동 복구 없음), 동기화 칩 6개 상태(`ok`/`local`/
  `offline`/`localfail`/`expired`/`toolarge`) 전부 나열, 서버 4MB
  상한(413) 명시.
- **주요 ID 레퍼런스 표**: 이번 트랙 3개 영역만 소량 보충 — 단지
  매칭 제안 모달(`cxMatchModal` 등, properties.js 동적 삽입), 단지
  상세 출퇴근(`cxDetailCommute`/`cxDetailCommutes`/
  `cxDetailCommuteMemo`), 통근 기준지 설정(`pf_commuter0/1_name/dest`).
  안전 체크는 ID가 아니라 class+data속성(`data-safekey`/`data-lid`)
  기반이라 그 패턴을 그대로 기록(억지로 ID화하지 않음). 과도한 확장
  자제 지시 준수 — 이 4행만 추가.
- **인증**: `sessionStorage sh_token` 서술을 `localStorage sh_token`+
  `sh_token_exp`(B-65)로 갱신, 서버 `api/_auth.js` SESSION_TTL과
  수동 동기화 필요하다는 점도 함께 명시.
- renderMd 방어범위 서술(B-64 갱신분)은 실측과 일치해 그대로 유지.

**검증**: 갱신한 모든 파일명·키·필드명·함수명을 실코드와 교차
확인 — `js/state.js` 상단 JSDoc(스키마), `js/auth.js`(setToken/
getToken/forceLogin 등), `api/state.js`(KEY 상수·MAX_STATE_BYTES),
`index.html`+`js/properties.js`(신규 ID 4행 grep으로 실존 확인).
문서만 변경이라 별도 코드 실행 검증 불필요.

**→ B-82 완료**. `CLAUDE.md` 1파일만 수정.

---

## 2026-07-18 — 매물 추가 흐름 파손 진단·수정 (B-90, 🔴 코어 파손)

### 진단

세 신고("추가해도 반영 안 됨"·"폼에서 스크롤 안 먹음"·"위치 자동찾기가
raw `{"ok":false}` 노출")를 하나씩 재현 시도. 지시서가 의심한 B-19확
(`696bdb7`, 단지 매칭 제안 모달) 자체의 콜백 누락은 **재현 안 됨** —
신규 단지/완전일치/후보 수락/후보 거절 후 신규/후보 취소/새로고침
영속성 6개 경로 전부 Playwright로 직접 실행해 매번 정확히 저장·표시·
콜백 호출됨을 확인(데스크톱+모바일 390px). **①은 데이터 유실이
아니라 표시(인지) 문제로 확정.**

실제 원인은 `saveAsComplexListing()`(properties.js)이 신규 단지의
좌표가 없을 때 `/api/geocode` 응답을 `await`로 기다린 뒤에야
`closeForm()`/`save()`/`renderProps()`가 실행되던 구조였다는 것.
이때 `saveBtn`은 disabled 처리도, "저장 중" 표시도 전혀 없어 —
- 지오코딩 API가 느리거나(레이트리밋 등) 응답이 늦으면 클릭 후 화면이
  몇 초간 아무 반응 없어 "추가해도 반영 안 됨"으로 보임
- 그 몇 초 동안 폼은 정상적으로(B-12 설계대로) 스크롤 잠금 상태를
  유지하는데, 사용자 입장에선 "먹통"처럼 보여 "스크롤 안 먹음"으로
  느껴짐
- 무엇보다 버튼이 계속 클릭 가능한 상태로 남아있어 **같은 매물을 두 번
  추가하는 실제 데이터 중복 버그**가 있었음 — 지오코딩 응답을 3초
  지연시킨 뒤 저장 버튼을 두 번 연타하는 시나리오로 재현: `listings`가
  1건이 아니라 2건 생성됨(중복확인 confirm까지 자동 수락되는 흐름)

③(raw JSON)은 현재 코드의 어느 경로에서도 **문자 그대로 재현되지
않음** — 추가 폼의 `findBtn`은 이미 실패 시 "못 찾음 — 지도 탭" 등
사람이 읽는 문구를 쓰고 있었음. 다만 매물 **수정** 모달의
`em_findBtn`은 실패 시 **완전히 무반응**(문구도 없이 조용히 원상
복구)이었음 — 클릭이 씹힌 것처럼 보이는 가장 가까운 실제 결함으로
보고 이를 신고의 실체로 보고 수정.

### 수정

`js/properties.js` 1파일만 수정, 스키마 변경 없음, 신규 접이식 UI
없음(지시 원칙 준수).

1. **지오코딩 비차단화** — `saveAsComplexListing()`에서 신규 단지
   좌표 조회를 `await` 대신 `.then()`으로 분리. 좌표 없이 먼저
   저장·폼닫기·렌더가 즉시 끝나고, 지오코딩은 백그라운드에서 계속
   진행해 성공하면 그때 `cx.lat/lng`를 갱신하고 `save()`+
   `renderComplexes()`+`refreshOverview()`로 반영. 실패해도 기존과
   동일하게 "좌표 확인 필요" 상태로 남음(자동 정리 없음).
2. **저장 버튼 진행 상태 표시** — `saveBtn.onclick`을 `try/finally`로
   감싸 클릭 즉시 `disabled=true`+"처리 중…" 표시, 성공·취소·에러
   어느 경로든 `finally`에서 항상 원복. 매칭 제안 모달이 사용자
   선택을 기다리는 동안에도 중복 클릭을 막는다.
3. **`em_findBtn` 실패 문구 추가** — 추가 폼의 `findBtn`과 동일한
   패턴으로 "못 찾음 — 지도 탭"/"검색 실패 — 지도 직접 탭" 표시 후
   1.6초 뒤 원복(기존엔 즉시 무언 복구).

### 검증(Playwright, 데스크톱 1280px+모바일 390px)

- 추가 4경로(신규 단지/기존 단지 완전일치/후보 제안 수락/후보 제안
  거절 후 신규) + 후보 제안 취소 경로까지 총 5경로 모두 저장 직후
  `state.complexes`/`state.listings`·`#complexSection` 카드 반영
  확인.
- 저장 직후 새로고침(POST로 캡처한 state를 GET이 그대로 반환하도록
  모킹) 시에도 단지·매물 존재 확인 — Redis 반영 경로 무손실.
- 지오코딩 응답을 3초 지연시켜도 폼이 거의 즉시 닫히고
  `body.style.position` 스크롤 잠금이 즉시 해제됨 확인(이전엔 3초
  내내 잠겨 있었음).
- 같은 지연 상황에서 저장 버튼 더블클릭 시 이전엔 매물이 중복
  생성됐으나, 수정 후엔 첫 클릭만으로 폼이 즉시 닫혀 2번째 클릭이
  아예 무효(버튼이 이미 안 보임) — 중복 생성 재발 안 함.
- 백그라운드 지오코딩이 나중에 성공(1초 뒤)하면 `cx.lat/lng`가
  올바르게 갱신됨을 확인.
- `em_findBtn` 실패 시 "못 찾음 — 지도 탭" 표시 후 정상 원복, 버튼
  disabled 상태 정리 확인.
- `node --check js/properties.js` 통과, `properties.js` 1파일만
  diff(+35/-16줄).
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.
- 테스트 환경 자체(가짜 네이버 지도 API 키)에서 발생하는 네이버 SDK
  내부 오류("Cannot read properties of null (reading 'box'/'forEach')",
  `oapi.map.naver.com` 자체 코드 내부)는 우리 코드 밖의 테스트 환경
  잡음으로 확인 — 실배포 키에선 발생하지 않음, 우리 수정과 무관.

**→ B-90 완료**. 다른 파일 작업자가 없다고 명시돼 `properties.js` 외
접촉 없음. 스키마 변경 없음(applyGuards 갱신 불필요). 저장 성공 시
사용자 인지(토스트)는 지시대로 B-93 범위로 남겨둠 — 이번엔 "실제로
반영되는 것"까지만.

---

## 2026-07-18 — 대시보드 액션 더보기 커서 보완 (B-96)

- 대시보드 액션 요약의 `더보기` 영역에 `cursor:pointer`를 추가해
  클릭 가능한 요소임을 마우스 커서로 명확히 표시했다.
- Playwright 데스크톱·390px 모바일에서 계산된 커서가 `pointer`인지,
  클릭 후 액션탭 활성화와 목록 표시가 정상인지 확인했다.
- `git diff --check` 통과. `style.css` 한 줄 외 코드 변경은 없다.
- 병행 작업 중인 `properties.js`는 수정하지 않았다.

**→ B-96 완료**.

---

## 2026-07-18 — 스크롤 아키텍처 진단 (B-94, 코드 변경 없음)

Playwright로 데스크톱 1440×900과 모바일 390×844에서 각 탭에 긴
콘텐츠를 넣고 document·panel·내부 목록의 `clientHeight`,
`scrollHeight`, `scrollTop`, computed `position/overflow/z-index`를
계측했다.

### 현재 스크롤 컨테이너 지도

| 영역 | 데스크톱 | 모바일 |
|---|---|---|
| 대시보드 | document 세로 스크롤 | document 세로 스크롤 |
| 자산 | document 세로 스크롤. 표 자체는 세로 컨테이너 아님 | document 세로 스크롤. 2열 카드 행이 페이지를 늘림 |
| 액션 | document 세로 스크롤 | document 세로 스크롤 |
| 수집함 | document 세로 스크롤. 필터·탭은 가로 overflow만 사용 | document 세로 스크롤. 필터·탭은 가로 overflow만 사용 |
| 매물 지도 | `#panel-props` 고정 높이+`overflow:hidden`; 좌측 `#complexSection`과 레거시 `.rail`만 `overflow-y:auto`; 지도는 overflow hidden | `#panel-props`가 viewport fixed+overflow hidden, 지도 absolute; 단지 카드는 하단 `#complexSection` 가로 스크롤 |
| 매물 목록 | 데스크톱 지도형과 동일한 내부 세로 스크롤 | panel·`#complexSection` 모두 일반 흐름으로 돌아가 document 세로 스크롤 |
| 모달 | fixed overlay 안의 `.box`는 overflow hidden, `.mbody`만 세로 스크롤 | 동일. header/footer는 sticky 선언이 아니라 flex 비축소 형제로 고정 효과 |

### 상단 고정·높이·z-index

- `header`는 sticky가 아닌 일반 흐름이라 스크롤 시 사라진다. 실측
  높이는 데스크톱 47px, 모바일 86px.
- `.apptabs`만 `position:sticky; top:0; z-index:1001`로 남는다.
  실측 높이는 데스크톱 54px, 모바일 55px. 따라서 스크롤 전에는
  header+탭(콘텐츠 시작 y=약 145/179), 스크롤 후에는 탭 54/55px만
  남아 상단 점유 높이가 크게 바뀐다. 사용자가 느낀 “상단 고정영역이
  애매함”과 일치한다.
- 기준바 `.gates`는 sticky가 아니며 데스크톱 매물 panel 안에서
  비축소 영역으로 남는다. 모바일 지도에서는 숨고, 모바일 목록에서는
  현재도 숨은 상태다.
- 모바일 매물 목록의 `#cxListToolbar`는 global 탭 바로 아래
  `top:var(--nav-h)`에 별도 sticky(z=10)라 두 고정 바가 쌓인다.
- 모달 overlay는 z=1100으로 탭(1001)보다 위, 상태/더보기 picker는
  z=2000으로 모달보다 위, 토스트는 z=9999다. 겹침 순서는 의도적으로
  정의돼 있으나 picker와 modal을 동시에 열면 picker가 최상단이다.

### 확인된 문제 지점

1. **B-46 잔여 재현 — 최우선**: 데스크톱 매물에서 viewport 900px인데
   document `scrollHeight=953px`, 즉 바깥 페이지 스크롤이 53px
   남았다(기존 보고 34px와 같은 계열, viewport·현재 상단 높이에 따라
   변동). 동시에 `#complexSection`은 268px viewport 안에서 독립
   스크롤했고, 내부를 300px 움직여도 document는 0에 남았다.
   바깥 53px과 안쪽 목록이 휠 경계에서 전환되는 것이 직접적인
   “페이지/일부 리스트 경합”이다.
2. **원인**: `#panel-props`는 normal flow에서 실제 y=148px에
   시작하지만 높이는 `100vh - --topbar-h(105.5px) - 20px`로 별도
   좌표계에서 계산된다. `--topbar-h`는 `.apptabs`의 viewport bottom만
   담고, `.wrap` 상단 padding·panel 앞 실제 간격은 높이식과 일치하지
   않는다. 게다가 데스크톱 탭 margin은 현재 12px인데 높이식에는
   과거 상수 20px가 남아 있다. panel bottom이 viewport 아래로
   내려가면서 잔여 document scroll이 생긴다.
3. **문서형 탭 ↔ 매물탭 전환 시 스크롤 모델 변경**: 대시보드·자산·
   액션·수집함은 document 하나만 스크롤하지만 매물 데스크톱은 내부
   목록을 스크롤한다. 같은 휠 제스처의 대상과 스크롤바 위치가 탭마다
   달라 학습 비용이 있다.
4. **모바일은 지도/목록 모드도 모델이 바뀜**: 지도에서는 document
   maxScroll=0으로 완전 고정, 목록에서는 document 스크롤
   (계측 maxScroll=1149px)로 전환된다. 기능상 타당하지만 전환 시
   스크롤 위치·상단 바가 바뀌는 느낌을 명시적으로 관리해야 한다.
5. **모달은 구조적으로 정상**: `.mbody`를 300px 스크롤해도 document
   scrollTop은 그대로였고 head/footer 위치도 유지됐다. 다만 실제
   `position:sticky`가 아니라 flex 구조이므로 문서·주석에서 “sticky
   header”로 부르면 구현 오해가 생긴다.

### 후속 수정안과 예상 규모

1. **작은 수정, 우선 권장(B-46/B-94-a, 약 10~20줄)**:
   매물 진입·resize 때 `#panel-props.getBoundingClientRect().top`을
   기준으로 남은 viewport 높이를 계산하거나, 상위 `.wrap`을 매물
   활성 시 정확한 viewport flex shell로 만들고 panel은 `flex:1;
   height:auto`로 전환한다. 하드코딩 `20px` 보정은 제거한다.
   이후 데스크톱 document maxScroll=0을 회귀 기준으로 고정한다.
2. **작은 보완(약 2~6줄)**: 데스크톱 내부 목록
   `#complexSection,.rail`과 모달 `.mbody`에
   `overscroll-behavior:contain`을 적용해 끝점 휠 체이닝을 막는다.
   단, B-46 바깥 스크롤 제거가 먼저다.
3. **중간 구조 수정(B-53 연계, 약 30~70줄)**: header와 `.apptabs`를
   하나의 app topbar wrapper로 묶고 “둘 다 고정” 또는 “브랜드는
   사라지고 탭만 고정” 중 한 정책을 명시한다. 현재처럼 고정 높이가
   105~165px에서 54~55px로 도중 변하는 상태를 없애고, 단일
   `--app-top-h`를 매물·overlay·모바일 목록 toolbar가 공유하게 한다.
4. **대규모 재편(약 80~150줄+, 지금은 비권장)**: body를 잠그고
   공통 `.app-main` 하나를 모든 탭의 세로 스크롤 컨테이너로 만드는
   app-shell 방식. 탭별 스크롤 복원, pull-to-refresh, 모바일 키보드,
   지도 fixed/모달까지 재검증해야 해 현재 증상에는 과하다.

**판정**: 먼저 B-46 높이 좌표계 일원화+overscroll 차단을 작은 후속
작업으로 하고, 상단 고정 감각은 B-53에서 topbar wrapper로 정리하는
2단계가 위험 대비 효율적이다. 전 탭 app-shell 재작성은 두 수정 후에도
실사용 불편이 남을 때만 검토한다.

**→ B-94 진단 완료**. `properties.js` 포함 제품 코드는 변경하지 않았다.

---

## 2026-07-18 — 매물 수정모드 전환 + 자동찾기·자동채우기 (B-91+B-92, 커밋 2개)

신규 UI 원칙([[avoid-collapsible-hidden-features]]) 적용 1호 — 접기로
숨기지 않고 명시적 버튼·모드 전환으로 대체. `js/properties.js`(+
`index.html` 1줄, B-92만)만 수정, `style.css`는 손 B가 B-96으로 작업
중이라 무접촉(기존 `.paste`/`.btn-fill`/`.btn-find`/`.c-actions`
클래스만 재사용, 신규 CSS 없음). 스키마 변경 없음.

**커밋① B-91(`fefb0ec`)** — 매물 행의 B-63 접이식("매물 정보 수정
펼치기/접기")을 제거하고, 항상 보이는 "수정" 버튼(`c-actions`)으로
교체. 클릭 시 6필드(dongHo·areaM2·areaText·deposit·listingStatus·
memo) 입력폼이 나타나고, "저장"/"취소" 명시 버튼으로 종료.
- 값은 "저장" 클릭 전까지 `listing` 객체에 전혀 반영되지 않는다 —
  입력 필드(DOM) 자체가 버퍼이고, "취소"는 그냥 재렌더해서 DOM을
  폐기할 뿐이라 원본 데이터는 손대지 않는다(값 무손실 보장).
  기존 `change` 이벤트 즉시저장 방식을 제거하고 명시적 저장으로
  전환.
- `cxListingEditExpanded`(펼침 Set) → `cxListingEditMode`(편집 진입
  Set)로 개명, 의미 자체가 "펼침"에서 "편집 중"으로 바뀜.
- 안전 체크(B-27-lite) 아코디언·관리비 tri-state·대표매물/게시중확인/
  사라짐처리/가격변동기록/URL열기/삭제 버튼은 범위 밖 — 전부 그대로
  유지(코드 무변경 확인).

**커밋② B-92(`7bbb381`)** — ADD 폼에만 있던 위치 자동찾기·정보
자동채우기를 수정모드에도 연결.
- **정보 자동채우기**: B-91 편집폼 안에 붙여넣기 텍스트영역(`.paste`
  재사용) + "정보 자동 채우기" 버튼 추가. ADD 폼 `fillBtn`과 동일하게
  정규식 파싱(`parseNaver`) 우선, 실패 시 AI(`claudeAPI`) 폴백.
  대상은 보증금·전용면적·메모 3필드(파싱이 신뢰성 있게 뽑는 값만 —
  dongHo/areaText/listingStatus는 자동채우기 대상 아님). ADD 폼과
  달리 필드에 이미 값이 있을 수 있어 **덮어쓰기 전 `confirm()`으로
  변경 내역을 보여주고 확인**(조용히 덮어쓰기 금지, 기록 보존 원칙)
  — 값은 여전히 DOM에만 반영, "저장"을 눌러야 실제 반영.
- **위치 자동찾기**: 매물이 아니라 **단지**(`complexes[]`) 소유
  필드라(listings엔 lat/lng 없음) 단지 상세 지도의 "좌표 확인
  필요"(`#cxDetailNoCoord`) 오버레이에 재검색 버튼을 추가 —
  기존엔 정적 문구만 있고 고칠 방법이 없던 갭. B-90에서 확립한
  패턴(진행 표시·실패 시 사람 문구·지오코딩 실패가 다른 동작을 막지
  않음) 그대로 재사용. 단지는 이미 저장된 상태라 성공 시에만 즉시
  `cx.lat/lng` 반영+재렌더(실패는 표시만, 자동 재시도 없음).

**검증**(Playwright, 데스크톱 1280px+모바일 390px, 총 51개 체크
전부 통과):
- 수정 버튼 상시 노출 확인, B-63 구 아코디언(`[data-edittoggle]`)
  완전 제거 확인.
- 수정→저장 왕복: dongHo·deposit·memo 등 값이 정확히 반영, 읽기
  화면에 즉시 표시.
- 수정→취소 왕복: 입력만 바꾸고 취소 시 원본 `listing.dongHo` 등
  완전 무손실 확인(값이 실제로 안 바뀜).
- 자동채우기: 빈 필드는 확인 없이 채움 / 이미 다른 값이 있는 필드는
  `confirm()` 발생 확인 → 거부 시 필드 불변, 수락 시 새 값 반영
  각각 검증.
- 위치 자동찾기: 좌표 없는 단지에서 버튼 노출 확인, 실패 시 "못 찾음
  — 주소를 확인해주세요" 표시 후 1.6초 뒤 원복, 성공 시 `cx.lat/lng`
  갱신+오버레이 자동 숨김 확인.
- 회귀 확인: B-90 매물 추가 흐름(복합단지+매물 생성) 무회귀, B-27-lite
  안전 체크 아코디언 펼침/접힘 동작 무변경, 대표매물 칩·관리비
  tri-state 컨트롤 무변경.
- `node --check js/properties.js` 통과.
- 커밋 분리를 위해 B-92 코드를 임시로 제거한 B-91 단독 버전으로도
  별도 5개 체크(수정→저장 단독 동작, B-92 요소 부재 확인) 통과 후
  커밋, 이어서 B-92 코드를 복원해 전체 51개 체크 재확인 후 커밋 —
  두 커밋 모두 각자 단독으로도 정상 동작함을 실측 확인.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-91+B-92 완료**. `style.css` 무접촉(손 B의 B-96과 파일 무충돌).

---

## 2026-07-18 — 매물탭 높이 좌표계 일원화·스크롤 복구 (B-98)

- 데스크톱 매물탭 진입·resize 때 `#panel-props`의 실제
  `getBoundingClientRect().top`을 문서 좌표로 정규화해
  `--props-panel-top`에 기록하고, 높이를
  `100dvh - --props-panel-top`으로 계산하도록 변경했다. 기존
  `--topbar-h - 20px` 조립식 보정은 제거했다.
- panel fade 애니메이션 중간값이 높이에 들어가지 않도록
  `animationend`에서 최종 top을 다시 측정한다. 매물 활성 데스크톱
  `.wrap`은 `height:100dvh; overflow:hidden`인 viewport shell로
  제한해 document 자체의 잔여 스크롤도 없앴다.
- `#complexSection`, `.rail`, `.modal .mbody`에
  `overscroll-behavior:contain`을 적용했다.
- 데스크톱 추가 폼이 열리면 좌측 grid section이 세로 스크롤을
  담당한다. 모바일 fixed 지도 모드는 기존 하단 시트의
  `overflow-y:auto`를 유지하면서 `80dvh`, overscroll contain,
  momentum scroll을 명시했다.

### 검증

- Playwright 데스크톱 1440×900: document maxScroll **0px**,
  panel top 144.5px, panel bottom **900px** 실측.
- 데스크톱 추가 폼: 좌측 section `clientHeight=693`,
  `scrollHeight=1191`, 498px 스크롤 후 저장 버튼 bottom=820.5px로
  viewport 안 도달.
- 모바일 390×844 지도 모드: document maxScroll 0. 추가 폼
  `clientHeight=673`, `scrollHeight=1281`, 608px 스크롤 후 저장 버튼
  bottom=829.3px로 viewport 안 도달.
- 양쪽 모두 폼 개폐와 프로필 모달 개폐 통과. 모바일 지도↔목록 모드
  왕복 통과.
- 세 대상의 computed `overscroll-behavior=contain` 확인.
- `node --check js/nav.js`, `git diff --check` 통과.
- 병행 작업 대상 `properties.js`는 수정하지 않았다.

**→ B-98 완료**. 스키마·저장 데이터 변경 없음.

---

## 2026-07-18 — 위치찾기 근본 수리: 검색 API 폴백 + 재검색 상시화 (B-99, 커밋 2개)

⚠️ **좌표 스케일 실측 관련 중요 고지**: 지시서는 "문서 신뢰 말고 실측
확인"을 요구했으나, `vercel env pull`로 프로덕션 시크릿을 로컬에
받는 시도가 세션 안전장치(classifier)에 의해 차단됐다(우회 시도 안
함 — 프로덕션 시크릿을 로컬 디스크에 내려받는 건 정당한 차단으로
판단). 실제 `/api/geocode` 엔드포인트는 Bearer 인증이 걸려 있어
실PIN 없이는 호출 자체가 불가능하다(게스트 모드는 서버 호출을 아예
안 함). 따라서 mapx/mapy 스케일은 **네이버 검색(Local) API v1의
공개 문서화된 동작**(경도/위도 × 10^7 정수, WGS84)에 근거해
구현했고, 이 가정이 틀리더라도 잘못된 좌표가 조용히 반영되지 않도록
**대한민국 좌표 범위(위도 32~39, 경도 124~132) 밖이면 실패 처리하는
방어선**을 넣었다. 실단지 커버리지 표(가양6단지 등)는 로그인된
실사용자만 만들 수 있어 **이번엔 채우지 못했다** — 배포 후 실제
단지 검색으로 사용자가 직접 확인해 달라는 요청을 남긴다.

**커밋① `api/geocode.js`(`593c2e9`)**
- 기존 Geocoding API가 실패하면 네이버 검색(Local) API로 2차 시도.
  헤더 `X-Naver-Client-Id`/`X-Naver-Client-Secret`은 요청 헤더에만
  실어 보내고 URL·로그·응답 어디에도 노출하지 않는다(격리 테스트로
  URL에 시크릿이 안 섞이는지 확인).
- 검색 폴백은 원 쿼리 그대로 1회 → 실패 시 시/도·구/군·동/읍/면/리
  접두 토큰을 반복 제거한 "단지명만" 쿼리로 1회, 총 2회 상한
  (예: "서울 강서구 가양동 가양2단지성지" → "가양2단지성지").
- 응답 계약은 `{ok, lat, lng, address}`로 기존과 동일 — 프론트
  `geocode()`(properties.js)는 무변경으로 그대로 동작.
- address는 검색결과 첫 항목의 title(`<b>` 태그 제거)+roadAddress
  조합.
- 기존 Bearer 인증(`verifySession`)·레이트리밋 가드는 그대로 유지,
  구조 변경 없음.

**커밋② `index.html`+`js/properties.js`(`a073fad`)**
- `#cxDetailFindLocBtn`을 `#cxDetailNoCoord`(좌표 없을 때만 뜨는
  오버레이) 안에서 꺼내 단지 상세에 상시 노출되는 "위치 재검색"
  버튼으로 승격(신규 UI 원칙, [[avoid-collapsible-hidden-features]]
  — B-92의 "좌표 없을 때만" 조건부 노출을 확장).
- 좌표가 이미 있는 상태에서 재검색이 **다른** 좌표를 찾으면 조용히
  덮어쓰지 않고 `confirm()`으로 기존/신규 좌표를 보여준 뒤에만 반영
  (B-92 자동채우기와 동일한 기록 보존 원칙). 재검색 결과가 기존과
  사실상 같으면(오차 1e-6 이내) 확인 없이 통과(불필요한 팝업 방지).
  좌표가 아예 없던 경우는 지금까지처럼 즉시 반영.
- B-90 패턴(진행 표시·비차단·실패 문구) 그대로 유지.
- **부수 발견·수정**: 버튼이 상시 노출로 바뀌면서 기존 B-92 코드의
  잠재 버그가 드러났다 — 성공 경로에서 버튼의 disabled/텍스트를
  원복하는 코드가 없었는데, 예전엔 성공하면 오버레이 자체가
  `display:none`돼 버튼이 같이 숨어 버그가 안 보였을 뿐이었다. 이제
  상시 노출이라 원복이 빠지면 첫 성공 후 버튼이 "찾는 중…" 상태로
  영구히 잠긴다 — 성공 경로에도 원복을 추가해 해결(재현·회귀 테스트로
  확인).

**검증**(로컬 Playwright 데스크톱 1280px+모바일 390px 18개 체크 +
고립 로직 유닛테스트 12개 + 좌표 없음 경로 4개, 총 34개 자동 체크
전부 통과 — 배포 전 로컬 범위):
- (격리 유닛테스트, `fetch` 모킹) Geocoding 성공 시 폴백 미호출·
  Geocoding 실패→검색 폴백 원쿼리 성공·원쿼리도 실패→단지명만 폴백
  성공(최대 2회 상한 확인)·대한민국 범위 밖 좌표 방어 거부·전체
  실패 시 깨끗한 `ok:false`·검색 API 키 미설정 시 안전하게 스킵·
  키/시크릿이 요청 URL에 안 섞임(헤더 전용) 확인.
- (Playwright) 위치 재검색 버튼이 좌표 있어도 상시 노출·라벨 "위치
  재검색" 확인. 동일 좌표 재검색 시 confirm 생략, 다른 좌표 발견
  시 confirm 발생→거부 시 무손실→수락 시 반영 각각 확인. 좌표 없던
  단지의 첫 검색은 confirm 없이 즉시 반영 확인. 성공 후 버튼
  재사용 가능(재활성화) 확인.
- B-90 매물 추가 흐름·B-91/92 수정모드 진입 무회귀 확인.
- `node --check api/geocode.js`·`node --check js/properties.js`
  통과.
- 로컬 python 테스트 서버·Playwright/유닛테스트 스크립트는 레포
  바깥 scratchpad에서만 실행, 세션 종료 전 전부 삭제.
- 손 B가 B-93(전역 토스트)으로 `js/utils.js`·`actions.js`·
  `assets.js`·`profile.js`·`scraps-form.js`를 동시 작업 중이라
  작업 착수 전·커밋 직전 매번 `git status` 확인, 5개 파일 전혀
  건드리지 않고 스테이징도 안 함(`api/geocode.js`·`index.html`·
  `js/properties.js`만 단독 스테이징).

**→ B-99 완료(코드), 실단지 커버리지 실측은 미완**. push는
검증 완료 후 진행. **사용자 확인 요청**: 배포 후 "가양6단지"를
포함해 현재 좌표 없는 단지들에 재검색을 실행해 성공 여부를 알려
주시면 커버리지를 HISTORY에 추가 기록하겠음.

---

## 2026-07-18 — 전역 토스트: 수집함·액션·자산·프로필 (B-93)

- `utils.js`에 공용 `toast(msg)`를 추가했다. 별도 `#appToast`를
  만들고 기존 `.prop-toast` 클래스를 그대로 재사용해 매물 전용
  `#propToast`·`showPropToast()`와 충돌 없이 공존한다. 연속 호출 시
  이전 타이머를 취소하고 마지막 호출로부터 3.5초 뒤 자동 소멸한다.
- 명시적 저장 결과가 바로 드러나지 않는 수집함 추가·편집 모달 저장,
  액션 추가, 자산 항목 추가·노트 저장, 프로필 저장에만
  `추가했어요`/`저장했어요`를 연결했다.
- 자산 행 편집은 별도 저장 버튼 없이 `input`/`change` 즉시 자동저장
  구조이므로 토스트 금지 조건에 따라 연결하지 않았다. 자산 목표·
  예비비 입력, 수집함/자산 타이핑·blur, 액션 완료 토글 등 자동저장·
  즉시 피드백 경로에도 토스트를 추가하지 않았다.
- 매물 전용 `showPropToast()` 통합은 후속으로 남겼고,
  `properties.js`·`api/`는 수정하지 않았다.

### 검증

- `node --check`: 변경 JS 5개 모두 통과. `git diff --check` 통과.
- Playwright 데스크톱 1440×900 + 모바일 390×844: 수집함 추가·
  편집, 액션 추가, 자산 추가·노트 저장, 프로필 저장의 토스트 표시
  전부 통과.
- 두 화면에서 `appToast`/`propToast` 동시 존재, 3.5초 자동 소멸,
  `position:fixed`, `pointer-events:none`, z-index
  `9999 > modal 1100`을 확인했다.
- 자산 행 타이핑·blur와 노트 타이핑만으로는 토스트가 나타나지 않는
  역검증을 통과했다.

**→ B-93 완료**. 저장 스키마 변경 없음.

---

## 2026-07-18 — 단지 정보 직접 편집 (B-100)

### 단지 상세 필드 전수 조사

- **기존 편집 가능**: 즐겨찾기, 주차 3상태, 출퇴근 2인·출퇴근 메모,
  단지 상태, 장점·단점·한줄 판단, 단지 메모. 좌표는 B-99의
  `위치 재검색`으로만 변경한다. 주간 확인은 대표매물의 확인시각을
  갱신하는 별도 액션이다.
- **표시 전용 → 이번에 직접 편집 추가**: 단지명(상세 제목), 주소
  (`loc`), 역, 노선, 준공연도, 세대수.
- **파생·소유권 분리로 직접 편집 제외**: `householdGrade`는 세대수에서
  계산, `geocodeQuery`는 단지명·주소에서 생성, `lat/lng`는 B-99
  재검색 소관이다. `commuteGangnam/commuteSinsa`는 B-61 이전 레거시
  표시로 보존하되 신규 출퇴근 2인 입력과 중복 UI를 만들지 않았다.
  `groupCode`·`regionGroup`·생성/수정시각은 상세 표시 대상이 아니다.

### 구현

- 단지 상세에 항상 보이는 `단지 정보 수정` 버튼을 추가했다. 편집
  진입 시 단지명·주소·역·노선·준공연도·세대수 입력과 명시적
  저장/취소가 나타난다. 접기 UI와 신규 CSS 클래스는 추가하지 않았다.
- 입력값은 DOM 자체가 버퍼다. 저장 전 `complexes[]`는 바뀌지 않고,
  취소하면 DOM만 폐기해 원본을 완전히 보존한다. 문자열은 `esc()`로
  속성 출력하고 읽기 화면은 `textContent`로 렌더한다.
- 준공연도·세대수는 빈 값=`null`, 숫자 `0`=실제 값으로 구분하며
  0 이상의 정수만 허용한다. 세대수 등급은 기존
  `calcHouseholdGrade()`만 호출해 재계산한다.
- 단지명 또는 주소 변경 시 기존 `buildGeocodeQuery()`로
  `geocodeQuery`를 재생성한다. 저장 전후 `lat/lng`는 건드리지 않아
  위치 변경은 계속 B-99 버튼으로만 이뤄진다.

### 검증

- Playwright 1440×900 + 390×844: 가양6단지의 빈 주소·역·노선·
  준공연도·세대수를 수정하고 저장/취소 왕복 무손실 확인.
- 숫자 `0 → null → 1992/1476` 왕복, 세대수 등급
  `소규모주의 → 빈 값 → 1000세대+` 확인.
- 단지명·주소 변경 후 검색어
  `서울 강서구 가양동 가양6단지` 재생성, 기존 좌표 완전 동일 확인.
- Redis 모킹 POST 뒤 GET 재로드에서 1992년·1476세대 유지 확인.
- B-91 매물 수정 취소, B-99 위치 재검색 버튼, B-19확 단지 완전일치,
  B-27-lite 안전 체크, 기존 주차·출퇴근·판단메모 UI 공존 확인.
- `node --check js/properties.js`, `git diff --check` 통과.

**→ B-100 완료**. 스키마·`style.css`·락 지정 5개 파일·`nav.js`
무변경. 다음 커밋 B-101 진행.

---

## 2026-07-18 — 붙여넣기 단지 정보 승격 제안 (B-101)

- `parseNaver()` 현행 구조화 결과를 조사했다. 단지 소유 필드 중
  직접 승격 가능한 값은 `loc`와 B-28에서 추가된 `parking`뿐이다.
  세대수는 현재 메모 조각과 체크 힌트로만 쓰이며 구조 필드가 아니고,
  역·노선·준공연도도 캡처하지 않는다. 지시대로 정규식·AI 프롬프트를
  억지로 확장하지 않았다.
- 추가 폼과 B-92 매물 수정모드 자동채우기 모두 주소·주차가 읽히면
  대상 단지에 승격을 제안한다. 기존 값이 다르면 한 confirm에
  `주소: 기존 → 신규`, `주차: 기존 → 신규` 변경 내역을 명시하고
  승인한 경우에만 반영한다.
- 주소가 비었거나 주차가 `unknown`인 기존 단지는 덮어쓸 기록이
  없으므로 confirm 없이 채운다. `parkingState='na'`는 명시 기록이라
  빈 값으로 보지 않고 변경 confirm 대상이다. 빈 필드와 기존값 변경이
  섞이면 빈 필드는 채우되 기존값 변경은 승인된 것만 반영한다.
- 추가 폼에서 대상 단지가 즉시 완전일치하면 자동채우기 시점에
  제안하고, B-19확 후보 선택이 필요한 경우에는 사용자가 대상 단지를
  확정한 뒤 제안한다. 같은 단지에는 한 번 처리한 승격을 저장 시
  반복 질문하지 않는다.
- 매물 DOM 필드를 먼저 채운 뒤 단지 승격을 처리한다. 따라서 승격
  거부는 보증금·면적·메모 자동채우기와 이후 매물 저장을 막지 않는다.
  단지 주소 승인 시 `buildGeocodeQuery()`만 갱신하며 `lat/lng`는
  계속 B-99 재검색 소관으로 보존한다.

### 검증

- Playwright 1440×900 + 390×844: 수정모드 승격 confirm 승인·거부,
  추가 폼 승격 거부 후 매물 정상 저장, 빈 주소·미확인 주차의
  무확인 채움 모두 통과.
- 승격 거부 뒤 매물 보증금·면적 DOM 채움 유지와 state 저장 전
  미반영, 승인 뒤 단지 주소·주차만 반영, 좌표 불변 확인.
- B-92 기존 매물값 덮어쓰기 confirm도 별도로 승인·거부해 새 승격
  confirm과 독립 동작 확인.
- Redis 모킹 POST→GET 재로드에서 승격 주소·주차 유지 확인.
- B-100 직접 편집 취소, B-91 매물 수정, B-99 재검색 버튼,
  B-19확 완전일치, B-27-lite 안전 체크와 공존 확인.
- `node --check js/properties.js`, `git diff --check` 통과.

**→ B-101 완료**. `properties.js`와 기록 문서만 변경. 스키마·
`index.html`·`style.css`·락 지정 5개 파일·`nav.js` 무변경.

---

## 2026-07-18 — 텍스트 서식 품질 전수 진단 (B-97 1단계, 코드 무변경)

`BACKLOG.md` B-97 에픽 1단계. B-64 진단(`79c6a86`)을 출발점으로
삼아 실제 `renderMd()`/`scAutoDetect()`를 Playwright에서 직접
호출·스크린샷으로 재현했다. **코드는 한 줄도 바꾸지 않았다** —
이 커밋은 `HISTORY.md` 진단 기록뿐이다.

### 작업 1 — 현행 텍스트 파이프라인 지도

| 입력 지점 | 요소 타입 | 저장 필드 | 서식 도구 | 렌더 지점 | renderMd 적용 |
|---|---|---|---|---|---|
| 수집함 입력폼 `sc_text` | `contenteditable` (`.sc-md-editor`) | `scraps[].raw` | 슬래시 커맨드+툴바+**라이브 마커 렌더**(포커스 중 `ceRender`, blur 시 `renderMd`로 클린 렌더) | 수집함 카드 list/gallery(`sc-card-raw`) | ✅(카드), blur 시에도 ✅ |
| 수집함 편집모달 `sem_text` | `contenteditable` (`.sc-md-editor`) | 동일(`raw`) | 동일(슬래시+툴바+라이브 렌더) | 동일 | ✅ |
| 매물 추가 `f_memo` | `<textarea>` | `listings[].memo`(신규 생성 시) | 툴바만(`mdWrap`/`mdLine`), **미리보기 없음** | **없음**(아래 참고) | 해당 없음(표시 지점 자체가 없음) |
| 매물 레거시 수정 `em_memo` | `<textarea>` | `properties[].memo` | 툴바만, 미리보기 없음 | 레거시 카드(`c-memo`) | ✅(B-75②로 수정 완료) |
| 매물 수정모드 listing memo(B-91) | `<textarea>`(툴바조차 없음) | `listings[].memo` | 없음 | **없음** — 읽기모드 어디에도 `l.memo` 표시 안 됨(export CSV 제외) | 해당 없음(표시 지점 자체가 없음) |
| 자산 노트 `a_notes` | `<textarea>` | `assets.notes` | 툴바+**명시적 "미리보기" 토글**(`an_previewToggle`→`an_mdPreview`) | 미리보기 토글 켰을 때만(같은 모달 안) | ✅(토글 시에만) |
| 임포트 붙여넣기 `sc_importInput` | 순수 `<textarea>` | (파싱 후 `scraps[].raw` 등으로 분해) | 없음(파서만) | 미리보기 표(`sc_importPreviewContent`) | 필드는 `esc()`만, 제목 수정 UI 없음(읽기 전용 표시) |
| 단지 pros/cons/memo/commuteMemo(B-38/B-61) | `<textarea>` | `complexes[]` 각 필드 | 없음 | 카드엔 `verdict`만 말줄임 `esc()` (설계상 "기록 전용", 서식 지원 대상 아님) | 범위 밖(의도적 미지원) |

**핵심 관찰**: 서식 도구 성숙도가 필드마다 4단계로 갈린다 —
① `contenteditable` 라이브 렌더(수집함 2곳, 가장 앞섬) ② 툴바+명시
미리보기 토글(자산 노트 1곳) ③ 툴바만·미리보기 없음(매물 메모
2~3곳, "쓴 대로 안 보이는" WYSIWYG 불일치) ④ 서식 도구 자체가
없는 순수 기록 필드(단지 pros/cons 등, 의도적). **listings[].memo
(B-91 신규)는 ③에도 못 미친다 — 저장은 되는데 읽기 화면 어디에도
다시 나타나지 않는 표시 누락**(서식 문제 이전에 렌더 지점 자체가
없는 별도 결함, B-97 범위 밖 후속 버그로 분리 제안).

### 작업 2 — 실깨짐 재현 매트릭스 (Playwright로 `renderMd()`·`scAutoDetect()` 직접 호출 + 카드 스크린샷)

| 샘플 | `renderMd()`(카드 표시) | `scAutoDetect()`(임포트) | 판정 |
|---|---|---|---|
| ①네이버 매물 설명(`#태그` `-`목록 `>`인용 혼재) | 헤딩 오인식 **없음**(`#태그`처럼 `#` 뒤 공백 없으면 marked가 정상적으로 텍스트 취급 — 기존 우려와 달리 안전) / 목록·인용은 정상 파싱되나 **"인용 줄 바로 위가 목록 줄"이면 인용이 앞 목록 항목 안에 중첩**(CommonMark "lazy continuation" 스펙 동작, blockquote가 list item 안으로 흡수) | `scFreeText` 폴백 정상(첫 줄이 실제로 제목다워 제목 추측 성공) | **애매**(스크린샷 확인 — 인용된 "전세 3억 5000"이 윗줄 불릿에 딸린 것처럼 들여써져 표시) |
| ②일반 메모 평문 | 그대로 문단(`<p>`)만 생성 | 정상 폴백 | **정상** |
| ③마크다운 의도(표·리스트·굵게·인용) | marked+DOMPurify **완전 정상 렌더**(`<table>`·`<strong>`·`<ul>`·`<blockquote>` 전부 의도대로) | 🔴 **표(`|`) 한 줄이라도 있으면 `scAutoDetect`가 무조건 표 파서로 확정** — 헤딩·굵게·리스트·인용 등 표 아닌 나머지 내용이 **통째로 유실**, 표 각 행이 낯선 개별 항목으로 쪼개짐(실측: `제목:이번주 후보 비교` 문단·리스트·인용 전부 사라지고 `{price:"4억", raw:"단지: A단지\n비고: 역세권"}` 식 파편만 남음) | **카드 표시는 정상, 임포트는 심각한 콘텐츠 유실**(신규 발견 — 아래 참고) |
| ④URL·이미지 혼합 | 링크·이미지·오토링크(`www.`) 전부 정상 렌더 | 정상 폴백(`raw` 그대로 보존) | **정상** |
| ⑤페이지 전체 복사(멀티라인) | 사이트 잡음(로그인·회원가입 등)까지 그대로 포함되고, `- 관리비`/`- 방향` 목록 뒤에 이어지는 연락처·공유 버튼 텍스트가 **직전 리스트 항목에 흡수**(①과 같은 lazy-continuation 원인) — 스크린샷으로 시각 확인, "매물문의"·"공유하기" 줄이 불릿 없이 들여써져 보임 | 첫 줄 "네이버부동산"(사이트 헤더)을 제목으로 오추측 — **B-77 원 신고와 정확히 일치하는 재현** | **깨짐**(①과 동일 근본 원인 + B-77 재확인) |

**B-76·B-77 매핑**: B-76(카드 마크다운 오인식)은 ①⑤에서
"lazy continuation으로 인용·후속 텍스트가 리스트 항목에 흡수"로
구체화됨(막연한 "#/-/> 오인식"보다 좁고 정확한 원인 — 헤딩 오인식은
실은 거의 발생하지 않음). B-77(임포트 자유텍스트 폴백)은 ⑤에서
그대로 재현. **③에서 발견한 "표 파서 최우선순위로 인한 콘텐츠
유실"은 B-76·B-77 어느 쪽에도 속하지 않는 신규 발견** — 사용자가
의도적으로 마크다운(표 포함)을 작성해 붙여넣을 때 가장 크게
터지는, 서식 의도가 뚜렷할수록 오히려 더 크게 깨지는 역설적인
버그라 우선순위가 높다.

**보안 재확인**: `renderMd()`의 DOMPurify 방어선을 B-64와 동일한
4종 payload(`<script>`·`onerror`·`javascript:`·`<svg onload>`)로
재실측 — B-83(`js/utils.js` `esc()`/`safeUrl` 강화) 이후에도
**전부 무력화 유지**, 회귀 없음.

### 작업 3 — 방향 비교

**A안: 마크다운 유지 + 에디터·렌더 개선**
1. **임포트 표 우선순위 버그 수정**(가장 시급·저위험) —
   `scAutoDetect`가 "일부 줄만 `|`를 포함해도" 표로 확정하는 현재
   조건(`/^\|.+\|/m.test(text)`)을 "비어있지 않은 줄의 대다수가
   표 형식"처럼 강화. 스키마 변경 없음, ~10~20줄.
2. **"원문 그대로 보기" 안전판** — 카드별 명시 토글(이미 있는
   펼치기 버튼 옆에 배치, 접기 아님 — UI 원칙 준수)로 마크다운
   오인식이 의심될 때 사용자가 직접 raw 텍스트를 확인·복사할 수
   있게. lazy-continuation은 CommonMark 스펙 동작이라 "완전
   근절"은 파서를 벗어나지 않는 한 불가능 — 안전판이 현실적 상한.
   ~15~30줄.
3. **매물 메모 3곳에 자산 노트 패턴(명시 미리보기 토글) 이식** —
   `f_memo`/`em_memo`/listing memo가 지금은 "쓴 대로 안 보이는"
   가장 낮은 성숙도(③번)에 머물러 있음. 기존 `an_previewToggle`
   패턴을 그대로 재사용(신규 UI 원칙 부합, 새 컴포넌트 없음).
   ~30~50줄(3곳 합산). listing memo는 읽기 표시 자체가 없는 별도
   결함이라 우선 표시부터 추가해야 미리보기 토글도 의미가 생김.
4. **임포트 제목 추측 개선** — 미리보기 표(`sc_importPreviewContent`)
   의 제목 셀이 현재 읽기 전용(`esc()`만) — 인라인 편집 가능하게
   바꾸는 것만으로 "추측 실패해도 확인 단계에서 즉시 고칠 수 있음"
   달성. 추측 로직 자체(사이트 잡음 첫 줄 스킵 등) 개선은 보너스.
   ~20~40줄.
- 위 4개 전부 **스키마 변경 없음, DOMPurify 정책 변경 없음**, 기존
  `marked.js`+`ceRender` 인프라 재사용. 한계: 완벽한 "의도 파악"은
  불가능 — 안전판(raw 보기)으로 관리하는 것이 현실적 목표.

**B안: 블록/리치 에디터 도입**
- 이미 `ceRender`/`ceRenderLine`(utils.js)이 **줄 단위 마커
  보존형 라이브 렌더**를 구현하고 있어(포커스 시 `**bold**`
  마커까지 보이는 반라이브 프리뷰) 완전 새 인프라는 아니지만,
  "진짜" 블록 에디터(드래그 재정렬, 선택 시 플로팅 툴바, 표
  시각 편집)로 가려면 두 갈래로 갈린다.
  - **(a) 저장 포맷은 마크다운 유지, 편집 UX만 고도화** — 사실상
    A안의 심화 투자(경계가 모호). 스키마·마이그레이션 리스크 없음.
  - **(b) 저장 포맷을 HTML/JSON으로 전환** — 기존 `raw`/`memo`/
    `notes` 문자열 필드 전부 마이그레이션 필요(Redis 기존 데이터,
    CSV 내보내기, AI 프롬프트가 전부 현재 plain string을 소비함).
    **DOMPurify 정책을 편집 시점에도 적용해야 해 XSS 표면이
    "저장 시점"까지 확대**(현재는 렌더 시점 1곳만 방어하면 됨) —
    지시서의 "renderMd+DOMPurify 방어선 우회 금지" 제약과 정면
    충돌 소지, 재설계 필요.
- **모바일 리스크**: B-66이 `.sc-md-editor`(contenteditable) 2곳
  에서만 iOS 확대 버그를 발견·수정했는데, B안은 `contenteditable`
  기반 필드를 지금의 2곳에서 전체(7곳 안팎)로 확대하는 방향이라
  같은 계열 iOS 이슈 재발 표면이 커진다. 특히 한글 IME 조합 입력과
  `contenteditable`의 상호작용은 브라우저별로 취약한 조합으로
  알려져 있어(이 앱은 UI·콘텐츠 전부 한국어) 추가 검증 부담이 큼.
- 예상 규모: (a) 중~대(150줄 이상, A안과 중복 투자), (b) 대형
  (스키마 마이그레이션+보안 재설계+전 필드 IME 재검증, 지금
  범위에는 과함).

**C안(하이브리드) 검토**: "노트류(단지 pros/cons·커밋메모 등
기록 전용 필드)는 지금처럼 단순 텍스트 유지, 서식 의도가 실제로
잦은 수집함·매물 메모에만 A안 투자 집중" — 이는 사실상 A안의
우선순위 재배열이지 별도 아키텍처가 아니다. 별도 C안으로 세울
근거 부족 — A안 커밋 순서(위 1→4)에 이미 반영돼 있다.

### 판정

"어떤 상황에서도 자연스럽게"를 충족하는 **최소 비용 경로는 A안**.
이미 갖춘 인프라(라이브 마커 렌더·명시 미리보기 토글·DOMPurify
방어선·marked GFM)를 그대로 살리면서 4개 저위험 커밋으로 이번에
발견한 구체적 결함(표 파서 콘텐츠 유실·lazy-continuation 흡수·
WYSIWYG 불일치 3곳·제목 추측 실패)을 순서대로 해소하는 편이,
스키마 마이그레이션·XSS 표면 확대·모바일 IME 리스크를 동반하는
B안(스키마 전환)보다 지금 규모에 명백히 맞다. B안은 A안 4개
커밋을 전부 마친 뒤에도 "쓴 그대로가 안 보인다"는 불만이 남을
때만 재검토 권장(B-94의 app-shell 재작성 판정과 같은 논리).

**2단계 커밋 단위 분해안(권장 순서)**:
1. `scraps-import.js` — 표 파서 오탐 조건 강화(콘텐츠 유실 버그
   수정, 최우선·최저위험)
2. `scraps-render.js`(+`style.css` 소량) — 카드별 "원문 그대로
   보기" 명시 토글
3. `properties.js` — `f_memo`/`em_memo`/listing memo에 미리보기
   토글 이식(자산 노트 패턴 재사용). listing memo는 읽기 표시
   자체를 먼저 추가해야 함(선행 결함)
4. `scraps-import.js` — 임포트 미리보기 제목 인라인 편집 가능화
   (+ 여지 있으면 첫 줄 추측 휴리스틱 보강)

### 검증 방법

- Playwright로 로컬 정적 서버 기동 후 게스트 모드 진입,
  `page.evaluate()`로 `renderMd()`·`scAutoDetect()`를 5개 샘플에
  직접 호출해 HTML/파싱 결과 실측. 수집함 카드에 샘플 2종을
  실제로 주입·렌더링해 펼치기 상태 스크린샷으로 lazy-continuation
  흡수를 시각 확인(①⑤).
- DOMPurify 방어선 4종 payload 재실측, B-64/B-83 이후 무회귀 확인.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.
- 이번 커밋은 `HISTORY.md`만 변경 — `js/`·`api/`·`style.css`·
  `index.html` 전부 무변경(`git status`로 확인). 손 B가 B-95
  설계 진단을 병행 중이었으나 이 역시 무변경 진단이라 파일 충돌
  자체가 발생하지 않음.

**→ B-97 1단계 진단 완료**. 방향 확정(A안 권장)과 2단계 커밋
분해안까지 제시 — 실제 착수는 사용자/커맨드센터의 방향 승인
후 별도 지시로.

---

## 2026-07-18 — 문서형 탭 레이아웃 설계 진단 (B-95 1단계, 코드 무변경)

제품 코드는 바꾸지 않고, 게스트 상태에 동일한 진단용 합성 데이터를
주입해 Playwright로 1440×900·1920×900·2560×900·390×844를
실측했다. 비교 조건은 자산 24행, 액션 24개(미완료 18+완료 6),
수집함 24개, 대시보드 5단계 여정·8단지·12매물이다. 추가 폼은 닫고
수집함은 기본 목록 보기로 통일했다. 실제 사용자 데이터·저장은
사용하지 않았다.

### 작업 1 — 현행 구조와 수치

| 탭 | 현행 콘텐츠 유형 | 반복 목록 구조 | 입력·폼 |
|---|---|---|---|
| 대시보드 | 여정 카드 + 요약 카드 2개 + 액션 Top 3 + 안내바 | 요약은 이미 데스크톱 2열, Top 3은 고정 3행 | 액션 1줄 추가 |
| 자산 | 요약 카드 2개 + 7필드 편집 테이블 + 목표·노트 | 데스크톱 표 1행=48.5px, 모바일은 행마다 2열 필드 카드 | 모든 표 셀이 인라인 입력, 목표·노트 폼 |
| 액션 | 검색·카테고리 필터 + 우선순위 목록 + 완료 목록 | 전 해상도 1열, 데스크톱 행 48.4px | 하단 추가 폼, 행 내 수정모드 |
| 수집함 | 추가 폼 + 검색·필터 + 상세 카드 목록 | 기본 목록은 전 해상도 1열. 별도 갤러리 모드는 데스크톱 6열 | 명시적 추가 폼·편집 모달 |

`문서높이/최대 document 스크롤` 실측값(px):

| 탭 | 1440 | 1920 | 2560 | 390 |
|---|---:|---:|---:|---:|
| 대시보드 | 911 / 11 | 911 / 11 | 911 / 11 | 1,132 / 288 |
| 자산 | 2,117 / 1,217 | 2,117 / 1,217 | 2,117 / 1,217 | 10,484 / 9,640 |
| 액션 | 1,672 / 772 | 1,672 / 772 | 1,672 / 772 | 2,423 / 1,579 |
| 수집함 목록 | 5,892 / 4,992 | 5,892 / 4,992 | 5,892 / 4,992 | 6,490 / 5,646 |

데스크톱 폭이 1440→2560으로 늘어도 네 탭 모두 문서 높이가
1px도 줄지 않았다. 현재 추가 폭이 열 수 증가에 쓰이지 않고,
단일 행·카드만 넓히기 때문이다.

| 탭 | 1440 반복항목(폭×평균높이) | 2560 반복항목 | 열 수 | 확인된 가로 잉여 |
|---|---:|---:|---:|---|
| 대시보드 요약 | 693×156.8 | 741×156.8 | 2 | 첫 카드 본문 뒤 265→313px. 이미 2열이고 전체 문서는 708px라 장문제 아님 |
| 자산 행 | 1,360×48.5 | 1,720×48.5 | 1(표 행) | 7개 입력 열이 폭을 실제 사용. 단순 카드 2열 전환 부적합 |
| 액션 행 | 1,362×48.4 | 1,458×48.4 | 1 | 첫 행 텍스트 끝~수정 버튼 759→855px 공백 |
| 수집함 카드 | 1,362×213.8 | 1,458×213.8 | 1 | 첫 카드 제목 끝~배지 953→1,049px 공백, 목록 자체 5,362px |

모바일 반복항목은 대시보드 366px/1열, 자산 334×384.8px,
액션 336×72.9px, 수집함 336×234.1px이며 가로 overflow는 네 탭
모두 0이었다. 따라서 390px은 지시대로 현행 1열을 유지해야 한다.
특히 자산의 10,484px는 B-73에서 의도한 “행 안 2열 필드 카드”가
24개 누적된 결과라, 이번 데스크톱 잉여 폭 문제와 분리한다.

현재 B-74 폭 정책 실측:

| viewport | 대시·액션·수집함 wrap | 자산 wrap | 매물 wrap | 매물↔문서형 폭 차 |
|---:|---:|---:|---:|---:|
| 1440 | 1,440 | 1,440 | 1,440 | 0 |
| 1920 | 1,440 | 1,574.4 | 1,920 | 480 / 자산 345.6 |
| 2560 | 1,536 | 1,800 | 2,560 | 1,024 / 자산 760 |
| 390 | 390 | 390 | 390 | 0 |

수집함의 기구현 갤러리도 기준선으로 별도 측정했다. 데스크톱은
6열(카드 217~233px), 문서높이 1,251px로 기본 목록 5,892px보다
79% 짧지만, 원문·위치/가격 메타·상태 변경/수정 버튼을 카드에서
생략하고 모달 진입에 의존하는 “요약 보기”다. 전체 정보를 유지하는
기본 목록의 직접 대체재로 삼으면 콘텐츠를 숨기지 말라는 원칙과
맞지 않는다.

### 작업 2 — 대안 3안

#### A안(권장) — 의미별 반응형 그리드, 대시·자산은 현행 유지

- **액션**: 1200px 이상에서 미완료 목록과 완료 목록을 각각 2열
  CSS grid로 만든다. DOM 순서를 그대로 row-major(1·2 / 3·4)로
  배치하고 순번을 유지한다. 실측 폭이면 카드당 674px(1440)~
  722px(2560)라 텍스트·담당·마감·수정 버튼이 모두 들어간다.
- **수집함**: 기본 상세 카드 전체를 1200px 이상에서 2열로
  배치한다. 원문·메타·태그·상태·수정/삭제를 한 항목도 생략하지
  않는다. 3열은 2560에서도 카드당 약 478px라 버튼·긴 메타가
  빽빽해져 채택하지 않는다.
- **대시보드**: 이미 요약 2열이고 문서높이 911px라 변경하지 않는다.
  폭 점프를 줄이겠다고 여정/Top 3까지 쪼개면 정보 위계만 약해진다.
- **자산**: 7열 비교·편집 표를 그대로 둔다. 2열 카드화는 같은
  컬럼의 세로 비교를 끊고, B-73 모바일 구조를 데스크톱에 역이식해
  행 높이를 키운다.
- **예상 효과/규모**: 액션 목록 1,224→약 620~680px(문서 약 35%
  감소), 수집함 목록 5,362→약 2,700~3,000px(문서 약 45~50%
  감소). `style.css` 약 15~30줄, 스키마·상태·렌더 로직 변경 없음.
  모바일 media에서 반드시 1열.
- **리스크**: 액션 우선순위를 위→아래가 아니라 좌→우로 읽게 되는
  학습 변화, 수집함 카드 높이가 다를 때 행 단위 빈칸 발생. 실제
  긴 제목·사진·원문 펼침과 액션 인라인 수정 상태를 1440/2560에서
  검증해야 한다.

렌더 파일 범위: `nav.js` 변경 없음(현행 64~123 유지),
`assets.js` 변경 없음(9~70 유지), `actions.js`는 현행 67~93 DOM으로
CSS 적용 가능해 기본 변경 없음(의미 클래스가 필요해도 2~6줄 이내),
`scraps-render.js`도 현행 45~81 `.sc-list`/`.sc-card`로 CSS 적용
가능해 변경 없음.

#### B안 — 2-pane 워크벤치(목록+선택 상세)

- **적용 후보**: 수집함(왼쪽 압축 목록+오른쪽 원문/메타/편집),
  액션(왼쪽 우선순위+오른쪽 수정), 자산(왼쪽 표+오른쪽 목표/노트).
  대시보드는 선택 상세 개념이 없어 제외.
- **구현**: 선택 id와 키보드 포커스 상태, 빈 선택/삭제 후 다음 선택,
  양 pane 독립 스크롤, 899px 이하 단일 흐름 복귀가 필요하다.
- **예상 규모**: `assets.js:9~70` 약 40~80줄,
  `actions.js:62~140` 약 50~90줄,
  `scraps-render.js:18~91` 약 80~140줄,
  `style.css` 약 60~100줄, 필요하면 `index.html` 상세 host 추가.
  `nav.js`는 변경 없음. 총 230~410줄 수준.
- **리스크/판정**: B-94가 이미 document↔내부 스크롤 전환을
  부자연스러움의 한 원인으로 지목했다. 이 안은 세 탭에 내부
  스크롤·선택 상태를 새로 늘리고, 모바일 왕복·접근성·편집 저장
  회귀면이 크다. 항목 수가 수백 개로 커지기 전에는 과설계라 보류.

#### C안 — CSS multi-column

- **적용 후보**: 수집함 상세 카드만 2 columns +
  `break-inside:avoid`. 액션은 완료 구획과 우선순위 순서 때문에
  제외, 대시·자산도 부적합.
- **예상 규모**: `style.css` 6~12줄. `nav.js`·`assets.js`·
  `actions.js`·`scraps-render.js` 모두 변경 없음.
- **리스크/판정**: 시각 순서는 왼쪽 열을 끝까지 읽은 뒤 오른쪽
  열로 가지만 DOM·키보드 순서도 그 흐름에 묶여, 사용자가 기대하는
  최신순 row-major 비교와 어긋난다. 원문 펼침·사진 높이 변화 때
  카드가 열 사이를 크게 이동하고 열 균형도 흔들린다. 적은 코드보다
  읽기 순서 안정성이 중요해 비권장.

### 작업 3 — 매물↔문서형 폭 점프 판정

**권장: B-74 clamp와 매물 전체폭은 유지하고 A안으로 문서형 내부를
채운다.**

- 공통 max-width를 `none`으로 되돌리면 2560px 액션·수집함 행이
  2520px 가까이 늘어 B-74가 해결한 공백 회귀가 즉시 돌아온다.
- 문서형을 공통 1800px로 맞춰도 매물과 760px 차이는 남고,
  대시·액션·수집함의 단일 행만 264px 더 넓어진다. 밀도 문제를
  해결하지 못한다.
- `max-width` transition은 480~1,024px 리플로우를 눈앞에서
  애니메이션할 뿐 최종 폭·밀도는 그대로다. 지도 resize와
  `prefers-reduced-motion` 분기까지 새 부담이 생긴다.
- 반대로 A안은 매물의 지도 여백 0을 보존하고 문서형 clamp 안에서
  2개의 정보 열을 보여준다. 폭 차이는 “빈 종이가 줄어드는 점프”가
  아니라 “지도 작업면↔읽기 그리드”라는 콘텐츠 모델 차이로 보인다.

### 후속 커밋 단위

1. `style: 액션 목록 데스크톱 2열 밀도 개선 (B-95 2단계)` —
   `style.css` 단독, 미완료/완료·인라인 수정·모바일 1열 검증.
2. `style: 수집함 상세 카드 데스크톱 2열 밀도 개선 (B-95 2단계)` —
   `style.css` 단독, 긴 제목·사진·원문 펼침·편집/상태·갤러리 모드
   무회귀 검증.
3. 두 커밋 실사용 후에도 폭 전환 불편이 남을 때만 max-width를
   재진단한다. 대시보드·자산·transition 수정은 현재 권장안에
   포함하지 않는다.

### 검증·산출물

- 4해상도×4탭 기본 목록 16장과 수집함 갤러리 비교 2장,
  매물 폭 기준 4장을 레포 밖 `/tmp/b95-shots/`에 생성해 완료
  보고에 첨부했다.
- 모든 해상도에서 가로 overflow 0. DOM 실측과 스크린샷을
  교차 확인했다.
- 이번 커밋의 추적 파일 변경은 `HISTORY.md` 1개뿐이다.
  `index.html`·`style.css`·`js/`·`api/` 제품 코드는 0줄 변경.
  병행 B-97 커밋 위에 append했고, 손 A의 미커밋 `HANDOFF.md`는
  수정·스테이징하지 않았다.

**→ B-95 1단계 진단 완료**. 권장안은 액션·수집함만 데스크톱
2열 상세 그리드로 바꾸고 대시·자산·B-74 폭 정책은 유지하는
소규모 2커밋이다. 실제 구현은 후속 지시 후 착수한다.

---

## 2026-07-18 — 액션·수집함 데스크톱 2열 그리드 (B-95 2단계)

B-95 1단계 권장 A안을 `style.css`만으로 구현했다. 1200px 이상에서
액션의 미완료 목록과 완료 목록, 수집함의 기본 상세 목록을 각각
2열 CSS Grid로 전환했다. DOM 순서를 바꾸는 multi-column이 아니라
기본 grid 자동 배치를 사용해 읽기 순서는 1·2 / 3·4의 row-major다.
콘텐츠·버튼은 숨기거나 접지 않았고, 액션 인라인 편집 행은 입력
컨트롤이 좁아지지 않도록 편집 중에만 전체 열을 사용한다.

- 768px 태블릿과 390px 모바일은 기존 1열 유지.
- 수집함 갤러리(`.sc-gallery-grid`)는 기존 그리드 유지.
- 대시보드 2열·자산 7열 표·B-74 문서형 clamp 전부 무변경.
- 기존 `.actfull`·`.done-body`·`.sc-list` DOM이 충분해
  `actions.js`·`scraps-render.js`는 수정하지 않았다.

### 1단계 기준선 대비 실측

동일 합성 데이터(액션 24개=미완료 18+완료 6, 수집함 24개)를
게스트 상태에 주입하고 Playwright로 다시 측정했다.

| 항목 | 1단계 | 2단계 | 변화 |
|---|---:|---:|---:|
| 데스크톱 액션 문서 높이 | 1,672px | 1,090px | -582px (-34.8%) |
| 데스크톱 액션 목록 높이 | 1,224px | 642px | -582px (-47.5%) |
| 데스크톱 액션 최대 스크롤 | 772px | 190px | -582px |
| 데스크톱 수집함 문서 높이 | 5,892px | 3,397px | -2,495px (-42.3%) |
| 데스크톱 수집함 목록 높이 | 5,362.4px | 2,867.7px | -2,494.7px (-46.5%) |
| 데스크톱 수집함 최대 스크롤 | 4,992px | 2,497px | -2,495px |

1440px에서 액션 행은 672px×2열, 수집함 카드는 674px×2열이며,
2560px에서는 각각 720px·722px다. 첫 항목 가로 잉여도 액션은
1440/2560에서 759/855px→69/117px, 수집함은
953/1,049px→265/313px로 줄었다.

390×844는 액션 2,423px·수집함 6,490px로 1단계 문서 높이와
동일하고 양쪽 모두 1열이다. 별도 768×1024 확인도 액션·수집함
1열이었다. 1440·1920·2560·768·390 전부 가로 overflow 0.
갤러리는 1440/1920/2560에서 기존 6열, 768에서 3열, 390에서
1열을 유지했다.

### 기능 회귀

- 액션: 추가 후 `추가했어요` 토스트, 완료 토글 후 완료 목록 이동,
  인라인 편집 저장, 마감 뱃지 렌더를 1440×900·390×844 양쪽에서
  통과. 편집 행은 데스크톱 그리드 전체 폭을 사용했다.
- 수집함: 유형 필터, 제목 검색, 오래된순 정렬, 기본 목록 수정 모달,
  갤러리 전환·갤러리 카드 편집 모달, 다시 목록 복귀를 양쪽
  해상도에서 통과.
- B-93 토스트는 데스크톱·모바일 모두 viewport 수평 중앙,
  `position:fixed`, `z-index:9999`였고 수집함 편집 모달 위에서도
  표시됐다.
- 1단계 전/2단계 후 액션·수집함 4해상도 캡처를 각각
  `/tmp/b95-shots/`, `/tmp/b95-stage2-shots/`에 보관했다.

병행 중인 손 A의 미커밋 `index.html`·`properties.js`·
`scraps-import.js`는 수정·스테이징하지 않았다. B-95가 보유했던
`style.css`·`actions.js`·`scraps-render.js` 락은 이 커밋 push 후
해제한다. 특히 손 A가 기다리는 B-97 ② 수집함 카드 원문 토글은
그 뒤 `scraps-render.js`에서 재개 가능하다.

**→ B-95 2단계 완료**. 액션·수집함의 상세 정보를 그대로 유지하면서
데스크톱 잉여 폭을 두 열로 사용하고 세로 길이를 줄였다.

---

## 2026-07-18 — 텍스트 서식 품질 개선 2단계 1차분 (B-97, 커밋 3개)

B-97 1단계 진단(`4cdbfa9`)에서 A안 승인 후 발급된 첫 착수 지시.
대상은 `scraps-import.js`·`properties.js`·`index.html`뿐 —
`scraps-render.js`·`actions.js`·`style.css`는 손 B의 B-95 작업
중이라 무접촉(신규 CSS 클래스도 추가하지 않고 기존 클래스만 재사용).
원문 그대로 보기 토글(분해안 ②, `scraps-render.js` 대상)은 이
이유로 다음 지시로 미룬다.

**커밋① `js/scraps-import.js`(`1bcba34`) — 임포트 표 파서 콘텐츠
유실 수정**
- 커맨드센터가 실코드로 확인한 실버그: `scParseMdTable`이
  `text.split('\n').filter(l=>l.startsWith('|'))`로 `|`로 시작 안
  하는 줄을 파싱 이전에 통째로 버렸다 — 표+헤딩+리스트+인용이 섞인
  문서를 붙여넣으면 표 밖 내용이 전부 사라짐(1단계 진단 신규 발견).
- 수정: 원본 줄 배열에서 표 줄의 인덱스만 추출해 표는 그대로
  구조화 파싱하되(기존 로직 무변경), **표가 아닌 줄들을
  `scFreeText()`로 별도 raw 항목을 만들어 파싱 결과 맨 앞에
  추가**(기존에 이미 있는 자유텍스트 폴백 함수를 그대로 재사용 —
  새 파싱 로직 추가 없음). 표만 있던 기존 케이스는 표 밖 줄이
  비어 있어 추가 항목이 안 생기므로 **완전 무회귀**.

**커밋② `js/scraps-import.js`(`0518160`) — 임포트 제목 인라인
편집화**
- 1단계 분해안 ④. 자유텍스트 폴백의 제목 추측 실패(B-77)를 파서를
  더 똑똑하게 만들어 근절하는 대신, **미리보기 단계에서 사용자가
  즉시 고칠 수 있게** 함(기록 우선 원칙, 파서 휴리스틱 개선보다
  저위험·저비용).
- 미리보기 표의 제목 셀을 읽기 전용 `esc()` 텍스트 → 입력
  (`.safety-memo` 기존 클래스 재사용)으로 교체, `oninput`으로
  `scImportItems[idx].title`을 즉시 갱신 — 확정(`sc_importConfirm`)
  시점에 이미 이 배열을 읽으므로 별도 반영 로직 불필요.

**커밋③ `index.html`+`js/properties.js`(`0a51c2f`) — 매물 메모
3곳 미리보기 토글 이식**
- 1단계 분해안 ③. 자산 노트의 `an_previewToggle`↔`an_mdPreview`
  패턴(기존 `.sc-preview-toggle`/`.sc-md-preview`/`.sc-md-content`
  클래스, 전부 기존)을 `f_memo`(추가 폼)·`em_memo`(레거시 수정
  모달)·listing memo(B-91 수정모드) 3곳에 이식.
- 공용 `memoPreviewToggle(btn,ta,prev,toolbar)` 함수 하나로 3곳
  전부 처리 — 고정 ID(`f_memo`/`em_memo`)와 행마다 동적으로 렌더되는
  listing memo(`data-lid`로 스코프, B-92 `fillBtn`과 동일한 위임
  패턴) 양쪽에서 재사용해 중복 최소화.
- `renderMd()`+DOMPurify 경로 그대로 재사용, 새 sanitize 로직 없음.
  접기가 아닌 명시 토글 버튼(UI 원칙).
- listing memo는 원래 툴바가 없던 필드라 미리보기만 추가(툴바 추가는
  요청 범위 밖). iOS 16px 자동확대 규칙(B-66)은 새 필드도 진짜
  `<textarea>`라 기존 `textarea{font-size:16px !important}` 규칙에
  자동으로 걸려 CSS 변경 없이 자동 준수 확인(실측).

### 검증(Playwright, 데스크톱 1280px+모바일 390px, 총 53개 체크 전부 통과)

- ① 1단계에서 쓴 재현 샘플(표+헤딩+굵게+리스트+인용) → 3개 항목
  파싱(표 2행 구조화 + 표 밖 내용 1개, 제목은 헤딩에서 자동 추출)
  확인, 표 안 값(price)도 정확히 구조화됨 재확인. 표-only·
  frontmatter·key:val 기존 3개 경로 완전 무회귀. 전체 UI 흐름(붙여
  넣기→파싱→미리보기→확정)으로 재확인, 붙여넣기~저장까지 표 밖
  내용이 최종 `state.scraps`에 실제로 남는 것까지 end-to-end 확인.
- ② 오추측 제목("네이버부동산") 표시 확인 → 인라인 수정 →
  `scImportItems` 즉시 반영 → 확정 후 `state.scraps`에 수정된 제목
  그대로 저장 확인. 제목 입력에 HTML payload를 넣어도 `value` 바인딩
  이라 즉시 실행 안 됨(저장 후 렌더 시점 esc()는 기존 경로 무변경,
  B-64 확인분).
- ③ 3곳(f_memo/em_memo/listing memo) 각각 미리보기 켜짐(textarea
  숨김+렌더 표시)·꺼짐(원복) 왕복, `<img onerror>`/`<svg onload>`/
  `<a href="javascript:">` 3종 payload가 3곳 미리보기 전부에서
  무력화 확인(B-64 페이로드 재사용). listing memo는 편집→미리보기
  →취소 흐름에서 B-91 값 무손실도 함께 재확인.
- `node --check` 3개 파일 전부 통과. 커밋 분리를 위해 매 커밋마다
  임시로 다음 커밋 코드를 제거한 상태로 별도 실행해 각 커밋이 단독
  으로도 정상 동작함을 재확인 후 복원·커밋(B-91/B-92 때와 동일
  방식).
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.
- 손 B가 B-95 2단계(`style.css`+`actions.js`+`scraps-render.js`)를
  동시 작업 중이라 세 파일 전혀 건드리지 않았고, 매 커밋 직전
  `git status`로 확인 후 내 파일만 정확히 스테이징(HANDOFF·HISTORY·
  style.css는 손 B가 중간에 자기 커밋으로 별도 반영, 충돌 없이
  교차 진행 확인).

**→ B-97 2단계 1차분(①③④) 완료**. 남은 ②(수집함 카드 "원문 그대로
보기" 토글)는 `scraps-render.js` 락 해제 후 별도 지시로.

---

## 2026-07-18 — 수집함 카드 원문 보기 토글 (B-97 ②, 커밋 1개)

B-97 2단계 분해안의 마지막 항목. `js/scraps-render.js` 1파일만
수정(손 B의 B-95 2단계가 `06d7b09`로 push돼 락 해제 확인 후 착수).
`style.css` 신규 클래스 추가 없음 — 기존 `.sc-preview-toggle`(B-97
1차분에서 이미 검증된 클래스)만 재사용.

- 1단계 진단이 확인한 lazy continuation 등으로 렌더가 입력 의도와
  달라질 때, 사용자가 카드에서 원문을 즉시 대조할 수 있는 탈출구를
  마련했다.
- 카드별 명시 토글 버튼("원문 보기"↔"서식 보기") — 접기·hover
  숨김 없음(UI 원칙). 클릭 시 마크다운 렌더(`renderMd(rawText)`)
  대신 `<pre>` 안에 `esc(rawText)`(pre-wrap, 줄바꿈 보존)를 넣어
  **원문을 있는 그대로 보여준다 — renderMd 우회가 아니라 esc()
  경로라 XSS 표면을 하나도 늘리지 않는다.**
- 토글 상태(`scRawViewIds`, id의 `Set`)는 `state` 스키마에 절대
  저장하지 않는 순수 뷰 상태 — `cxListingEditMode` 등 기존 뷰
  상태 Set과 동일한 패턴, 새로고침하면 초기화된다.
- 토글 버튼을 기존 "더보기/접기" 박스(`.sc-card-raw`, 클릭 시
  `expand` 클래스 토글) **안이 아니라 바깥 형제 요소로** 배치해,
  버튼 클릭이 더보기/접기 토글과 클릭 버블링으로 충돌하지 않게 했다
  (두 토글이 독립적으로 공존).
- 갤러리 뷰(카드가 작아 대상 제외)와 편집 모달(이미 원문이 보임)은
  스펙대로 손대지 않음 — list 뷰 카드 템플릿만 수정.

**검증**(Playwright, 데스크톱 1280px/1400px+모바일 390px, 총 27개
체크 전부 통과):
- 렌더↔원문 왕복 확인. 1단계에서 쓴 `#`/`-`/`>` 혼재 샘플로 대조 —
  렌더 모드는 `<ul>`/`<blockquote>`로 변환(lazy continuation 재현),
  원문 모드는 `#즉시입주가능`·`- 방3`·`&gt; 문의는`이 **문자 그대로**
  보임(HTML 요소로 변환 안 됨) 확인.
  `<img src=x onerror>` payload를 원문 모드에서 렌더 → 실행 안 됨
  (`&lt;img` 로 이스케이프된 텍스트만 노출) 확인.
- 토글 상태가 `state` 객체 어디에도 안 남는 것을 JSON 직렬화로 확인,
  검색·필터 재렌더를 거쳐도 토글 상태가 세션 내에서 유지되는 것
  확인(단, 새로고침하면 사라짐 — 의도된 동작).
- 갤러리 뷰 전환 시 원문 토글 버튼이 아예 없는 것 확인(스펙 5).
- B-95 2열 그리드(1200px+, `#panel-scraps .sc-list{grid-template-
  columns:repeat(2,minmax(0,1fr));align-items:start}`) 환경에서
  실측: 원문+더보기로 카드 높이가 2.3배 늘어나도 **같은 행의 이웃
  카드는 위치·높이 완전 무변화**(`align-items:start`가 각 카드를
  독립적으로 시작점에 정렬해 stretch 안 함) — 다음 행만 자연스럽게
  아래로 밀림(정상적인 grid reflow, 깨짐 아님). 스크린샷으로 시각
  확인. 가로 스크롤 발생 안 함.
- 필터·정렬·검색 무회귀(기존 렌더 경로 그대로 재사용).
- `node --check js/scraps-render.js` 통과.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-97 ② 완료. 이걸로 2단계 분해안 4건(①표파서·②원문토글·
③메모미리보기·④제목인라인) 전부 소진 — B-97 텍스트 서식 품질
에픽의 계획된 작업 종결.** 실사용 확인 후 커맨드센터의 최종 종결
판정 대기. 잔여로 남는 항목: B-102(소형 묶음, listing memo 읽기
표시 누락 등, 다음 유휴 손 배정) — B-97 자체 범위는 아님.

---

## 2026-07-18 — 라이브 렌더 키 입력 지연 완화 (B-105, 커밋 1개 + 진단 보고)

커맨드센터 실코드 진단: `sc_text`/`sem_text`(수집함 입력폼·편집모달,
contenteditable 라이브 마크다운 렌더)가 키 입력마다 ①`el.innerText`
읽기(강제 리플로우) ②`ceGetOffset` 전체 트리 순회 ③`innerHTML` 전체
재조립 ④`ceSetOffset` 전체 순회를 반복 — 비용이 내용 길이에 비례해
긴 임포트 원문 편집 시 키당 수백 ms(사용자 실기기 재현). **이건
완화다** — 이 파이프라인은 B-103(에디터 교체)이 대체할 예정이라
구조는 그대로 두고 비용만 줄였다. `js/utils.js`+`js/scraps-form.js`
2파일만 수정, `properties.js`(B-102 예정)·`index.html`/`nav.js`/
`style.css`(손 B의 B-53) 무접촉.

**커밋① `js/utils.js`+`js/scraps-form.js`(`93d7ab3`)**
1. **렌더 스킵**: `ceRender(el)` 진입부에 `raw===el.dataset.
   renderedRaw`면 즉시 return하는 가드 추가. focus/blur 등 `ceRender`
   를 거치지 않는 수동 렌더 경로가 있어 이 캐시가 완벽히 최신이
   아닐 수 있지만, 불일치는 항상 "생략해야 할 렌더를 한 번 더 한다"
   방향으로만 어긋나 안전하다(필요한 렌더를 잘못 건너뛰는 경우는
   없음).
2. **rAF 디바운스**: `ceRenderDebounced(el)`을 신설해 같은 엘리먼트에
   대해 이미 예약된 프레임이 있으면 취소하고 다시 예약(코얼레싱) —
   연속 입력 중 마지막 raw 기준으로 프레임당 최대 1회만 실제 렌더.
   `sc_text`/`sem_text`의 `input`·`compositionend` 핸들러 4곳만
   `ceRender`→`ceRenderDebounced`로 교체.
3. **조합 중 렌더 취소**: `compositionstart` 리스너를 신설해
   `ceCancelDebounced(el)`을 호출 — 이전 `compositionend`가 예약해둔
   지연 렌더가 새 조합이 시작된 뒤에 끼어들어 DOM을 갈아엎지 않게
   한다. 새 조합이 끝나는 `compositionend`가 다시 렌더를 예약한다.
4. **의도적으로 손 안 댐**: `ceWrap`/`ceLine`(툴바·Ctrl+B/I)·Enter키
   줄바꿈·`scApplySlash`의 `ceRender` 호출은 전부 동기 그대로 유지 —
   이산적(discrete) 단발 액션이라 디바운스 대상이 아니고, 즉시 시각
   피드백이 맞는 UX. `paste` 핸들러는 원래도 `ceRender`를 거치지
   않고 자체 `innerHTML` 재조립을 쓰고 있어(붙여넣기는 반복 입력이
   아니라 최적화 대상이 아님) 손대지 않음. `scDetectSlash`도 커서
   위치 기반 슬래시 메뉴 표시라 렌더와 무관하게 매 입력마다 동기로
   그대로 실행(지연 시 메뉴 위치가 밀려 보이는 게 더 나쁨).

**검증**(Playwright, 데스크톱 1280px+모바일 390px, 총 32개 기능
체크 전부 통과 + 정량 측정):
- 기능: 헤딩/리스트 마커 렌더, Ctrl+B(선택 영역을 직접 오프셋으로
  제어 — 렌더된 `<span class="mk">` 마커를 가로지르는 키보드
  Shift+ArrowLeft 내비게이션은 신뢰할 수 없어 테스트 방법 자체를
  `ceSetOffset`+`Selection.modify`로 교체해 재확인), 슬래시 커맨드
  메뉴 노출, 붙여넣기, 조합 중(`compositionstart`) 렌더 미발생,
  `compositionend`가 실제 DOM 내용을 정확히 캡처해 지연 렌더,
  XSS 4종(이전 payload 재사용) 무력화, `is-empty` 토글, 동일-raw
  재렌더 완전 no-op(스킵 확인) — 전부 통과.
  **테스트 과정에서 자체 테스트 스크립트 버그 2건 발견·수정**(실제
  코드 결함 아님): ①키보드 선택 방식이 렌더된 마커 span을 가로지르며
  부정확 → 오프셋 API로 교체 ②IME 시뮬레이션에서 `dataset.raw`와
  `dataset.renderedRaw`를 둘 다 미리 같은 값으로 세팅해 스킵-가드가
  "씨딩용" 렌더 자체를 건너뛰게 만듦 → `renderedRaw`만 지워 실제
  렌더가 일어나게 수정. 두 버그 모두 고쳐서 재실행하니 정상 통과.
- **편집 모달(사용자 실제 재현 시나리오) 전용 확인**: 50KB(45KB
  바이트 기준) 원문 스크랩을 `sem_text`에 로드 → 추가 타이핑 →
  마커 렌더 유지 확인 → 저장 → `state.scraps`에 정확히 반영(바이트
  단위까지 확인) — 데스크톱+모바일 양쪽 통과.
- **정량 측정**(50KB 콘텐츠 기준): 단일 `ceRender()` 실행 비용
  9.7ms(10KB는 1.2ms) — O(n) 스케일 확인. **연속 입력 버스트
  코얼레싱**: 10회 연속 동기 호출을 old 방식(매번 즉시 렌더)으로
  시뮬레이션하면 10회 렌더·76.8ms, 실제 rAF 디바운스 적용 시
  1회만 실제 렌더되고 총 8.8ms. **동기 키 입력 지연(체감 렌더링
  지연의 실체)**: old 방식 시뮬레이션 8.5ms → 신규(실제 배포 코드)
  1.1ms, 약 87% 감소.
- `node --check js/utils.js`·`js/scraps-form.js` 통과.

**커밋②(줄 단위 부분 렌더) 판단 — 생략**: 지시 조건("50KB 원문 키
입력 지연이 여전히 >100ms일 때만") 대비, 커밋① 적용 후 실측한
50KB 콘텐츠의 단일 `ceRender()` 최악 비용이 **9.7ms로 100ms 임계의
10분의 1 미만**이라 조건 미충족 — 생략. 구조 재설계 없이 스킵+
디바운스만으로 목표 달성 확인.

**진단 보고(코드 무변경) — "전체적으로 느림"의 타 요인 계측**:
실규모 가정(스크랩 50개, 이미지 총 76장 — 최대 5장/건 혼합, 앱의
`compressImage()`(600px·JPEG q0.65)로 실제 압축한 이미지 사용,
장식용 문자열 아님)으로 측정:
- `state` 전체 JSON 크기 **3.92MB** — `api/state.js`(B-80) 서버
  4MB 상한의 **98%**. 사진을 많이 쓰는 실사용 패턴에서는 413(저장
  용량 초과) 문턱에 상당히 가까이 다가갈 수 있다는 뜻 — 후속 판단
  필요(수정 안 함, 보고만).
- `JSON.stringify(state)` 5.0ms
- `localStorage.setItem()` 6.4ms
- `renderScraps()` 전체 재렌더 12.4ms
- 셋 다 이 규모에서 "느림"이라 부를 수준이 전혀 아니다(전부 한 자릿수
  ~십수 ms) — **"전체적으로 느림" 체감의 주 원인은 라이브 렌더
  파이프라인(이번에 완화한 부분)이었을 가능성이 높고, state 크기·
  저장·목록 재렌더는 현재 규모에서 병목이 아님**을 시사. 단 state
  크기가 서버 상한에 근접하는 문제는 이번 범위 밖 별도 사안.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-105 완료**. `properties.js`·`index.html`·`nav.js`·`style.css`
전부 무접촉 확인. HANDOFF 갱신 후 B-102 재개.

---

## 2026-07-19 — B-105 회귀 핫픽스: 지연 렌더·커서 정합성 (B-107, 커밋 1개)

사용자 실기기 재현(스크린샷 확보) — 수집함 에디터 연속 입력 시 줄이
엉뚱한 위치에서 잘리고 리스트 접두("1. ")가 복제. 커맨드센터 원인
특정: B-105의 rAF 디바운스로 렌더가 미뤄지는 동안 `ceGetOffset`(현재
DOM 기준)+`dataset.raw`(최신)를 섞어 raw를 자르는 동기 경로(Enter·
ceWrap·ceLine·scApplySlash)가 어긋난 오프셋으로 동작한다는 가설.
`js/utils.js`+`js/scraps-form.js` 2파일만 수정(B-105와 동일 범위),
`properties.js`(B-102 예정)·`index.html`/`nav.js`/`style.css`
무접촉.

### 수정

1. **`ceFlushDebounced(el)` 신설**(`utils.js`) — 예약된 rAF가 있으면
   취소하고 `ceRender(el)`을 즉시(동기) 실행. "DOM 오프셋을 읽고
   raw를 자르는" 모든 동기 진입점 첫 줄에 삽입: `ceWrap`·`ceLine`·
   `scApplySlash`·Enter 핸들러(sc/sem 각각)·paste 핸들러(sc/sem
   각각)·blur 핸들러(sc/sem 각각)·저장 버튼(`sc_saveBtn`/`sem_save`).
   `ceGetOffset` 호출 지점을 전수 grep해 누락 없이 확인(아래 "의도적
   제외" 참고).
2. **`compositionend`를 rAF 디바운스에서 제외, 동기 `ceRender` 복원**
   (sc/sem 각각) — 지연 렌더가 다음 조합 시작과 경합하던 레이스를
   근본적으로 없앤다. `compositionstart`의 예약 취소(`ceCancelDebounced`)
   는 유지. 조합 중 `input` 이벤트는 여전히 렌더 자체를 안 하므로
   (`isComposing` 체크, 무변경) 비조합 입력 경로에만 rAF 디바운스가
   남아 성능 이득 대부분은 유지된다.
3. **`ceWrap` 특별 처리(부수 발견)**: `ceFlushDebounced`를
   `ceGetOffset` 앞에 기계적으로 넣었더니, 예약된 렌더가 있을 때
   `ceRender`의 `innerHTML` 재조립이 진행 중이던 **다중 문자 선택
   범위를 collapse시켜버리는 새 버그**를 직접 발견함(`ceRender`
   내부 커서 복원은 오프셋 하나만 복원하고 "선택 범위"는 복원 안 함
   — Ctrl+B 대상 텍스트가 통째로 사라짐). 선택된 텍스트와 오프셋을
   **flush 전에** 먼저 읽어두도록 순서를 바꿔 해결 — 다른 `ceGetOffset`
   호출부는 커서 한 점만 필요해 이 문제가 없어 `ceWrap`만 특별 처리.
4. **의도적으로 flush를 안 넣은 곳**: `scDetectSlash`의
   `ceGetOffset` 호출(슬래시 메뉴 위치 판단용, 읽기 전용 — 어긋나도
   최악의 경우 메뉴 위치가 다음 키 입력까지 잠깐 부정확할 뿐 raw를
   훼손하지 않음)과 `ceRender` 내부 자체 오프셋 캡처(렌더 그 자체라
   해당 없음). 지시서의 명시 목록(Enter·ceWrap·ceLine·scApplySlash·
   blur/저장)과 일치.

### ⚠️ 중요 — 재현 관련 정직한 보고

Playwright로 "빠른 연타 직후 즉시 Enter/Ctrl+B/슬래시" 등 여러
타이밍 시나리오를 직접 재현 시도했다. **사용자가 보고한 정확한 증상
("1. " 뒤 공백이 사라져 "1.second" 처럼 붙는 리스트 접두 손상)은
재현했지만, rAF 디바운스를 완전히 꺼도(동기화해도) 동일하게
재현됨을 A/B로 직접 확인** — 이 특정 증상은 리스트 계속줄이 마커
span("1. ")만 있고 그 뒤에 아무 텍스트도 없을 때 `el.innerText`가
CSS 규칙상 줄 끝 공백을 트리밍해 읽어들이는 현상이 원인으로 보이며,
**B-105/B-107의 rAF 타이밍과 무관한 기존부터 있던 별개 결함**으로
판단된다(이번 커밋으로 고치지 않음 — 지시서 범위인 "지연 렌더 타이밍
문제"가 아니고, 고치려면 `innerText` 대신 다른 텍스트 추출 방식이
필요해 "구조 재설계 금지" 제약과 충돌 소지 — B-103 에디터 교체가
이 파이프라인 자체를 대체하므로 자연 해소 후보로 별도 기록 권장).
반면 **"연타 중 Ctrl+B 선택 범위 손상"은 실제로 재현했고, 이건
B-107 자체 수정이 유발할 뻔한 문제였다**(위 3번). 이 재현 실패·성공
경계를 명확히 구분해 보고한다 — 실기기의 정확한 증상 재현은 이번
Playwright 합성 테스트로 완전히 확인하지 못했을 가능성을 인정한다.

### 검증(Playwright, 데스크톱 1280px+모바일 390px)

- ① 빠른 연타 직후 즉시 Enter — mid-line 삽입 후 즉시 Enter로
  정확한 위치에서 분리되는 것 확인(둘째XYZ / 줄 텍스트로 정확히
  분리, 잘못된 위치 없음).
- ② 연타 중 Ctrl+B 적용 — 수정 전에는 선택 범위가 collapse돼 엉뚱한
  단어("텍스트")가 감싸졌으나, `ceWrap` 순서 수정 후 정확히 선택한
  단어("here")만 감싸짐 확인. 연타 중 슬래시 커맨드 적용도 정확한
  위치에 반영 확인.
- ③ 한글 연속 조합 입력(음절 단위 compositionstart/end 시뮬레이션,
  Playwright/CDP가 갈 수 있는 한계 내) 5음절 정확히 조합, 직후 영문
  폭타 타이핑도 무깨짐 확인.
- ④ 50KB 성능 재측정 — 비조합 입력 동기 비용 2.4~5.2ms(여러 회
  측정, 노이즈 있음)로 B-105 이전 기준(8.5ms)보다 여전히 뚜렷이
  낮음, 비조합 버스트 코얼레싱(10회→1회 렌더)도 그대로 유지.
  `compositionend`를 동기로 되돌린 데서 오는 "반납분"은 음절당
  약 8ms(50KB 기준) — 조합 자체가 파일 크기와 무관하게 음절 수만큼
  발생하므로 총 영향은 제한적.
- ⑤ 편집 모달 50KB 저장 왕복(추가 타이핑 포함) 정상, XSS 2종
  payload(`<svg onload>`+`<img onerror>`) 무력화 무회귀.
- `node --check js/utils.js`·`js/scraps-form.js` 통과.
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**→ B-107 완료**. `properties.js`·`index.html`·`nav.js`·`style.css`
전부 무접촉 확인. **⚠️ 실기기 최종 확인은 사용자 몫** — Playwright
합성 테스트가 실제 IME·실제 타이밍 패턴을 완전히 재현하지 못했을
가능성 인정(위 "재현 관련 정직한 보고" 참고). HANDOFF 갱신 후 B-102
재개.

---

## 2026-07-19 — B-102: 매물 소형 묶음 3건(`properties.js`, 커밋 3개)

`properties.js` 단독 수정. 3건 모두 기능 단위 atomic 커밋으로 분리 —
③(실버그)을 커밋①로 최우선 처리하라는 지시에 따라 순서를 매겼다.

1. **`fix`: 단지 매물 메모 표시 누락 수정**(B-91 실버그, 최우선
   커밋) — `renderCxListings()`가 매물 행의 `l.memo`를 편집모드
   (`listingEditFieldsHTML`) 안 textarea에서만 다루고, 읽기 모드에는
   전혀 렌더하지 않던 결함. 편집 저장 후 화면을 벗어나면 적어둔 메모가
   안 보여 "저장이 안 된 줄" 오해할 수 있는 실사용 버그. 레거시
   `state.properties` 카드(`renderList()` 내 `p.memo`, line 864)가
   이미 쓰던 `<div class="c-memo sc-md-content">${renderMd(...)}</div>`
   패턴을 그대로 재사용해 `!editing&&l.memo` 조건으로 메타 정보 아래에
   삽입 — `renderMd`(marked.js+DOMPurify)·`c-memo` CSS 클래스 모두
   기존 것 그대로, 새 스타일·새 살균 경로 없음(지시서 "renderMd+esc
   경로 준수" 충족).
2. **`feat`: parseNaver 세대수(`sedN`) 구조화 → B-101 승격 대상
   추가** — 기존엔 `sedN`이 `_auto.k4`(대단지 게이트)·`memo` 문자열
   조립에만 쓰이고 파싱 결과 객체(`r`)에 구조화 필드로 노출되지
   않았음. `r.households=sedN`을 추가해 B-101이 확립한 승격 파이프라인
   (`createComplexPromotion`→`applyComplexPromotion`, 기존값 없으면
   즉시 채움·있으면 confirm 후 덮어씀, `promotion.handled`로 단지당
   1회)에 `parking`과 동일한 패턴으로 편입. `households` 필드 적용 시
   `householdGrade`도 `calcHouseholdGrade()`로 함께 재계산(단일소스
   원칙 — B-100에서 세운 규칙과 동일). ADD 폼 채우기
   (`queueAddFormComplexPromotion`)·매물행 붙여넣기 자동채우기
   (listing edit paste) 양쪽 다 `createComplexPromotion`을 공유해서
   호출하므로 추가 배선 없이 두 경로 모두에 자동 적용됨.
3. **`refactor`: `showPropToast`→공용 `toast()` 통합** — B-93에서
   `utils.js`에 만든 공용 `toast()`(요소 id `appToast`, `textContent`
   대입·`clearTimeout`으로 타이머 정리·`.prop-toast` 클래스 재사용)와
   `properties.js` 자체의 `showPropToast()`(요소 id `propToast`,
   `setTimeout`만 걸고 이전 타이머 정리 없음 — 연속 호출 시 레이스
   가능성)가 중복 존재하던 걸 정리. `showPropToast` 함수 정의 삭제,
   6개 호출부(신규/기존 단지 매물 등록·대량 가져오기·마이그레이션
   가져오기·위치 미지원/권한거부·단지 정보 저장) 전부 `toast()`로
   교체. `.prop-toast` CSS 클래스는 공유라 스타일 변경 없음(`style.css`
   무접촉).

**검증**(Playwright, 로컬 python UTF-8 강제 서버): 17개 체크 전부
통과 —
- ① `parseNaver`가 "1234세대" 텍스트에서 `households:1234` 반환 +
  기존 memo 문자열 조립("1234세대") 하위호환 유지.
- ① `createComplexPromotion`이 `values.households` 포함.
- ① 단지에 세대수가 비어있으면(`null`) confirm 없이 즉시 채움 +
  `householdGrade` 동시 재계산.
- ① 기존값과 다르면 confirm 요구, 승인 시 반영·거부 시 유지, 동일값이면
  confirm 자체를 안 띄움(3가지 분기 전부 확인).
- ② `showPropToast` 함수가 더 이상 정의되지 않음, `toast()` 호출 시
  `#appToast`에 메시지 표시, 레거시 `#propToast` 엘리먼트 미생성.
- ③ 읽기 모드에서 `.c-memo` 블록에 마크다운 렌더(굵게 등) 확인,
  `<svg onload>`+`<img onerror>` XSS 페이로드 실행 안 됨(스크립트 실행
  플래그 미설정·raw svg/onerror 속성 DOM에 없음 — DOMPurify 정화 확인).
  편집모드 진입 시 읽기용 `.c-memo` 블록은 사라지고(중복 렌더 방지)
  textarea에 원문 그대로 유지. 메모가 빈 매물은 `.c-memo` 블록 자체가
  안 생김(빈 박스 노출 없음).
- `node --check js/properties.js` 통과.
- 3개 atomic 커밋으로 분리 적용한 뒤 `git diff`로 3개 커밋 합산본이
  원래 통합 diff와 바이트 단위로 동일함을 확인(분리 과정에서 손실·중복
  없음).
- 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
  scratchpad에서만 실행, 세션 종료 전 전부 삭제(이전 세션(B-63·B-72)의
  잔여 스크린샷·스크립트도 함께 정리).

**→ B-102 완료**. `index.html`/`nav.js`/`style.css`/`utils.js`/
`scraps-*.js` 전부 무접촉 확인.

---

## 2026-07-19 — B-103 1단계: WYSIWYG 에디터 PoC 스파이크 (poc 브랜치, 커밋 1개·master 미푸시)

**⚠️ 이 항목의 코드 변경은 `master`에 없다.** 지시서 조건("poc 브랜치·
master 미푸시")에 따라 `poc` 브랜치에서만 작업·커밋(`1c474cb`
"poc: B-103 Toast UI Editor WYSIWYG 스파이크")했고 이 문서(HISTORY/
HANDOFF)만 `master`에 기록한다. `poc` 브랜치: `index.html`(CDN 스크립트
2줄+asset notes 마크업)·`js/assets.js`(에디터 초기화·저장 배선)·
`style.css`(폰트 오버라이드 4줄) 3파일, 총 +35/-41줄.

**대상**: 자산 노트(`a_notes`) 1곳만(BACKLOG 지시 스코프). 후보:
Toast UI Editor(NHN) 3.2.2, `initialEditType:'wysiwyg'`+
`hideModeSwitch:true`로 마크다운 모드 진입 자체를 차단(사용자 명시
요구 — "PoC 평가 기준은 WYSIWYG 모드"). 저장은 여전히
`anEditor.getMarkdown()`으로 마크다운 문자열을 `state.assets.notes`에
반영(스키마 무변경, 읽기 렌더는 기존 `renderMd`+DOMPurify 그대로).

### CDN 함정 발견(이 PoC의 첫 실질 성과)

npm 저장소 그대로 미러링하는 jsdelivr(`cdn.jsdelivr.net/npm/@toast-ui/
editor@3.2.2/...`)의 메인 배포 파일(`toastui-editor.js`/`.min.js`)은
ProseMirror 서브모듈을 `require()` 외부 의존성으로 남겨둔 빌드라 순수
`<script>` 태그 로드 시 `Cannot read properties of undefined
(reading 'PluginKey')`로 즉시 깨짐 — **2.5.4(구세대)·3.0.0·3.1.10·
3.2.2 전부 동일 증상 재현 확인**(격리 HTML로 앱 코드와 무관함을
검증). 자체 완결 번들은 NHN 공식 CDN(`uicdn.toast.com/editor/latest/
toastui-editor-all.min.js`)에만 있고 정상 동작 확인. **PoC
"CDN 빌드無" 전제 자체는 성립하지만, 반드시 공식 CDN을 써야 하고
jsdelivr/npm 미러는 못 쓴다**는 게 이번에 새로 확인된 제약 — 실채택
시 이 공식 CDN에 대한 가용성·SRI 미지원(동적 파일이라 jsdelivr
경고와 동일한 이유로 SRI 불가) 리스크는 별도 검토 필요.

### 번들 크기 실측

공식 CDN 기준 JS `toastui-editor-all.min.js` raw 534KB/gzip 158KB,
CSS `toastui-editor.min.css` raw 165KB/gzip 108KB — **합계 gzip 약
266KB**. 기존 앱의 marked.js+DOMPurify 합계(약 55KB gzip 수준)보다
5배 가까이 크다. 이번 PoC에서는 index.html head에 무조건 로드하게
했지만, 실채택 시 자산 탭 진입 시점 지연로드로 초기 페이지 무게 영향을
없앨 여지가 있음(이번엔 실측 목적상 미적용, 후속 과제로 기록).

### 검증 10개 기준 결과(Playwright, 로컬 python UTF-8 서버+공식 CDN
실접속)

- **①한글 IME**: 5음절 연속 조합(안녕하세요) 무깨짐 통과(CDP 시뮬
  한계 인정, 실기기 확인 권장은 여전함).
- **②모바일 390px**: 가로 overflow 없음, 타이핑 정상 통과.
- **③번들 크기**: 위 실측 수치로 기록(합격/불합격 판단 아님, 보고
  전용).
- **④스타일 통합**: 기본 상태에서 에디터 폰트가 Open Sans로 앱 전역
  Pretendard와 불일치 발견 → `#an_wysiwyg .ProseMirror` 타겟 CSS
  4줄로 즉시 해결 확인(재검증 통과) — **통합 비용은 낮음**.
- **⑤50KB+ 무지연**: 50KB 콘텐츠에서 키 입력 동기 비용 2~18ms(여러
  회 측정, ProseMirror 자체가 이미 diff 기반 렌더라 B-105류 전체
  재렌더 문제 없음), 임계 100ms 대비 여유 큼 — 통과.
  (B-105/B-107 재발 방지 기준 충족)
- **⑥저장 왕복**: 저장 버튼→`state.assets.notes` 반영, 에디터
  재초기화 시 저장된 값 복원 확인 — 통과.
  XSS 페이로드(`<img onerror>`+`<svg onload>`) 붙여넣기 시 편집 화면
  자체에서 스크립트 미실행 확인(최종 방어선은 여전히 읽기측
  renderMd+DOMPurify, 여기선 편집 표면 자체의 안전성만 부가 확인).
- **⑦툴바 서식 적용**: 굵게 버튼으로 선택 텍스트 감싸기 정상 →
  마크다운에 `**` 정확히 반영 — 통과.
- **⑨"1. " 자동 순서 리스트 전환 + Enter 이어짐 + 빈 항목 Enter 탈출
  (Notion 표준 동작)**: ❌ **부분 실패**. "빈 항목에서 Enter 시 리스트
  탈출"은 통과하지만, **"1. " 타이핑 시 자동으로 순서 리스트로 바뀌는
  동작 자체가 재현되지 않음** — 문자 단위로 정확히 타이핑해도(합성
  이벤트 아닌 실제 keydown/keypress 시퀀스, space만 별도
  `press`로도 재확인) `<ol>`로 전환되지 않고 "1. 첫번째"가 그대로
  평문 텍스트로 남음. `getMarkdown()`에도 B-108류 손상("1.첫번째"
  공백 소실)은 없음(원인이 다름 — 애초에 리스트 자체가 안 만들어짐).
  기존 저장된 마크다운을 `setMarkdown()`으로 불러오거나 툴바 버튼으로
  만든 리스트는 정상 렌더되므로, "리스트 자체 기능"은 있으나 **"타이핑
  중 마크다운 문법 감지→즉시 변환"이라는 Notion류 라이브 숏컷 기능은
  이 에디터의 기본 동작에 없는 것으로 판단**(플러그인 유무는 추가
  조사 필요, 이번 범위에서 확인 못함).
- **⑩헤딩·볼드·리스트가 마커 문자 노출 없이 즉시 서식 렌더**: 조건부
  결과 — **툴바로 적용하거나 기존 마크다운을 불러올 때는 통과**
  (스크린샷으로 실제 h1/strong/ol 렌더 확인, "##"·"**" 같은 마커
  문자 전혀 안 보임 — 사용자가 요구한 "바로 h3 서식으로" 정확히
  재현됨). **그러나 "## "·"**...**"를 직접 타이핑하면 ⑨와 동일한
  이유로 변환되지 않고 마커 문자가 그대로 화면에 노출됨**(스크린샷
  2장으로 두 경우 모두 시각 확인·기록, 세션 scratchpad에서 검토 후
  삭제).

### 종합 판단(코드 무결정, 사실 보고만)

Toast UI Editor는 "저장된 마크다운을 마커 없는 리치 서식으로
보여주기"와 "툴바 버튼으로 서식 적용"은 **확실히 충족**하지만,
사용자가 이번 지시로 명시 추가한 "타이핑 중 마크다운 문법을 즉시
변환"(Notion/Jira의 슬래시·숏컷 체감)은 **기본 구성에서 재현되지
않음** — PoC의 새 통과 기준 ⑨·⑩(타이핑 케이스) 미충족. 나머지
①~⑧은 전부 통과. 플러그인·설정으로 해당 기능을 켤 수 있는지는 이번
조사 범위 밖(공식 플러그인 목록엔 체크박스·컬러 문법·표 병합 정도만
확인됨, 마크다운 숏컷 전용 플러그인은 못 찾음). **다음 결정은
사람(테디) 몫**: (a)타이핑 숏컷 없이도 툴바+저장된 문서 렌더만으로
충분한지 채택 여부 재확인 (b)숏컷 지원하는 다른 후보(Milkdown·
Tiptap 등 ProseMirror 계열, 직접 InputRule 구현 여지) 조사 지속
(c)PoC 기각하고 B-97 A안(textarea+미리보기 토글) 유지.

`poc` 브랜치는 로컬에만 존재, origin push 안 함(지시 조건 준수).
`node --check js/assets.js` 통과. 로컬 python 테스트 서버·Playwright
스크립트·스크린샷은 레포 바깥 scratchpad에서만 실행, 세션 종료 전
전부 삭제.

**→ B-103 1단계(PoC) 완료·보고**. 코드는 `master`에 없음(poc
브랜치에만 존재). 다음 단계는 사람 결정 대기 — 결정 전까지 B-102
이후 다음 착수 항목 재확인 필요.

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
