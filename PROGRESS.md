# FleetSense 작업 진행 상황

## 1. Primary Request and Intent

사용자는 `/Users/leeminju/fleetsense`에서 "FleetSense" 포트폴리오 프로젝트를 빌드 중인 프로덕트 디자이너. 최상위 목표는 플릿 매니지먼트 대시보드의 **99% 픽셀 정확도 Figma-to-code fidelity**.

명시적 요청 (시간 순):
- Next.js 14 + TypeScript strict + Tailwind v4 (@theme) 프로젝트 생성 — 폴더 구조, CLAUDE.md 규칙, .claude/config.json 포함
- `/Users/leeminju/fleetsense-tokens/globals.css`를 프로젝트로 복사 후 Tailwind v4 @theme 문법으로 변환
- Figma DesignSystem 파일(`VeKcCTBokX7wng9f8JMIBd`)에서 모든 아이콘을 SVG로 추출, currentColor로 변환, width/height 제거, React 컴포넌트 자동 생성
- Figma 노드 464:10440, 464:10449와 일치하는 TableHeader/TableCell 컴포넌트를 1px 정확도로 빌드
- 전체 utilization/overview 페이지(Figma 노드 273:6077)를 섹션별로 preview 검증하며 구현
- 최종 명시 요청 (요약 이전):
  - 컬럼 차트의 파란 대시 레퍼런스 라인을 막대 **뒤로** 보내기 (z-order 수정)
  - Table 헤더 개별 셀의 좌/우 border 제거 (Figma 재비교)
  - Daily Utilization Status 카드 높이를 우측 3개 Mini Metric 카드 총 높이와 **정확히** 일치시키기
  - "일단 너가 확인한 에러만 수정해줄래"
  - 같은 구현 패턴을 다른 utilization 페이지(activity, vehicle-deep-dive, group-comparison)에도 적용

## 2. Key Technical Concepts

- Next.js 14 App Router + TypeScript strict
- Tailwind v4 `@theme` 디자인 토큰 (컬러, spacing, radius, typography)
- Figma MCP (get_design_context, get_screenshot, get_metadata, use_figma, get_variable_defs)
- Figma plugin API SVG export: `node.exportAsync({ format: 'SVG_STRING' })`
- Recharts v3 (BarChart, PieChart, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid)
- Recharts v3 버그들:
  - Pie에 `startAngle=90/endAngle=-270` 시 `isAnimationActive={false}` 없으면 슬라이스 렌더 실패
  - Bar에 `radius` prop 주면 바가 3px 높이로 붕괴
- TanStack React Table로 DataTable 래핑
- SVG 렌더링 순서 (DOM 뒤쪽일수록 위에 그려짐)
- currentColor 패턴 (아이콘)
- SVG fill 속성에 CSS 커스텀 프로퍼티 사용 (`fill="var(--utility-error-500)"`)

## 3. Files and Code Sections

