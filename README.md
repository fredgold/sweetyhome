# 스위티홈 — Vercel 배포용

결혼·내집마련 준비 보드. 클로드 아티팩트 버전을 **본인 Vercel에 올려** 쓰는 패키지입니다.

## 아티팩트 버전과 뭐가 다른가

| | 아티팩트(게시) | 이 Vercel 버전 |
|---|---|---|
| 저장 | window.storage (계정, 기기 동기화) | **localStorage** (이 브라우저에만, 기기별 분리) |
| AI 호출 | 키 없이 자동 | **서버리스 함수 + 본인 API 키** |
| 주소 | claude.ai 안 | 본인 도메인 |

> 기기 간 동기화가 필요하면, 화면의 **⬆ 내보내기 / ⬇ 가져오기**로 백업 코드를 옮기면 됩니다. (또는 아래 "다음 단계"에서 Vercel KV로 업그레이드)

## 폴더 구조

```
sweetyhome-vercel/
├── index.html        # 앱 본체 (저장=localStorage, AI=/api/messages 호출)
├── api/
│   └── messages.js   # Anthropic API 프록시 (본인 키 사용)
├── package.json
├── vercel.json
└── README.md
```

## 배포 (Claude Code 사용)

1. 이 폴더를 작업 폴더로 두고 Claude Code 실행.
2. Vercel CLI 로그인이 안 돼 있으면: `vercel login`
3. 배포: `vercel`  (처음엔 프로젝트 생성 질문 몇 개 → 엔터로 진행), 운영 배포는 `vercel --prod`
4. **환경변수 설정**(중요): Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 에 추가
   - `ANTHROPIC_API_KEY` = 본인 API 키 (https://console.anthropic.com)
   - (선택) `ANTHROPIC_MODEL` = 서버에서 사용할 모델 ID (미설정 시 Haiku)
   - CLI로도 가능: `vercel env add ANTHROPIC_API_KEY`
5. 환경변수 추가 후 **재배포**: `vercel --prod`

> Claude Code에게 "이 폴더 Vercel에 배포하고 ANTHROPIC_API_KEY 환경변수 안내해줘"라고 시키면 위 과정을 대신 진행해 줍니다.

## 주의 — API 키 비용/보안

- AI 호출은 본인 키로 과금됩니다(매물 분석·자동 평가·상담·자산 정리·위치 찾기).
- `/api/messages`는 Bearer 세션 인증과 세션별 호출 제한을 통과해야 사용할 수 있습니다.
- 브라우저 코드에 공유 Secret을 넣으면 사용자에게 노출되므로 추가 보안 수단이 되지 않습니다.
- `web_search`를 쓰는 기능(매물 분석/평가/상담/위치찾기)은 키 권한·요금제에 따라 동작이 달라질 수 있습니다.
  오류가 나면 해당 호출의 `tools`에서 web_search를 빼면 검색 없이 동작합니다.

## 모델명이 안 맞을 때

`api/messages.js`가 기본으로 Haiku를 사용합니다. 서버에서 다른 모델을 쓰려면
`ANTHROPIC_MODEL` 환경변수에 가능한 모델 ID를 넣으세요.

## 데이터

- 입력값은 이 브라우저의 localStorage에 저장됩니다(새로고침해도 유지, 단 기기/브라우저마다 별도).
- 정기 백업은 화면의 **⬆ 내보내기**로 코드를 복사해 보관하세요.

## 다음 단계 (선택) — 기기 간 동기화

부부가 각자 폰에서 같은 데이터를 보려면 localStorage 대신 서버 저장이 필요합니다.
Vercel KV(또는 Postgres)를 붙여 `/api/state` 저장/불러오기 함수를 추가하면 됩니다.
원하면 그 버전으로 업그레이드해 드릴게요.
