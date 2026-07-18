# HANDOFF — B-83 보안 방어 강화 완료 (2026-07-18)

## 최신 작업: B-83

- 커밋: `fix: URL 스킴 검증·img src esc·esc 따옴표 강화 (B-83)`
- `safeUrl()`을 `properties.js`에서 공통 `utils.js`로 옮기고, 규제뉴스
  출처는 `http:`/`https:`일 때만 `noopener` 새 창으로 연다.
- 매물·수집함 이미지 `src` 보간값에 `esc()`를 적용하고, `esc()`가
  작은따옴표도 `&#39;`로 변환하도록 보강했다.
- Playwright 데스크톱·390px 모바일에서 정상 뉴스 URL, `javascript:`
  차단, data URL 이미지, `O'PARK` 텍스트, 주요 탭 스모크 통과.
  대상 JavaScript `node --check`와 `git diff --check`도 통과했다.
- 병행 작업 대상 `state.js`·`boot.js`는 건드리지 않았다.
- `BACKLOG.md` 및 기존 미추적 문서 3개는 수정·커밋하지 않았다.

---

# 이전 핸드오프 — 🔴 B-84 저장 유실 방지 완료 (2026-07-18)

## 1. 목표
`BACKLOG.md` "코드 점검 발견" 섹션 B-84(감사 확정 발견, 높음·데이터
유실). ①페이지 이탈 시 대기 중인 Redis 동기화가 있으면 즉시 flush
②디바운스에 maxWait(5s) 추가해 연타 입력 중에도 손실 창이 무한정
늘어나지 않게 함. 손 B가 `utils.js`·`scraps-import.js`·
`scraps-render.js`·`scraps-form.js`·`properties.js`로 B-83 작업
중이라 `state.js`·`boot.js` 외 무접촉.

## 2. 완료
**커밋 2개(코드 1 + 문서 1), 검증 완료. push는 검증 후 진행 가능.**

```
c8a2138 fix: 이탈 시 Redis flush + 디바운스 maxWait (B-84)
2ef6d6f docs: B-84 HISTORY 기록
```

`state.js` 1파일만 수정(+44/-5줄). `boot.js`는 안 건드림 — 기존
`pagehide`/`visibilitychange`(뷰 상태 저장용)는 그대로 두고
`state.js`에 별도 리스너를 추가로 등록(이벤트 리스너는 여러 개
등록해도 서로 방해 없이 전부 실행됨). 손 B의 B-83 대상 5개 파일도
전혀 안 건드림.

**구현**:
1. `flushPendingSync()` 신설 — `pagehide`+`visibilitychange`(hidden)
   등록, 대기 중인 디바운스 타이머(`syncTimer`)가 있을 때만 동작.
   Bearer 토큰 헤더 필요해 `sendBeacon()` 대신
   `fetch(url,{keepalive:true,...})`.
2. 미동기 플래그(`localStorage.sh_unsynced`, B-80 대비) — keepalive
   64KB 제한·응답 못 받고 페이지가 죽을 가능성 고려해 "먼저
   미동기로 표시 → 성공 응답 받으면 지움" 순서로 실패를 조용히
   삼키지 않게 함. `syncToRedis()`(기존 800ms 경로)도 같은 플래그를
   갱신해 플러시/일반 경로 신호를 통일. 표시 UI 자체는 B-80 몫,
   이번엔 플래그만 정확히 남김.
3. 디바운스 maxWait — `SYNC_DEBOUNCE_MS=800`(무변경)에
   `SYNC_MAX_WAIT_MS=5000` 추가, 최초 `save()` 시각 기준 경과 계산해
   5초 넘으면 다음 지연 0(즉시), 아니면 `min(800,5000-경과)`. 타이머
   발화 시 `syncTimer`/`syncBurstStartedAt`을 `null`로 되돌려 "대기
   중" 판별을 정확하게 함(이전엔 발화 후에도 만료 ID를 계속 들고
   있어 부정확했음).

- **검증**(Playwright, `/api/state` 라우트 모킹):
  - 일반 흐름: `save()` 1회 → 정확히 800ms 후 POST 1건만(무회귀).
  - maxWait: 300ms 간격 10초 연타 → POST가 ~5005ms·~10157ms 시점
    총 2건(디바운스만이었다면 ~10.3초에 1건뿐이었을 것).
  - 이탈 flush: `save()` 후 100ms(800ms 되기 전)에 `pagehide` →
    즉시 POST 1건, `Authorization: Bearer` 헤더 정상, 성공 후
    `sh_unsynced` 정상 해제.
  - flush 가드: 대기 타이머 없을 때 이탈 → POST 0건(불필요한 요청
    없음).
  - flush 실패: POST abort 모킹 → `sh_unsynced` 플래그 정확히 설정.
  - `visibilitychange`(hidden) 경로도 `pagehide`와 동일하게 동작.
  - `node --check js/state.js` 통과.
  - 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제.

## 3. 미완 / 다음 단계
- **B-84 완료** — BACKLOG.md "코드 점검 발견" 섹션에서 커맨드센터가
  삭제 처리할 차례.
- **B-80(저장 실패 표시)이 이번에 남긴 `sh_unsynced` 플래그를 소비할
  예정** — 이번 세션은 플래그를 정확히 남기는 것까지만, 사람이 보는
  UI(재로그인 시 배너 등)는 B-80 범위.
- push는 이 세션에서 검증 완료 후 진행(보류 아님, 지시대로).

## 4. 주의점
- PIN·API 키·실제 데이터는 이 문서 어디에도 기록 안 함. 테스트는
  가짜 토큰(`faketoken123`)만 사용.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **`state.js`·`boot.js` 외 무접촉 준수** — 착수 시점에 손 B가
  B-83으로 `utils.js`·`scraps-import.js`·`scraps-render.js`·
  `scraps-form.js`·`properties.js`를 작업 중(커밋 안 된 상태)이었음.
  커밋마다 매번 `git status` 확인해 내 파일(`state.js`)만 스테이징,
  Codex의 진행 중 작업(5개 파일)은 전혀 건드리지 않음. `HISTORY.md`도
  Codex가 아직 손대지 않은 상태를 확인 후 내 항목만 추가.
- 스키마 변경 없음 — `sh_unsynced`는 `state` 객체 필드가 아니라
  독립적인 localStorage 플래그라 `state.js` 상단 JSDoc 스키마 갱신
  대상 아님.
- 기존 800ms 디바운스 값·localStorage 즉시 저장 semantics 전부
  무변경 — maxWait는 "5초 넘도록 디바운스가 계속 리셋되는 경우"에만
  개입.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 이번 세션은 커맨드센터의 "심층 코드 감사 2건"(보안 / 상태·레거시)
  결과 등록된 B-80~B-89 중 최우선(🔴 데이터 유실) 항목. 직전
  세션들: ... → B-72+B-74(카드 가독성+레이아웃) → **이번 세션(B-84,
  검증 완료) — 저장 유실 방지**. 손 B의 B-83(보안 방어 강화 묶음)과
  파일 무충돌 병렬 진행(`state.js` vs `utils.js`/`scraps-*.js`/
  `properties.js`). 착수 순서상 다음은 B-80(저장 실패 표시)·나머지
  B-8x 감사 항목들.
