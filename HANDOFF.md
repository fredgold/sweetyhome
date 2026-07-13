# HANDOFF — B-18 등급컷·경고선 settings 정지 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-18 처리(B-38의 선행 조건 — 같은 `state.js`/`properties.js`를
건드려 순차 진행 필요했음). 하드코딩된 등급 임계값·경고선을 `settings`/`profile`
로 이행하고, 감사(2026-07-13)에서 발견된 중복(`calcHouseholdGrade`↔`calcG`)·
미연동(경고선이 profile과 안 연결됨) 버그를 함께 제거. **핵심 제약: 동작 변화 0
(무회귀 리팩터)**.

## 2. 완료
**커밋 완료. push 대기 없이 바로 push함(사용자가 이전 턴에서 "일단 Push하자"로
push 기본 선호를 밝힘).**

```
4181bd1 refactor: B-18 등급컷·경고선 settings 정지 + 세대수컷 중복 제거
```

- **중복 제거**: `state.js`의 인라인 `calcG`와 `properties.js`의
  `calcHouseholdGrade`가 완전히 동일한 로직으로 중복 존재하던 것을 `utils.js`
  (두 파일보다 먼저 로드)로 단일화. `getAreaGrade`도 같은 자리로 이동하며
  `calcAreaGrade`로 이름 통합. 둘 다 `grades` 인자를 받는 순수함수(인자 없으면
  `GRADE_DEFAULTS` 폴백)로 재설계.
- **`settings.grades` 신설**: `{area:[85,60], households:[1000,500,300,150],
  bigComplex:500}`. `DEFAULT`/`GUEST_STATE` 양쪽 + `applyGuards()` 개별 키
  보정 가드.
- **경고선 참조화**: 보증금 `dn>5`→`profile.depositRange` 상한 파싱값(신설
  `parseDepositUpper()`, 실패 시 기존 5 폴백), 면적 `a>85`→`profile.maxArea`,
  대단지 자동판정 `sedN>=500`→`settings.grades.bigComplex`.
- **문구 연동**: `CHECKLIST` k4 설명문의 하드 문자열 `500`을
  `GRADE_DEFAULTS.bigComplex` 참조로.

### 검증 방법
`node --check`(3개 파일)/`git diff --check` 통과. Playwright로 리팩터 전/후
**경계값 실측 비교**(전부 exact match):
- 면적 등급 4개 경계(85/84/60/59), 세대수 등급 8개 경계(1000/999/500/499/300/
  299/150/149) — 전부 기존 텍스트와 정확히 일치.
- 보증금 경고선(5.0/5.1억), 면적 경고선(85/86㎡), k4 자동판정(500/499세대) —
  전부 기존과 동일한 on/off 경계.
- `applyGuards({})`(완전 빈 raw) → `settings.grades`가 `GRADE_DEFAULTS`와
  완전 동일. `applyGuards({settings:{grades:{bigComplex:999}}})`(일부 키만
  있는 구버전 시뮬레이션) → 나머지 키는 기본값 보정, 커스텀 값은 유지.
- 레거시 `state.properties[]` 마이그레이션 경로(750세대 매물)도 여전히
  `'500세대+'`로 정확히 계산됨을 확인.
- `grep`으로 `state.js`에서 세대수컷 리터럴(1000/500/300/150)이 등급 계산
  로직상 완전히 사라졌음을 확인(남은 매치는 JSDoc·무관한 필드·데모 텍스트뿐).
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거,
  테스트 스크립트·임시 서버는 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- **B-38(단지 판단메모 구조화) 착수 준비 완료** — 이번 B-18이 그 선행 조건이었음.
  사용자가 이미 B-38 지시서를 전달했으므로 이어서 진행 예정.
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright로만 확인, 리팩터라
  화면 변화는 없음 — 회귀 없는지가 핵심이었고 이는 위 경계값 테스트로 검증됨).
- B-27(안전Gate)이 이 `settings.grades` 위에 올라갈 예정 — 다음 단계에서 참고.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js·style.css 무접촉** — 지시서대로 `state.js`/`utils.js`/`properties.js`
  3개 파일만 수정.
- `calcHouseholdGrade`/`calcAreaGrade`는 이제 `utils.js`가 유일한 정의처 —
  향후 다른 파일에 같은 이름으로 재정의하면 로드 순서상 나중 파일이 이겨
  utils.js 버전이 죽은 코드가 되므로 절대 재정의하지 말 것.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- "기록·관리 중심 CRM(P0)" 그룹 순서: B-28(완료) → **B-18(이번 세션 완료)** →
  B-38(단지 판단메모, 다음) → B-39(후보 우선순위) → B-37(대표매물 최저가).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → B-12 관련 다수 작업 → ... →
  B-50 → B-51 → B-28(`bb3eccc`) → **이번 세션(B-18, `4181bd1`)** → (다음: B-38).
