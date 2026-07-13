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
