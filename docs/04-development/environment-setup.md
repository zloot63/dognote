# 🔧 환경 설정 가이드 (Environment Setup)

_DogNote 프로젝트 개발 환경 구축을 위한 단계별 가이드 (Supabase 기준)_

---

## 📖 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [개발 도구 설치](#개발-도구-설치)
3. [프로젝트 설정](#프로젝트-설정)
4. [Supabase 설정](#supabase-설정)
5. [IDE 설정](#ide-설정)
6. [개발 서버 실행](#개발-서버-실행)
7. [문제 해결](#문제-해결)

---

## 1. 시스템 요구사항

### **최소 요구사항**

- **OS**: macOS 10.15+, Windows 10+, Ubuntu 18.04+
- **Node.js**: v18.17.0 이상 (LTS 권장)
- **npm**: v9.0.0 이상
- **Git**: v2.30.0 이상
- **메모리**: 8GB RAM 이상 권장
- **저장공간**: 2GB 이상 여유 공간

### **권장 사양**

- **OS**: macOS 13+, Windows 11, Ubuntu 22.04+
- **Node.js**: v20.x (최신 LTS)
- **메모리**: 16GB RAM
- **프로세서**: 멀티코어 CPU

---

## 2. 개발 도구 설치

### **Node.js 설치**

```bash
# nvm 사용 (권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# 확인
node --version  # v20.x.x 이상
npm --version   # v9.x.x 이상
```

### **Git 설치**

```bash
# macOS
brew install git
```

### **VS Code 설치**

1. https://code.visualstudio.com/ 다운로드
2. 확장 프로그램 설치:
   ```bash
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension esbenp.prettier-vscode
   code --install-extension ms-vscode.vscode-eslint
   ```

---

## 3. 프로젝트 설정

### **저장소 클론**

```bash
git clone https://github.com/your-org/dognote.git
cd dognote
```

### **의존성 설치**

```bash
npm install
```

### **환경 변수 설정**

```bash
cp .env.example .env.local
```

#### **.env.local 설정**

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 애플리케이션 설정
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Supabase 설정

### **프로젝트 생성**

1. https://supabase.com/dashboard 접속
2. **New Project** 클릭
3. 프로젝트 이름: `dognote-dev`
4. 리전: `Northeast Asia (Tokyo)`

### **API 키 확인**

Project Settings → API:

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (서버사이드 전용)

### **Authentication 설정**

1. Authentication → Providers
2. Google 활성화 (Client ID/Secret 필요)
3. Apple 활성화 (선택사항)

### **Database 스키마**

```sql
-- dogs 테이블
create table dogs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  breed text,
  birth_date date,
  weight numeric,
  profile_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- walks 테이블
create table walks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  dog_id uuid references dogs(id) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  distance numeric,
  route jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 활성화
alter table dogs enable row level security;
alter table walks enable row level security;

-- RLS 정책
create policy "Users can only access their own dogs"
  on dogs for all using (auth.uid() = user_id);

create policy "Users can only access their own walks"
  on walks for all using (auth.uid() = user_id);
```

### **Storage 설정**

1. Storage → New bucket
2. 버킷 이름: `dog-profiles`
3. Public bucket: ✅

---

## 5. IDE 설정

### **VS Code 설정 (.vscode/settings.json)**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

---

## 6. 개발 서버 실행

```bash
npm run dev
```

- 애플리케이션: http://localhost:3000

---

## 7. 문제 해결

### **의존성 설치 실패**

```bash
rm -rf node_modules package-lock.json
npm install
```

### **Supabase 연결 오류**

```bash
# 환경 변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

**문서 히스토리:**

- v2.0: 2025-04-05 (Supabase 기준으로 업데이트)
- v1.0: 2025-08-31 (초안 작성)