- `src/app/globals.css`
  - `@theme` 블록 + `:root`/`.dark` raw 토큰 레이어
  - `--text-quaternary: #717680` (from #5d6b98), `--bg-secondary: #fafafa` (from #f9f9fb)
  - 타이포그래피 line-height 오버라이드 추가: `--text-xs: 12/18`, `--text-sm: 14/20`, `--text-xl: 20/30`, `--text-display-sm: 30/38`
  - **마지막 편집(잘못된 임시 수정)**: SVG `<g>`에 `display: flex; order: -1` 적용 시도 — SVG는 flexbox를 지원하지 않으므로 작동 안함. 되돌려야 함.

- `src/components/tables/TableHeader.tsx`
  - Figma 노드 464:10440 스펙 (h-44, bg-secondary, border top/bottom/left, right 0)
  - **유저 요청: border-l 제거 필요** — Figma에서 헤더 셀 사이에 좌우 border 없음

- `src/components/tables/TableCell.tsx`
  - Figma 노드 464:10449 (h-72, bg-primary, border 없음, px-24 py-16)
  - 1px preview_eval 검증 완료

- `src/components/tables/FleetVehiclesTable.tsx`
  - 10개 컬럼 테이블: Vehicle (Avatar + name), Utilization (ProgressBar + %), Status, Distance, Trips, Days used, Driving Hours, Idle Hours, Fuel(L), MPG badge, chevron

- `src/components/charts/UtilizationColumnChart.tsx`
  - 11개 바 카테고리 (inactive/under/optimal/over)
  - 50% ReferenceLine, strokeDasharray="6 4", var(--fg-brand-primary)
  - Bar radius prop 제거됨 (3px 붕괴 버그)
  - **유저 요청: reference line 막대 뒤로**

- `src/components/charts/FleetCompositionDonut.tsx`
  - startAngle={90} endAngle={-270} 시계 방향 12시부터
  - isAnimationActive={false} 필수

- `src/components/charts/DailyUtilizationStackedBar.tsx`
  - 7일 × 4카테고리 스택 바, maxBarSize={56}

- `src/app/(dashboard)/utilization/overview/page.tsx`
  - 6개 섹션 조립: PageHeader, AlertBanner, 3 MetricsCards, ChartSection 1, ChartSection 2, Table Section
  - 10대 차량 mock fleetRows

- `scripts/build-icons.mjs` + `scripts/strip-kpi-bg.mjs`
  - build-icons: `src/components/icons/*.svg` 스캔 → React 컴포넌트 생성 (kebab→Pascal + "Icon" 접미사, {...props} 스프레드)
  - strip-kpi-bg: 27개 kpi-sm/md/neutral 아이콘의 선행 `<rect>` 배경 제거

- `CLAUDE.md`
  - Figma 전용 아이콘, 토큰 전용 컬러/스페이싱, 99% 픽셀 fidelity 규칙

## 4. Errors and Fixes

- **KPI 아이콘이 솔리드 블루 사각형으로 보임**: KPI sm 아이콘에 `<rect fill="currentColor"/>` 배경이 내장되어 KpiIconBadge의 `bg-brand-50 text-brand-600`과 겹쳐 rect와 stroke가 모두 brand-600이 되어 안 보임. `scripts/strip-kpi-bg.mjs`로 선행 rect 제거.

- **Recharts Pie 슬라이스 안 보임**: startAngle=90, endAngle=-270일 때 slice `<path>` 렌더 실패. `isAnimationActive={false}` 추가로 해결.

- **Recharts Bar가 3px로 붕괴**: `radius={[2,2,0,0]}`로 인해 코너 radius arc만 렌더. radius prop 완전 제거로 해결.

- **도넛 회전/순서 불일치**: 기본 Recharts는 3시 방향부터 반시계. `startAngle={90} endAngle={-270}` + 데이터 순서 `[Optimal, Under, Inactive, Over]`로 Figma 시계 방향 매칭.

- **npx tsc 실패**: `./node_modules/.bin/tsc --noEmit`로 해결.

- **파란 레퍼런스 라인이 바 위에 그려짐 (유저 지적, 미해결)**: DOM 검사 결과 `recharts-reference-line`이 `recharts-bar` 뒤에 있어 위에 그려짐. CSS flexbox `order: -1` 시도는 잘못된 접근 (SVG는 flexbox 미지원).

유저 피드백 정리:
- 토큰 불일치 시 Figma 값을 source of truth로 선택
- 셀 높이는 intrinsic 52px보다 고정 72px 선택
- hover/variants 스킵, 베이스만 먼저 빌드
- Mini Metric 높이와 차트 카드 높이는 정확히 일치해야 함
- 테이블 헤더 셀은 좌/우 border 없어야 함
- "일단 너가 확인한 에러만 수정해줄래"

## 5. Problem Solving

해결됨:
- Next.js 14 + Tailwind v4 셋업 (PostCSS 설정 포함)
- text-xs/text-sm/text-xl line-height Tailwind v4 @theme 오버라이드
- 47→54 아이콘 추출 + 자동 생성 파이프라인
- Recharts 렌더링 버그 (Pie 애니메이션, Bar radius)
- 도넛 회전 및 순서 매칭

진행 중:
- Reference line z-order (현재 CSS 접근은 틀림)
- TableHeader border-l 제거
- Daily Utilization Status 카드와 Mini Metric 3개 카드 높이 정렬

## 6. All User Messages (non-tool)

1. 초기 프로젝트 셋업 요청 (Next 14, Tailwind v4, 폴더 구조, CLAUDE.md)
2. "네" (Figma 아이콘 추출 진행 확인)
3. "진행 잘 하고 있어?"
4. "네"
5. Figma 파일 URL 제공
6. 아이콘 추출 옵션 선택
7. Figma 노드 464:10440, 464:10449 (TableHeader/TableCell)
8. 토큰 불일치 답변 (Figma 값, 72px 고정, variants 없음)
9. Figma 노드 273:6077 전체 페이지 1:1 구현 요청
10. "현재 상태 리뷰/수정부터 하자"
11. "진행 하자" (ChartSection 2)
12. "현재 나온 디자인은 어떻게 확인할수 있어?"
13. "응" (브라우저 오픈)
14. 최종 지시:
    - 컬럼 차트 파란 라인을 막대 뒤로
    - 테이블 헤더 셀 좌우 border 없음 (Figma 재비교)
    - Daily Utilization Status 카드 높이 = 3 Mini Metric 카드 총 높이
    - "일단 너가 확인한 에러만 수정해줄래"
    - "이렇게 utilization의 다른 페이지들도 작업해줘"
    - "아직도 안도?"

## 7. Pending Tasks

- UtilizationColumnChart 파란 대시 레퍼런스 라인 z-order 막대 뒤로 — 현재 CSS 수정은 틀림, Recharts 기반 솔루션 필요
- TableHeader.tsx에서 `border-l` 제거
- Daily Utilization Status 카드 높이를 Mini Metric 3개 스택과 정확히 매칭 (명시적 높이 또는 grid/align-stretch)
- 나머지 utilization 페이지 구현:
  - `/utilization/activity`
  - `/utilization/vehicle-deep-dive`
  - `/utilization/group-comparison`
- utilization/overview 재검증
- 각 페이지에 동일한 1:1 Figma fidelity 적용

## 8. Current Work

마지막 작업: UtilizationColumnChart의 파란 대시 레퍼런스 라인 z-order 수정 시도 중.

유저 인용: "이 부분에서 파란 선이 막대 그래프 뒤로 가도록 해줘"

`preview_eval`로 DOM 순서 조사:
```
1. recharts-cartesian-grid
2. recharts-layer recharts-bar
3. recharts-layer recharts-reference-line  ← 위에 그려짐
4-7. axes
```

`globals.css`에 다음 CSS 추가 (틀린 접근):
```css
.recharts-wrapper svg > g .recharts-reference-line { order: -1; }
.recharts-wrapper svg > g { display: flex; }
```

SVG `<g>`는 CSS flexbox/order를 따르지 않으므로 작동 안함. 유저는 이후 테이블 border-l 제거, 카드 높이 매칭 추가 요청 + "확인한 에러만 수정" + 다른 페이지로 확장 지시.

## 9. Optional Next Step

1. globals.css의 틀린 CSS 되돌리기
2. Recharts z-order를 올바르게 수정 — `<Customized />` 컴포넌트를 `<Bar>` **앞에** 배치 (Recharts는 JSX 순서 존중), 또는 `<CartesianGrid horizontalPoints>`로 평균 y값에 커스텀 대시 라인 그리기
3. TableHeader.tsx에서 `border-l` 제거 (Figma utilization/overview 헤더 셀은 수직 구분선 없음)
4. utilization/overview 페이지에서 Daily Utilization Status CardPanel 높이를 Mini Metric 3개 스택과 매칭 — `items-stretch` + 양쪽 자식이 높이 채우도록
5. preview로 검증
6. 이후 다른 utilization 페이지들(activity, vehicle-deep-dive, group-comparison)을 동일한 1:1 Figma 패턴으로 구현

유저 최근 메시지 직접 인용:
> "그래프에서 이 테이블 탑 바의 각각의 셀의 좌우 보더는 없어 다시 피그마 utilization/overview를 비교해봐바"
> "여기서 Daily Utilization Status부분 카드 높이와 옆의 세개 차트 카드의 높이가 딱 맞아 떨어져야해"
> "일단 너가 확인한 에러만 수정해줄래"
> "이렇게 utilization의 다른 페이지들도 작업해줘"

## 다음 할 일

- utilization/overview 첫 드래프트 수정
- 인터랙션 추가
