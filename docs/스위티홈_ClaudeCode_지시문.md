# 스위티홈 디자인 시스템 반영 — Claude Code 지시문

> VS Code의 Claude Code에 단계별로 붙여넣어 실행하세요.
> **한 STEP씩 실행 → 결과 확인 → 다음 STEP.** 한 번에 다 시키지 마세요.
> GitHub→Vercel 자동배포이므로 STEP마다 작은 커밋으로 나눕니다.

---

## 준비 (한 번만)

1. 스타일가이드 파일 `스위티홈 스타일가이드.dc.html`을 프로젝트에 넣어두세요(예: `docs/style-guide.html`). **인라인 SVG 아이콘 11종의 정확한 path·viewBox·stroke 값이 이 파일에 들어있으니, Claude Code가 아이콘 마크업을 그대로 복사할 원본(single source of truth)으로 씁니다.**
2. 시작 전 Claude Code에 아래 불변 제약을 먼저 알려주세요:

```
[불변 제약]
- 단일 index.html 유지. 새 CSS/JS 파일·프레임워크·번들러·아이콘폰트·외부 SVG 라이브러리 도입 금지.
- 기존 색상 hex 값 절대 변경 금지. 상태 저장 스키마(sweetyhome 상태 키) 건드리지 말 것.
- 반응형 브레이크포인트는 760px, 480px 2단계만. 새 단계 추가 금지.
- 아이콘은 손으로 넣는 인라인 SVG만 사용(docs/style-guide.html의 path를 복사).
- 각 STEP 후 멈추고 내 확인을 받는다. STEP 단위로 커밋한다.
```

---

## STEP 1 — 토큰 추가 (`:root`)

`style.css` 최상단 `:root`에 **아래 신규 토큰만 추가**한다. 기존 색·반경 토큰은 그대로 둔다(값 변경 없음).

```css
:root{
  /* 여백 — 기존 sm/md 유지 + 상위 3단 신규 */
  --gap-lg:12px; --gap-xl:16px; --gap-2xl:24px;

  /* 타이포 스케일 (Pretendard) — 신규 */
  --fs-micro:11px; --fs-label:12px; --fs-body:14px; --fs-body-lg:15px;
  --fs-title:17px; --fs-head:20px; --fs-display:24px;
  --lh-tight:1.3; --lh-body:1.55;

  /* 그림자 — 잉크 저투명(순수 검정 금지), 신규 */
  --shadow-card:0 1px 2px rgba(30,37,34,.05);
  --shadow-pop:0 6px 18px rgba(30,37,34,.10);
  --shadow-modal:0 16px 40px rgba(30,37,34,.16);

  /* 포커스 링 — 신규 */
  --focus-ring:0 0 0 3px rgba(199,161,74,.38);
}
```

**커밋:** `design: add spacing/type/shadow/focus tokens`
**확인 포인트:** 화면 변화 없어야 정상(토큰만 추가).

---

## STEP 2 — 반경 드리프트 정리

`border-radius`가 하드코딩된 5~12px 잔여값을 **역할 토큰으로 치환**한다:
- 일반/중간강조 버튼·select·input → `var(--radius-md)` (10px)
- 칩·작은 입력·마이크로버튼 → `var(--radius-sm)` (8px)
- 카드·시트·드롭다운 패널 → `var(--radius-card)` (13px)
- pill 버튼·상태칩 → `var(--radius-pill)` (999px). 남은 `border-radius:20px`도 pill로.

**커밋:** `design: normalize radius to role tokens`
**확인 포인트:** 버튼 모서리가 티어별로 일관되게. 시각적으로 거의 동일해야 함.

---

## STEP 3 — 골드 텍스트 감사 (대비 수정)

