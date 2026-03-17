<!--
Sync Impact Report:
- Version change: N/A -> 1.0.0
- List of modified principles:
  - PRINCIPLE_1: 블록 기반 콘텐츠 아키텍처 (Block-Based Content Architecture)
  - PRINCIPLE_2: 중앙 집중식 상태 관리 (Centralized State Management)
  - PRINCIPLE_3: 타입 안전한 데이터 영속성 (Type-Safe Data Persistence)
  - PRINCIPLE_4: 테스트 주도 개발 및 엄격한 검증 (TDD & Rigorous Validation)
  - PRINCIPLE_5: 현대적 UI/UX 및 성능 최적화 (Modern UI/UX & Performance)
- Added sections:
  - 개발 워크플로우 (Development Workflow)
  - 보안 및 데이터 무결성 (Security & Data Integrity)
- Removed sections: None
- Templates requiring updates:
  - cli\.specify\templates\plan-template.md (Updated Constitution Check section)
  - cli\.specify\templates\tasks-template.md (Added reflection tasks to Polish phase)
- Follow-up TODOs: None
-->

# Quote Builder Constitution

## Core Principles

### I. 블록 기반 콘텐츠 아키텍처 (Block-Based Content Architecture)
`BlockNote` 에디터를 핵심 인터페이스로 사용합니다. 모든 견적서 내용은 독립적인 '블록' 단위로 관리되며, 특히 가격표(Pricing Table) 블록은 산술 연산 로직과 결합되어 실시간 금액 계산을 보장해야 합니다.

### II. 중앙 집중식 상태 관리 (Centralized State Management)
`Zustand`를 사용하여 애플리케이션의 전역 상태를 단일 소스로 관리합니다. 복잡한 블록 편집 상태와 견적서 메타데이터(제목, 상태, 총액 등)는 스토어 내에서 원자적으로(atomically) 업데이트되어야 하며, 불필요한 리렌더링을 방지해야 합니다.

### III. 타입 안전한 데이터 영속성 (Type-Safe Data Persistence)
`Prisma`와 `PostgreSQL`을 사용하여 데이터를 저장하며, 블록 데이터는 JSONB 컬럼으로 관리합니다. 모든 DB 입출력 데이터는 `TypeScript` 인터페이스와 `Zod` 스키마를 통해 런타임 및 컴파일 타임 모두에서 타입 안전성을 보증받아야 합니다.

### IV. 테스트 주도 개발 및 엄격한 검증 (TDD & Rigorous Validation)
모든 기능 구현은 Red-Green-Refactor 주기를 따릅니다. 특히 복잡한 금액 계산 로직이나 블록 변환 로직은 단위 테스트를 통해 엣지 케이스까지 완벽히 검증되어야 합니다. 프로덕션 코드에 `any` 타입 사용과 `console.log` 잔류는 엄격히 금지됩니다.

### V. 현대적 UI/UX 및 성능 최적화 (Modern UI/UX & Performance)
`Next.js App Router` 패턴을 준수하며 서버 컴포넌트(데이터 패칭)와 클라이언트 컴포넌트(인터랙션)를 명확히 분리합니다. `Tailwind CSS`와 `shadcn/ui`를 사용하여 일관된 디자인 시스템을 유지하고, `cn` 유틸리티를 통한 스타일 병합을 표준으로 합니다.

## 개발 워크플로우 (Development Workflow)

모든 작업 유닛(Track) 완료 후에는 반드시 회고 분석을 수행합니다. "무엇이 작동했고 무엇이 실패했는지" 분석하여 도출된 핵심 규칙을 `doc/COMMON_MISTAKES.md` 및 `doc/LESSONS_LEARNED.md`에 즉시 업데이트합니다. 이는 팀의 지식 자산으로서 다음 작업의 가이드라인이 됩니다.

## 보안 및 데이터 무결성 (Security & Data Integrity)

클라이언트에서 전달되는 모든 블록 데이터는 서버 측 API 경계에서 재검증되어야 합니다. 특히 `totalAmount`와 같은 민감한 데이터는 클라이언트 값에 의존하지 않고 서버에서 블록 데이터를 바탕으로 재계산하여 데이터 무결성을 유지합니다.

## Governance

본 헌법은 Quote Builder 프로젝트의 모든 개발 관행 및 기술 결정에 우선합니다. 모든 Pull Request 및 코드 리뷰 과정에서 헌법 준수 여부를 확인하며, 위반 사항 발견 시 승인이 거부될 수 있습니다. 헌법의 개정은 명확한 제안, 토론, 승인 및 영향 분석 보고서 작성을 거쳐 이루어져야 합니다.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-17
