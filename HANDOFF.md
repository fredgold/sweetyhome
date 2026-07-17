# HANDOFF — B-65 로그인 유지 완료 (2026-07-17)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-65. R-02(자동 로그인) 가결 항목. `sh_token`을
sessionStorage → localStorage+만료시각으로 전환해 새로고침·탭 닫힘·모바일
브라우저 재시작에도 24h 내 재로그인 없이 유지. `js/auth.js` 외 파일
무접촉(손 A가 B-63으로 `properties.js` 작업 중이라 지시에 명시된 제약),
`api/` 서버 코드 무변경.

## 2. 완료
**커밋 1개, push는 보류.**

```
feat: 로그인 유지 — localStorage 토큰 + 만료시각 (B-65)
```

`js/auth.js` 1개 파일만 수정(+18줄/-6줄). `state.js`·`properties.js`·
`boot.js`·`api/*.js`·`index.html`·`style.css` 전부 무접촉.

**구현**: `SH_TOKEN_TTL_MS=24*60*60*1000` 상수(서버 `api/_auth.js`의
`SESSION_TTL=86400`초와 동일 값, 시크릿 아님) 하나로 통일. `setToken()`/
`clearToken()` 헬퍼 신설 — 로그인 성공 시 `sh_token`+`sh_token_exp`
(now+TTL) 두 키를 함께 저장, 로그아웃/401/만료 시 두 키를 함께 삭제.
`getToken()`은 만료시각 확인 후 지났으면 `clearToken()`→null 반환해
기존 로그인 화면 진입 플로우 그대로 재사용. `sh_token`을 직접 건드리던
5개 지점(`getToken`·`forceLogin`·`tryLogin` 성공 분기·boot IIFE 토큰
검증 실패 분기·로그아웃 버튼) 전부 새 헬퍼로 교체. 기존 sessionStorage
잔존 토큰은 무시되고 재로그인 1회로 자연 정리(별도 마이그레이션 코드
없음, 지시대로).

- **검증**(Playwright, `/api/login`·`/api/state`·`/api/health` 라우트
  모킹 — 실제 PIN 없이 로그인 플로우 재현, 21개 체크 전부 통과):
  - 로그인 → `sh_token`+`sh_token_exp`(정확히 24h 후) localStorage 저장,
    sessionStorage엔 저장 안 됨.
  - 새로고침 → 로그인 화면 재노출 없이 유지.
  - `sh_token_exp` 과거로 조작 → 새로고침 시 로그인 화면 복귀 + 두 키
    모두 자동 삭제.
  - 로그아웃 → 두 키 모두 삭제.
  - `/api/state` 401 모킹 → 기존 `forceLogin()` 경로가 두 키 정리 +
    로그인 화면 유도, 이후 재로그인도 정상(무회귀).
  - 틀린 PIN → 토큰 미저장, 로그인 화면 유지(회귀 없음).
  - `node --check js/auth.js` 통과.
  - 임시 python 서버·Playwright 스크립트는 레포 바깥 scratchpad에서만
    실행, 세션 종료 전 전부 삭제(레포에 흔적 없음).

## 3. 미완 / 다음 단계
- **B-65 완료** — BACKLOG.md ⭐ 섹션에서 커맨드센터가 삭제 처리할 차례.
- 실제 PIN으로 로그인 → 탭 완전 종료 후 재실행 → 유지 확인은 서버
  PIN을 모르는 이 세션에선 직접 못 함(모킹으로 로직 검증만 완료).
  실사용 환경에서 테디가 실제 PIN으로 한 번 더 확인 요망.
- 다음 지시 대기. BACKLOG.md ⭐ 섹션 다음 순번 후보.

## 4. 주의점
- PIN·API 키·실제 토큰 값은 이 문서 어디에도 기록 안 함(테스트는 모킹
  토큰 `mocktoken-abc123` 사용, 실제 서버 토큰 아님).
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **`api/` 서버 코드 무변경** — 서버 세션 TTL(`api/_auth.js`
  `SESSION_TTL=86400`)은 읽기만 하고 그대로 둠. 클라이언트 상수
  `SH_TOKEN_TTL_MS`는 이 값을 그대로 미러링한 것 — **서버 TTL이 바뀌면
  `js/auth.js`의 이 상수도 같이 바꿔야 함**(자동 동기화 아님, 수동 정합).
- B-63(손 A, `properties.js`)과 파일 무충돌로 병렬 진행 완료. 착수 전
  `git status`로 확인함(B-63 커밋 이후 clean, 충돌 없었음).
- `sh_token` 관련 코드는 `js/auth.js`에만 존재함을 grep으로 확인 후
  작업(다른 파일의 `sessionStorage` 사용은 `sh_lastView`·
  `sh_sidebarW` 등 무관한 키라 손대지 않음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. 지시서상 B-65는 손 B(Codex) 담당으로
  표기돼 있으나 이번엔 Claude Code 세션에서 그대로 실행함(B-63 직후
  같은 세션). SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은
  `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: ... → B-61①·②(R-07 해소) → B-63(매물 필드 편집) →
  **이번 세션(B-65, push 보류) — 로그인 유지, R-02 해소**. 지시서상
  B-63/B-65는 파일 무충돌(properties.js vs auth.js) 전제의 병렬 작업
  구성이었음.
