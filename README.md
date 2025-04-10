# 기술 과제 - REST API 개발

## 목차
- [개발 환경](#개발-환경)
- [빌드 및 실행하기](#빌드-및-실행하기)
- [기능 요구사항](#기능-요구사항)
- [폴더 구조](#폴더-구조)
- [API](#api)
- [성능 최적화 전략](#성능-최적화-전략)
- [결과](#결과)

<br/><br/>

## 개발 환경
- 기본 환경
    - TypeScript 5.7.3
    - Node.js 20 이상
- 서버
    - NestJS 11.0.1
    - Fastify 5.2.2
- DB
    - SQLite (@mikro-orm/sqlite 6.4.11)
- 캐싱 및 성능 최적화
    - Redis 캐시 (cache-manager-redis-store 3.0.1)
    - 읽기 전용 복제본 (Read Replica)
- 테스트
    - Jest 29.7.0
    - SuperTest 7.0.0
- API 문서화
    - Swagger/OpenAPI (@nestjs/swagger 11.1.1)

<br/><br/>

## 빌드 및 실행하기
### 사전 요구사항
- Node.js 20 이상 설치
- Redis 서버 설치 및 실행 (캐싱 기능 사용 시)

### 설치 및 실행
```bash
# 의존성 패키지 설치 (SQLite3 바인딩 파일 오류 방지를 위해 npm 사용)
$ npm install

# 스키마 생성 (SQLite 데이터베이스 초기화)
$ pnpm schema:generate

# 개발 서버 실행
$ pnpm start:dev

# 테스트 실행
$ npm run test

# 테스트 커버리지 확인
$ npm run test:cov

# 더미 데이터 추가
$ npm run add:dummy-data
```


<br/><br/>

## 기능 요구사항
### 필수사항
- 구매 상담 정보를 받아서 저장하는 API 구현
- 내부 Admin에서 구매 상담 내역을 검색/필터 조회하는 API 제
- 구매 상담 내역이 등록된 일자 기반 필터링 조회 기능

### 고려사항
- 전화번호 기반 구매 상담 내역 검색 기능 구현
- 등록된 일자 기반 구매 상담 내역 필터링 조회 기능 구현(ex: 2025-03-01 ~ 2025-03-31 사이에 등록된 구매 상담 내역만 조회)
- 유효한 전화번호 검증 로직 디테일하게 구현
- 전화번호 유효성 검사 로직 test case 작성
- 대용량 데이터 처리 (수만~수십만 건)를 위한 쿼리 최적화


<br/><br/>

## 폴더 구조

```plaintext
📦ishopcare-preview-test-main
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂internal                # 내부 Admin용 API
 ┃ ┃ ┃ ┣ 📂dto                   # 데이터 전송 객체
 ┃ ┃ ┃ ┣ 📂pipes                 # 커스텀 파이프 (데이터 검증)
 ┃ ┃ ┃ ┣ 📜internal-api.controller.ts
 ┃ ┃ ┃ ┣ 📜internal-api.module.ts
 ┃ ┃ ┃ ┗ 📜internal-api.service.ts
 ┃ ┃ ┗ 📂public                  # 구매 상담 정보 입력 페이지용 Public API
 ┃ ┃ ┃ ┣ 📂dto                   # 데이터 전송 객체
 ┃ ┃ ┃ ┣ 📜public-api.controller.ts
 ┃ ┃ ┃ ┣ 📜public-api.module.ts
 ┃ ┃ ┃ ┗ 📜public-api.service.ts
 ┃ ┣ 📂cache                     # 캐시 관련 모듈
 ┃ ┃ ┗ 📜cache.module.ts
 ┃ ┣ 📂mikro-orm                 # DB 관련 모듈
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📂inquiry
 ┃ ┃ ┃ ┃ ┣ 📜inquiry-entity.ts   # 구매 상담 엔티티
 ┃ ┃ ┃ ┃ ┣ 📜inquiry-repository.module.ts
 ┃ ┃ ┃ ┃ ┗ 📜inquiry-repository.ts # 구매 상담 리포지토리
 ┃ ┃ ┣ 📂scripts                 # DB 스키마 생성 및 더미 데이터 추가 스크립트
 ┃ ┃ ┃ ┣ 📜add-dummy-data.ts
 ┃ ┃ ┃ ┗ 📜schema-generator.ts
 ┃ ┃ ┗ 📜const.ts               # DB 관련 상수
 ┃ ┣ 📂utils                     # 유틸리티 함수
 ┃ ┃ ┗ 📜phone-number-validator.ts # 전화번호 유효성 검증
 ┃ ┣ 📜app.module.ts             # 애플리케이션 루트 모듈
 ┃ ┗ 📜main.ts                   # 애플리케이션 진입점
 ┣ 📂test                        # 테스트 코드
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂internal
 ┃ ┃ ┗ 📂public
 ┃ ┣ 📂mikro-orm
 ┃ ┃ ┗ 📂entities
 ┃ ┃ ┃ ┗ 📂inquiry
 ┃ ┗ 📂utils
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜README.md
 ┣ 📜eslint.config.mjs
 ┣ 📜jest.config.ts
 ┣ 📜nest-cli.json
 ┣ 📜package.json
 ┣ 📜tsconfig.build.json
 ┗ 📜tsconfig.json
```

<br/><br/>

## API
- Swagger UI: `http://localhost:8081/api-docs`
- API 문서는 서버 실행 후 위 URL에서 확인 가능합니다.

### 구매 상담 등록 API
- **URL**: `/public/inquiry`
- **Method**: `POST`
- **Description**: 구매 상담 정보를 등록합니다.
- **Request Body**:
  ```json
  {
    "phoneNumber": "01012345678",
    "businessType": "카페",
    "businessNumber": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "id": 1,
    "message": "구매 상담 등록이 완료되었습니다."
  }
  ```

### 구매 상담 내역 조회 API
- **URL**: `/internal/inquiries`
- **Method**: `GET`
- **Description**: 구매 상담 내역을 조회합니다.
- **Query Parameters**:
  - `phoneNumber` (선택): 전화번호로 필터링
  - `startDate` (선택): 시작 날짜 (YYYY-MM-DD)
  - `endDate` (선택): 종료 날짜 (YYYY-MM-DD)
  - `page` (선택): 페이지 번호 (기본값: 1)
  - `limit` (선택): 페이지당 항목 수 (기본값: 20)
  - `sort` (선택): 정렬 기준 필드 (createdAt 또는 id, 기본값: createdAt)
  - `order` (선택): 정렬 방향 (ASC 또는 DESC, 기본값: DESC)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "phoneNumber": "01012345678",
        "businessType": "카페",
        "businessNumber": "1234567890",
        "createdAt": 1712345678
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
  ```

<br/><br/>

## 성능 최적화 전략
### 1. 읽기 전용 복제본 활용
- 읽기 작업과 쓰기 작업을 분리하여 DB 부하 분산
- 최근 데이터는 마스터 DB에서 조회하여 데이터 정합성 보장

### 2. Redis 캐싱
- 자주 조회되는 날짜 범위의 결과를 캐싱하여 DB 부하 감소
- 캐시 TTL 설정으로 데이터 신선도 유지
- 새로운 구매 상담 등록 시 관련 캐시 무효화

### 3. 쿼리 최적화
- 날짜 범위 기반 필터링을 위한 효율적인 쿼리 구성
- 페이지네이션 적용으로 대용량 데이터 효율적 처리


<br/><br/>

## 결과
- 구매 상담 정보를 효율적으로 저장하고 조회할 수 있는 API 서버 구현
- 읽기 전용 복제본(최근 데이터는 마스터 DB에서 조회)과 Redis 캐싱을 통한 성능 향상
- NestJS 파이프를 활용한 강력한 입력 데이터 유효성 검증 구현
- 조회 성능 최적화를 위한 유닉스 타임스탬프 활용 (날짜 기반 필터링 성능 향상, 인덱싱 효율성 증가)