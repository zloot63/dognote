# 🔧 환경 설정 가이드 (Environment Setup)

*DogNote 프로젝트 개발 환경 구축을 위한 단계별 가이드*

---

## 📖 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [개발 도구 설치](#개발-도구-설치)
3. [프로젝트 설정](#프로젝트-설정)
4. [Firebase 설정](#firebase-설정)
5. [IDE 설정](#ide-설정)
6. [개발 서버 실행](#개발-서버-실행)
7. [문제 해결](#문제-해결)

---

## 1. 시스템 요구사항

### **최소 요구사항**
- **OS**: macOS 10.15+, Windows 10+, Ubuntu 18.04+
- **Node.js**: v18.17.0 이상 (LTS 권장)
- **npm**: v9.0.0 이상 또는 **yarn**: v3.0.0 이상
- **Git**: v2.30.0 이상
- **메모리**: 8GB RAM 이상 권장
- **저장공간**: 2GB 이상 여유 공간

### **권장 사양**
- **OS**: macOS 13+, Windows 11, Ubuntu 22.04+
- **Node.js**: v20.x (최신 LTS)
- **메모리**: 16GB RAM
- **프로세서**: 멀티코어 CPU (Apple Silicon, Intel i5 이상)

### **지원 브라우저**
```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie <= 11"
  ]
}
```

---

## 2. 개발 도구 설치

### **A. Node.js 설치**

#### **Option 1: 공식 설치 프로그램 (권장)**
```bash
# macOS/Linux - nvm 사용
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# Windows - 공식 웹사이트에서 다운로드
# https://nodejs.org/en/download/
```

#### **Option 2: 패키지 매니저**
```bash
# macOS - Homebrew
brew install node

# Windows - Chocolatey
choco install nodejs

# Ubuntu - apt
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **설치 확인**
```bash
node --version  # v20.x.x 이상
npm --version   # v9.x.x 이상
```

### **B. Git 설치**

```bash
# macOS
brew install git

# Windows
# https://git-scm.com/download/win

# Ubuntu
sudo apt update && sudo apt install git
```

#### **Git 설정**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

### **C. VS Code 설치 (권장 IDE)**

1. **다운로드**: https://code.visualstudio.com/
2. **필수 확장프로그램 설치**:
   ```bash
   # VS Code 확장프로그램 (자동 설치용)
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension esbenp.prettier-vscode
   code --install-extension ms-vscode.vscode-eslint
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension ms-vscode.vscode-json
   ```

---

## 3. 프로젝트 설정

### **A. 저장소 클론**

```bash
# HTTPS 클론 (권장)
git clone https://github.com/your-org/dognote.git
cd dognote

# SSH 클론 (SSH 키 설정 필요)
git clone git@github.com:your-org/dognote.git
cd dognote
```

### **B. 의존성 설치**

```bash
# npm 사용
npm install

# 또는 yarn 사용 (선택사항)
yarn install
```

#### **설치되는 주요 패키지**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "firebase": "^10.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### **C. 환경 변수 설정**

```bash
# .env.local 파일 생성
cp .env.example .env.local

# .env.local 편집
code .env.local
```

#### **.env.local 설정 예시**
```bash
# Firebase 설정 (개발환경)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# 애플리케이션 설정
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 기능 토글
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_MAX_WALK_DURATION_MINUTES=240
```

---

## 4. Firebase 설정

### **A. Firebase 프로젝트 생성**

1. **Firebase Console 접속**: https://console.firebase.google.com/
2. **새 프로젝트 생성** 클릭
3. 프로젝트 이름: `dognote-dev` (개발용)
4. Google Analytics 활성화 (권장)

### **B. 웹 앱 등록**

1. **프로젝트 개요** → **웹 앱 추가**
2. 앱 닉네임: `DogNote Web App`
3. Firebase Hosting 설정 체크 (선택)
4. **앱 등록** 클릭
5. **설정 정보 복사** → `.env.local`에 붙여넣기

### **C. 서비스 활성화**

#### **Authentication 설정**
```bash
# Firebase Console에서 설정
1. Authentication → 시작하기
2. Sign-in method → 로그인 제공업체:
   - 이메일/비밀번호 ✅
   - Google ✅ (선택)
3. Users → 사용자 관리
```

#### **Firestore Database 설정**
```bash
# Firebase Console에서 설정
1. Firestore Database → 데이터베이스 만들기
2. 프로덕션 모드에서 시작 (권장)
3. 위치: asia-northeast3 (서울)
4. Rules 설정 (보안 규칙 적용)
```

#### **Storage 설정**
```bash
# Firebase Console에서 설정
1. Storage → 시작하기
2. 프로덕션 모드에서 시작
3. 위치: asia-northeast3 (서울)
4. Rules 설정
```

### **D. Firebase CLI 설치**

```bash
# Firebase CLI 글로벌 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (프로젝트 루트에서)
firebase init

# 서비스 선택:
# ✅ Firestore
# ✅ Functions (선택)
# ✅ Hosting
# ✅ Storage
```

---

## 5. IDE 설정

### **VS Code 설정**

#### **A. workspace 설정 (.vscode/settings.json)**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### **B. 권장 확장프로그램 (.vscode/extensions.json)**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next", 
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### **C. 디버깅 설정 (.vscode/launch.json)**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## 6. 개발 서버 실행

### **A. 개발 서버 시작**

```bash
# 개발 서버 실행
npm run dev

# 또는 디버그 모드
npm run dev:debug

# 특정 포트로 실행
npm run dev -- --port 3001
```

### **B. 접속 확인**

- **애플리케이션**: http://localhost:3000
- **개발자 도구**: 브라우저 DevTools 열기 (F12)

### **C. 빌드 테스트**

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm run start

# 타입 검사
npm run type-check

# 린팅
npm run lint
```

---

## 7. 문제 해결

### **A. 자주 발생하는 문제**

#### **Node.js 버전 문제**
```bash
# 에러: "Node.js version is not supported"
# 해결: Node.js LTS 버전 설치
nvm install --lts
nvm use --lts
```

#### **포트 충돌 문제**
```bash
# 에러: "Port 3000 is already in use"
# 해결: 다른 포트 사용 또는 프로세스 종료
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows에서 PID 확인 후 종료
```

#### **의존성 설치 실패**
```bash
# 해결: 캐시 클리어 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **Firebase 연결 오류**
```bash
# 에러: "Firebase configuration is invalid"
# 해결: 환경 변수 확인
echo $NEXT_PUBLIC_FIREBASE_API_KEY  # 값 확인
# .env.local 파일 재설정
```

### **B. 성능 최적화**

#### **개발 서버 속도 개선**
```bash
# .env.local에 추가
NEXT_PRIVATE_SKIP_VALIDATIONS=1
DISABLE_ESLINT_PLUGIN=true  # 개발 시에만 사용
```

#### **빌드 속도 개선**
```bash
# next.config.ts 설정
export default {
  swcMinify: true,
  experimental: {
    swcPlugins: [
      ['@swc/plugin-styled-jsx', {}]
    ]
  }
}
```

### **C. 도움말 및 지원**

```bash
# 명령어 도움말
npm run help           # 사용 가능한 스크립트 확인
next --help           # Next.js CLI 도움말
firebase --help       # Firebase CLI 도움말

# 의존성 정보 확인
npm ls                # 설치된 패키지 목록
npm outdated          # 업데이트 가능한 패키지
npm audit             # 보안 취약점 검사
```

---

## 📚 추가 리소스

### **공식 문서**
- **[Next.js 설치 가이드](https://nextjs.org/docs/getting-started/installation)**
- **[Firebase 웹 설정](https://firebase.google.com/docs/web/setup)**
- **[VS Code 설정 가이드](https://code.visualstudio.com/docs/setup/setup-overview)**

### **커뮤니티 리소스**
- **[Next.js GitHub](https://github.com/vercel/next.js)**
- **[Firebase 커뮤니티](https://firebase.google.com/community)**
- **[React 개발자 도구](https://react.dev/learn/react-developer-tools)**

---

*환경 설정에 문제가 있거나 질문이 있다면 팀 채널이나 GitHub Issues에 문의해 주세요.*

**문서 히스토리:**
- v1.0: 2025-08-31 (환경 설정 가이드 초안 작성)
