Date: 2026-03-13
Author: Antigravity

# 📄 Quote Builder (견적서 작성기)

**"블록 기반의 유연하고 강력한 견적서 작성 경험"**

---

## 🏗 프로젝트 핵심 철학 (Project Philosophy)

- **블록 기반 에디터**: `BlockNote`를 활용하여 유연한 텍스트 및 가격표(Pricing Table) 블록 편집 기능을 제공합니다.
- **상태 관리**: `Zustand`를 이용해 작성 중인 견적서 데이터를 전역 상태로 관리합니다.
- **안정적인 데이터 영속성**: `Prisma` + `PostgreSQL`을 사용하여 견적서 데이터를 JSONB 형태로 안전하게 저장합니다.
- **현대적 UI/UX**: `Next.js App Router`와 `Tailwind CSS`, `shadcn/ui`를 결합하여 깔끔하고 직관적인 사용자 경험을 보장합니다.

---

## ⚙️ 문제 해결 완료 후 필수 워크플로우 (Post-Problem-Solving Workflow)

**모든 문제 해결이 완료된 직후, 사용자 승인 없이 아래 절차를 자동으로 실행한다.**

1. **회고 분석**: 이번 작업에서 "무엇이 작동했고 무엇이 실패했는지" 분석.
2. **핵심 규칙 도출**: 향후 동일 실수를 반복하지 않기 위한 규칙 1가지 도출.
3. **COMMON_MISTAKES.md 저장**: `doc/COMMON_MISTAKES.md`에 업데이트.
4. **LESSONS_LEARNED 저장**: `doc/LESSONS_LEARNED.md` 하단에 규칙 추가.
5. **보고**: 저장 완료 후 사용자에게 요약 보고.

---

## 📜 코딩 스타일 및 앱 개발 원칙 (Development Principles)

- **서버/클라이언트 컴포넌트 분리**: Next.js App Router의 특성을 살려, 데이터 패칭은 서버 컴포넌트에서 처리하고 상태 관리와 인터랙션은 클라이언트 컴포넌트(`"use client"`)에서 담당합니다.
- **엄격한 타입 안전성**: TypeScript를 적극 활용하고, 필요한 경우 `Zod`를 통해 입출력 데이터를 철저히 검증합니다.
- **UI 일관성**: Tailwind CSS 클래스를 병합할 때는 `clsx`와 `tailwind-merge`(`cn` 유틸)를 사용하여 스타일 충돌을 방지합니다.

---

## 🚀 주요 커맨드 (Project Commands)

```bash
pnpm dev              # 로컬 개발 서버 실행
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint 코드 검사
pnpm prisma generate  # Prisma 클라이언트 생성
pnpm prisma db push   # 데이터베이스 스키마 동기화 (또는 migrate dev)
```
