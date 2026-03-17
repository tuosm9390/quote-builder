# Implementation Plan: 견적서 생성 및 저장 기능 (Create and save quotation)

**Branch**: `001-create-save-quotation` | **Date**: 2026-03-17 | **Spec**: [specs/001-create-save-quotation/spec.md](../../specs/001-create-save-quotation/spec.md)

## Summary

이 기능은 사용자가 `BlockNote` 에디터에서 작성한 견적서(텍스트 및 가격표 블록)를 `Prisma`와 `PostgreSQL`을 사용하여 영구 저장하는 기능을 구현합니다. `Zustand` 스토어와 연동하여 실시간 편집 상태를 유지하고, `Next.js Server Actions`를 통해 안전하게 DB에 반영하며 서버 측에서 금액 재검증 로직을 수행합니다.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16.1.6
**Primary Dependencies**: @blocknote/core, zustand, prisma, zod
**Storage**: PostgreSQL (Prisma ORM)
**Testing**: Jest, React Testing Library (TDD)
**Target Platform**: Web (Next.js App Router)
**Project Type**: Web Application
**Performance Goals**: 저장 및 로드 시간 < 500ms, 가격표 실시간 계산 < 200ms
**Constraints**: No `any` types, Server-side total amount re-validation, JSONB storage for blocks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] CP1: Block-Based Content Architecture 준수 여부 (BlockNote 기반 설계)
- [x] CP2: Zustand를 통한 전역 상태 관리 적절성 (useQuotationStore 활용)
- [x] CP3: Prisma + PostgreSQL JSONB 타입 안전성 (Zod 스키마 검증 계획 포함)
- [x] CP4: TDD (Red-Green-Refactor) 계획 포함 여부 (테스트 태스크 포함)
- [x] CP5: Next.js App Router (Server/Client 분리) 최적화 (Server Actions 사용)

## Project Structure

### Documentation (this feature)

```text
specs/001-create-save-quotation/
├── plan.md              # This file
├── research.md          # DB Schema & Server Action research
├── data-model.md        # Prisma Schema & Zod Validations
├── quickstart.md        # Local setup with DB
├── checklists/
│   └── requirements.md  # Spec validation results
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── actions/
│   │   └── quotation.ts      # Server Actions for CRUD
│   └── quotation/
│       └── [id]/
│           └── page.tsx      # Edit page
├── components/
│   ├── editor/
│   │   ├── Editor.tsx        # Updated with onChange
│   │   └── PricingTableBlock.tsx
│   └── ui/
│       └── SaveButton.tsx    # New Component
├── lib/
│   ├── prisma.ts             # Prisma Client singleton
│   └── validations/
│       └── quotation.ts      # Zod schemas
└── store/
    └── useQuotationStore.ts  # Updated store
```

**Structure Decision**: Next.js App Router 패턴에 따라 `src/app/actions`에 Server Actions를 배치하여 서버 측 로직을 격리하고, `src/lib/validations`에서 Zod를 통한 통합 검증을 수행합니다.

## Data Model (Mental Model)

### Quotation (Prisma)
- `id`: String (UUID)
- `title`: String
- `blocks`: Json (Array of BlockNote blocks)
- `totalAmount`: Float
- `status`: Enum (DRAFT, SENT, etc.)
- `createdAt`, `updatedAt`: DateTime

### Validation (Zod)
- `QuotationSchema`: title(min 1), blocks(array), totalAmount(positive number)

## API / Server Actions Contract

### `createQuotation(data: CreateQuotationInput)`
- **Input**: `{ title: string, blocks: any[] }`
- **Output**: `{ success: boolean, id?: string, error?: string }`
- **Logic**: 서버 측에서 blocks 데이터를 파싱하여 totalAmount 재계산 및 검증 후 저장.

### `updateQuotation(id: string, data: UpdateQuotationInput)`
- **Input**: `{ title?: string, blocks?: any[] }`
- **Output**: `{ success: boolean, error?: string }`
- **Logic**: 기존 레코드 업데이트 및 totalAmount 갱신.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |
