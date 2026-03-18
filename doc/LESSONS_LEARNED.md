# Lessons Learned

## [260318] TypeScript Build Fix
- 규칙: Prisma Json 타입 사용 시 상위 인터페이스로의 명시적 캐스팅 필수 (as unknown as Type)
- 원인: Prisma는 Json 타입을 정적으로 보장하지 않으므로, 이를 사용하는 Zustand 스토어나 컴포넌트에서 타입 불일치 에러가 발생함.
