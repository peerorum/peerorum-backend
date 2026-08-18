# peerorum-frontend

## 프론트엔드 시작 방법
#### 1. 프로젝트 폴더로 이동

```cd "c:~~\피어오름"```

#### 2. 의존성 설치 (이미 node_modules가 있어서 최초 1회만 필요, 새로 clone했거나 package.json이 바뀌었으면 다시 실행)

``` npm install ```

#### 3. 개발 서버 실행

```npm run dev```
→ Vite 개발 서버가 뜨고, 터미널에 나오는 로컬 주소(보통 http://localhost:5173)로 접속하면 됩니다. 코드 저장 시 자동 반영(HMR)됩니다.

#### 기타 명령어
**명령어	역할**
- npm run build	타입체크(tsc -b) 후 프로덕션 빌드 → dist/ 폴더 생성
- npm run preview	빌드된 결과물을 로컬에서 미리보기
- npm run lint	oxlint로 코드 검사

#### 스택
*React 19 + TypeScript + Vite 8*
- 라우팅: react-router-dom
- 스타일: tailwindcss (v4, @tailwindcss/vite 플러그인)
- 아이콘: lucide-react


<img width="645" height="334" alt="image" src="https://github.com/user-attachments/assets/35ab2149-9c6b-48d3-8031-20b895782688" />
