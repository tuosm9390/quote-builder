---
description: "Task list for Create and save quotation functionality"
---

# Tasks: 견적서 생성 및 저장 기능 (Create and save quotation)

**Input**: Design documents from `/specs/001-create-save-quotation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD (Red-Green-Refactor)를 위해 테스트 태스크를 포함합니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] [Shared] `src/lib/prisma.ts` Prisma 클라이언트 싱글톤 설정
- [ ] T002 [P] [Shared] `src/lib/validations/quotation.ts` Zod 스키마 정의 (title, blocks, totalAmount)
- [ ] T003 [P] [Shared] `src/store/useQuotationStore.ts` 블록 데이터 업데이트 시 totalAmount 자동 계산 로직 추가

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 [P] [Foundational] `src/app/actions/quotation.ts` 생성/수정 Server Action 뼈대 작성
- [ ] T005 [P] [Foundational] `src/components/ui/SaveButton.tsx` 저장 상태 표시 UI 컴포넌트 작성

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 신규 견적서 작성 및 저장 (Priority: P1) 🎯 MVP

**Goal**: 견적서 제목 및 블록 데이터를 DB에 저장하고 상태를 'DRAFT'로 설정

**Independent Test**: API 호출 후 DB에 레코드가 생성되고, 저장된 데이터를 다시 로드했을 때 에디터에 정상 표시되는지 확인

### Tests for User Story 1 (P1)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] `src/app/actions/quotation.test.ts` Server Action CRUD 단위 테스트 (Jest)
- [ ] T011 [P] [US1] `src/components/editor/Editor.test.tsx` 저장 이벤트 발생 및 Action 호출 연동 테스트

### Implementation for User Story 1

- [ ] T012 [P] [US1] `src/app/actions/quotation.ts` `createQuotation` 및 `updateQuotation` 상세 구현 (Zod 검증 포함)
- [ ] T013 [P] [US1] `src/app/page.tsx` 에디터와 저장 버튼 연동 및 상태 처리
- [ ] T014 [US1] `src/app/quotation/[id]/page.tsx` 저장된 견적서 로드 및 편집 페이지 구현
- [ ] T015 [US1] `src/app/actions/quotation.ts` 서버 측 `totalAmount` 재계산 및 검증 로직 추가 (보안/무결성)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 가격표 블록을 통한 자동 금액 산출 (Priority: P2)

**Goal**: 가격표 블록 내 품목 변경 시 실시간으로 전체 총액 계산 및 반영

**Independent Test**: 가격표 블록에 더미 데이터를 넣고 수량을 변경했을 때 상단/하단의 총액이 일치하는지 확인

### Tests for User Story 2 (P2)

- [ ] T016 [P] [US2] `src/components/editor/PricingTableBlock.test.tsx` 수량/단가 변경 시 계산 로직 단위 테스트

### Implementation for User Story 2

- [ ] T017 [P] [US2] `src/components/editor/PricingTableBlock.tsx` 입력 필드 `onChange` 핸들러 및 스토어 연동 최적화
- [ ] T018 [US2] `src/store/useQuotationStore.ts` 가격표 블록 데이터를 파싱하여 `totalAmount`를 추출하는 유틸리티 함수 구현

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] `src/app/globals.css` 저장 중 애니메이션 및 피드백 스타일 개선
- [ ] T020 [P] [Shared] `src/lib/utils.ts` 금액 포맷팅 유틸리티 최적화
- [ ] T021 [P] Documentation updates in docs/
- [ ] T022 [P] doc/COMMON_MISTAKES.md 업데이트 및 회고 분석
- [ ] T023 [P] doc/LESSONS_LEARNED.md 핵심 규칙 추가

---

## Dependencies & Execution Order

1. **Phase 1 (Setup)**: `prisma.ts`, `validations.ts` 기반 인프라 구축
2. **Phase 2 (Foundational)**: Server Action 및 UI 컴포넌트 뼈대 작성
3. **Phase 3 (US1 - MVP)**: TDD 방식으로 실제 저장 로직 구현 (가장 중요)
4. **Phase 4 (US2)**: 실시간 계산 로직 고도화
5. **Phase N (Polish)**: 스타일 정합성 및 회고 분석 완료

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. DB 스키마 검증 및 Server Action으로 텍스트 데이터라도 먼저 저장되는지 확인합니다.
2. 이후 블록 데이터를 JSONB로 통째로 넘겨 저장하는 구조를 완성합니다.

### Incremental Delivery
1. 저장 기능 완성 (US1) -> 실시간 계산 고도화 (US2) 순으로 진행하여 핵심 기능을 먼저 배포 가능한 상태로 유지합니다.