`color:#C7A14A`(또는 `var(--line9)`)로 **텍스트**를 칠한 모든 용례를 찾아 교체:
- 큰/굵은 골드 라벨 → `var(--line9-deep)` (#9A7B2E)
- 작은 본문·보조 텍스트 → `var(--ink)` 또는 `var(--ink-soft)`
- **골드 #C7A14A는 아이콘·배지 배경·하이라이트에만 남긴다(텍스트 금지).**
- 골드 배경 버튼 위 텍스트는 흰색이 아니라 `var(--ink)`(#1E2522)로.

**커밋:** `design: fix gold text contrast (use line9-deep/ink)`

---

## STEP 4 — 상호작용 상태 + 포커스 (버튼·입력 공통)

`.btn`(및 입력) 공통 규칙 추가:

```css
.btn:hover{background:#F3F2EC;border-color:#C9CBC3}
.btn:active{transform:translateY(1px)}
.btn:focus-visible{outline:none;box-shadow:var(--focus-ring)}
.btn:disabled{background:#F7F6F1;color:var(--ink-faint);
  border-color:var(--hairline-soft);cursor:not-allowed}
input:focus-visible, select:focus-visible{outline:none;box-shadow:var(--focus-ring);border-color:var(--line9)}
```
- `:focus`가 아니라 `:focus-visible`로 걸어 마우스 클릭엔 링이 안 뜨게.
- disabled는 색만으로 구분하지 말고 `cursor:not-allowed` 병행.

**커밋:** `design: add hover/active/focus-visible/disabled states`

---

## STEP 5 — 인라인 SVG 아이콘 인프라

`style.css` 하단에 `.ic` 공통 클래스 추가:

```css
.ic{width:1.15em;height:1.15em;vertical-align:-.15em;
  stroke:currentColor;fill:none;stroke-width:1.7;
  stroke-linecap:round;stroke-linejoin:round;flex:none}
.ic-lg{width:20px;height:20px} /* 탭바 등 크기 오버라이드용 */
```
아직 이모지는 안 건드린다. 클래스 정의만.

**커밋:** `design: add .ic inline-svg base class`

---

## STEP 6~10 — 이모지 → SVG 교체 (탭별로 분할, 각각 별도 커밋)

`docs/style-guide.html`의 아이콘 세트를 원본으로, 아래 매핑대로 교체.
**SVG로 교체:** 🏠→ic-home · 📍→ic-pin · 🗺️→ic-map · 🔗→ic-link · 🔍→ic-search · 📋→ic-copy · 📥→ic-paste · 건물→ic-building · 지하철→ic-transit · 시세→ic-price · 내보내기→ic-export
**텍스트 기호 유지(교체 안 함):** 완료 ✓ · 추가 ＋ · 외부링크 ↗ · 삭제·닫기 ✕ · 새로고침 ↻
**폐기(중복 제거):** ✔✅→✓ / ✗❌→✕ / 🔎→🔍(ic-search) / ➕→＋ / 🔄→↻

각 STEP 공통 규칙:
- 아이콘만 있는 버튼(글자 없음)에는 **`aria-label` 필수** (예: `<button class="…" aria-label="검색">`). 장식용 인라인 SVG에는 `aria-hidden="true"`.
- 행 표식 SVG(ic-building/transit/price/export)는 항상 무채색 `#9AA09B`(currentColor가 회색이 되도록 부모 색 지정). 컬러 금지.

> **STEP 6 — 매물탭 (가장 밀도 높음, 먼저).**
> 매물 카드 장식 아이콘 제거 + 상태칩 재작업까지 여기서 함:
> - 제거(순수 장식): ✨(제목) 🏢🚇🏠📊(텍스트로 자명) — 삭제.
> - 정보 행 앞에는 무채색 행 표식(ic-building/transit/pin/price)만.
> - 액션(지도·링크·임장)은 클릭 대상이므로 버튼으로 유지, ic-map/ic-link 사용.
> - 상태칩: **채운 배경 → dot(색점) + 좌측 3px 테두리, 텍스트는 `var(--ink)`.** (없는 --st-wash/deep 토큰 만들지 말 것.)
> - 목표: 카드당 이모지 9개 → 2~3개.
> **커밋:** `design: svg icons + card cleanup (listings tab)`
> **여기서 멈추고 확인받기.**

> **STEP 7 — 대시보드/자산탭** → 커밋 `…(dashboard/assets)`
> **STEP 8 — 액션탭** → 커밋 `…(actions)`
> **STEP 9 — 수집함탭** → 커밋 `…(collection)`
> **STEP 10 — 헤더/전역**(🏠 대시보드아이콘·외부링크 ↗ 분리 포함) → 커밋 `…(header/global)`

---

## STEP 11 — 모바일 툴바 재구성 (매물탭 375px)

매물탭 상단 6개 컨트롤을 재배치:
- **상시 노출 2개:** 정렬 select + `＋ 매물추가`(T3 CTA)
- **⋯ 더보기 드롭다운으로 접기 4개:** 시트붙여넣기 / 내보내기(형식select+실행을 한 행으로 묶음) / 임장루트
- **기존 "플로팅 드롭다운 메뉴" 컴포넌트를 재사용**(매물 상태변경·임장루트 목록에서 쓰던 것). 새 컴포넌트 만들지 말 것.
- 헤더 5개도 동일 패턴: 상시 [프로필][잠금] + ⋯로 나머지.
- 수집함 마크다운 에디터 9개 툴바는 **가로 스크롤 스트립**(`overflow-x:auto`), 480px에서 wrap 금지.
- 액션탭 추가폼 3개는 현행 줄바꿈 유지.

**커밋:** `design: mobile toolbar (overflow menu + scroll strip)`

---

## 완료 후 검증

- [ ] 각 탭 375px에서 툴바가 깨지지 않는지(스크린샷 확인)
- [ ] 아이콘 전용 버튼에 aria-label이 다 붙었는지
- [ ] 골드로 칠한 텍스트가 남아있지 않은지(`color:#C7A14A` grep)
- [ ] 저장/불러오기(상태 키 sweetyhome) 정상 동작 — 스키마 안 깨졌는지
- [ ] 값 변경 없음: 기존 색 hex가 그대로인지

---

### 참고: 왜 이렇게 쪼개나
바닐라 단일 파일에서 이모지를 SVG로 일괄 치환하는 건 실수가 나기 쉬운 작업입니다. 탭별 커밋으로 나누면 문제 생겼을 때 어느 커밋에서 깨졌는지 바로 되돌릴 수 있고, Vercel 배포도 단계별로 확인할 수 있습니다.
