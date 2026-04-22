# FleetSense — Claude Code 규칙

## 절대 규칙 (99% Figma 재현)

1. **모든 디자인은 Figma MCP로 읽어서 구현한다**
   - Figma 노드 ID를 받으면 먼저 `get_design_context`로 스펙 확인
   - 추측으로 값을 쓰지 않는다 (px, padding, margin, font 모두 실측)

2. **아이콘은 절대 변형 금지**
   - lucide-react / heroicons 등 외부 라이브러리 사용 금지
   - Figma에서 vector export한 SVG를 `src/components/icons/`에 저장
   - export 시 stroke/fill은 `currentColor`로 바꿔 색상 제어 가능하게
   - 파일명은 Figma 아이콘 이름 그대로 (예: `chevron-right.svg`)
   - 새 SVG 추가 후 `npm run build:icons` 실행 → `index.tsx` 자동 재생성

   **사용 예시:**
   ```tsx
   import { ChevronRightIcon, NavUtilizationIcon } from "@/components/icons";

   <ChevronRightIcon className="h-4 w-4 text-fg-tertiary" />
   <NavUtilizationIcon className="h-[18px] w-[18px] text-fg-brand-primary" />
   ```
   - 색상은 `text-*` 토큰으로 제어 (currentColor가 받음)
   - 크기는 `h-* w-*` 토큰으로 제어 (SVG 자체에는 width/height 없음)

3. **모든 색상은 토큰만 사용**
   - hex 값 직접 쓰기 금지
   - Tailwind 기본 팔레트 금지 (`bg-blue-500` 등)
   - 오로지 `@theme`에 정의된 변수 기반 클래스만 사용

4. **간격/크기도 토큰만**
   - 임의의 `p-[17px]` 금지
   - `@theme`의 `--spacing-*`, `--radius-*` 사용

5. **테이블 셀 치수는 Figma 실측값**
   - header cell, body cell의 height/padding 모두 Figma에서 읽어 구현
   - 컬럼 너비도 Figma와 동일 비율

## 구현 순서 (일관성을 위해)

1. 디자인 토큰 → 완료
2. 원시 컴포넌트 (Button, Input, Badge, Avatar, Card) — Figma Symbol 기반
3. 복합 컴포넌트 (Table header, Table row, KPI Card, Chart wrapper)
4. 레이아웃 셸 (Row A + Row B)
5. 페이지 — utilization/overview부터

각 컴포넌트 완성 후 반드시:
- Figma 원본과 스크린샷 비교
- preview 툴로 실제 렌더링 확인
- 차이 있으면 코드 수정 후 재검증

## 파일 네이밍
- 컴포넌트: PascalCase (Button.tsx)
- 훅: use-*.ts
- 유틸: kebab-case.ts

## 상태 관리
- 페이지 상태: URL 파라미터 우선
- 글로벌: 현재 단계에선 불필요, 필요 시 zustand

## Mock 데이터
- 모든 페이지용 더미 데이터는 `lib/mock-data.ts`에 집중
- 타입 정의 포함, 실제 API 교체 쉽게

## 다크모드
- 현재 구현 안 함 (복잡도 관리)
- globals.css의 .dark 블록은 그대로 둠 (나중에 활성화)

## 작업 시 확인사항
- 사용자가 Figma node ID를 주면 get_design_context 먼저
- Figma 스펙과 다르면 반드시 지적하고 재확인 요청
