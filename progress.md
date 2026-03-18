# Project Progress: Quote Builder

## 🟢 2026-03-18 Update
### ✅ 완료된 작업
- **PDF 내보내기 최적화**: `html-to-image` 도입 및 UI 정화 로직 적용 (성공)
- **에디터 개선**: 블록 하단 삽입 로직 구현
- **Feature 001 (저장 기능) 구현**:
  - 명세 구체화 (Clarification Session 1, 2 완료)
  - Prisma 스키마 업데이트 및 DB Client 생성
  - 서버 측 금액 검증 엔진(`calculations.ts`) 구축
  - 견적서 상태 관리(`DRAFT`, `SENT`, `ACCEPTED`) 및 편집 잠금 구현
  - 부가세(VAT) 토글 및 상세 합계 UI 추가
  - Soft Delete 기능 적용
- **품질 관리**: 요구사항 체크리스트(16개 항목) 작성

### 🚧 진행 중인 작업
- 낙관적 잠금(`version` 필드)을 이용한 API 충돌 방지 고도화
- 견적서 목록 페이지 구현 준비

### 📌 기술적 결정 사항
- **통화**: KRW 기준 정수형 처리 (`Math.floor`)
- **보안**: 소유자 전용 접근 제어 (RLS 및 ownerId 기반)
- **동시성**: 낙관적 잠금 (Optimistic Locking) 적용
- **엔진**: PDF 캡처 라이브러리 `html-to-image` 사용
