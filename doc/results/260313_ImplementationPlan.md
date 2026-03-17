Date: 2026-03-13 14:15:00
Author: Antigravity

# 260313_ServerAction_ImplementationPlan

## 1. 개요

현재 클라이언트 사이드에 머물러 있는 견적서 데이터를 PostgreSQL(Prisma)에 저장하고 관리하기 위한 서버 액션 체계를 구축합니다.

## 2. 주요 작업 내용

### 2.1. Prisma Client 설정 고도화

- 싱글톤 패턴을 적용한 src/lib/db.ts 생성 (Next.js Hot Reload 시 연결 초과 방지).

### 2.2. 서버 액션 구현 (src/actions/quotation.ts)

- saveQuotation(data): Zustand의 blocks(JSON)와 title을 받아 DB에 저장하거나 업데이트.
- fetchQuotation(id): 특정 견적서 데이터를 불러와 에디터에 주입.
- listQuotations(): 사용자의 견적서 목록 조회.

### 2.3. UI 연동

- page.tsx의 '견적서 발행' 버튼 클릭 시 useTransition을 사용하여 로딩 상태 표시 및 서버 액션 호출.
- 성공 시 토스트 메시지 알림 및 상세 페이지로 이동(필요 시).

## 3. 검증 전략 (TDD)

- **성공 케이스**: 유효한 JSON 블록 데이터가 DB에 정확히 저장되고 totalAmount가 합산되어 기록되는지 확인.
- **실패 케이스**: 잘못된 JSON 형식이나 필수값 누락 시 에러 처리 확인.

## 4. 논의 및 피드백 요청

1. 견적서 저장 시 **버전 관리(V1, V2...)** 기능이 필요하신가요?
2. 견적서 상태(DRAFT -> SENT -> ACCEPTED)를 수동으로 변경하시겠습니까, 아니면 특정 동작 시 자동 변경되길 원하시나요?
