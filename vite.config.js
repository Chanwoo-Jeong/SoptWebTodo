// # GitHub Pages에 정적 콘텐츠를 배포하기 위한 간단한 워크플로우
name: Deploy static content to Pages

on:
//   # 기본 브랜치에 대한 푸시 이벤트 발생 시 실행
  push:
    branches: ['main']

//   # Actions 탭에서 수동으로 워크플로우를 실행할 수 있도록 구성
  workflow_dispatch:

// # GITHUB_TOKEN의 권한을 설정하여 GitHub Pages에 배포할 수 있도록 함
permissions:
  contents: read
  pages: write
  id-token: write

// # 동시에 하나의 배포만 허용하도록 구성
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
//   # 단순히 배포만 수행하기에 하나의 잡으로만 구성
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
        //   # dist 디렉터리 업로드
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1