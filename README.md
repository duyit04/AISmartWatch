# AI SmartWatch - Landing Page

> Trang landing page hiện đại cho sản phẩm AI SmartWatch, xây dựng với React 19, TypeScript, Vite 8 và Tailwind CSS 4.

Trang web giới thiệu sản phẩm đồng hồ thông minh AI với thiết kế cao cấp, tối ưu hiệu năng và trải nghiệm người dùng mượt mà trên mọi thiết bị.

## Điểm nổi bật

- **Giao diện hiện đại** với Tailwind CSS 4, font Inter & JetBrains Mono
- **Responsive hoàn toàn** - Desktop, Tablet, Mobile đều mượt mà
- **Dark Mode** tích hợp, chuyển đổi mượt mà
- **Hiệu ứng chuyển động** - Scroll animations, parallax, micro-interactions
- **SEO Technical đầy đủ** - Meta tags, Open Graph, JSON-LD Structured Data
- **Performance cao** - Code splitting, lazy loading, image optimization
- **Backend API** - Hono server xử lý đơn pre-order, sync cart/wishlist
- **Mini E-commerce** - Giỏ hàng, wishlist, danh sách đã xem
- **Behavior Tracking** - Theo dõi click, scroll, time-on-page gửi về webhook
- **AI Chatbot** - Tư vấn tự động về sản phẩm

## Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.2 | UI Framework |
| TypeScript | 6.0 | Type safety |
| Vite | 8.1 | Build tool & dev server |
| Tailwind CSS | 4.3 | Styling |
| Lucide React | 1.23 | Icons |
| React Simple Icons | 13.11 | Brand icons |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Hono | 4.7 | API framework (Node + Cloudflare Workers) |
| @hono/node-server | 1.13 | Local development server |
| Wrangler | 4.12 | Cloudflare Workers deployment |
| tsx | 4.19 | TypeScript execution |

### Tools
| Công nghệ | Mục đích |
|-----------|----------|
| concurrently | Chạy frontend + backend cùng lúc |
| oxlint | Linting siêu nhanh |

## Tính năng đã triển khai

### Core (Bắt buộc)
- Hero Section với CTA pre-order
- Features section giới thiệu tính năng nổi bật
- Technical Specifications
- Form đăng ký nhận tin / Pre-order
- Responsive design (mobile-first)
- Meta tags SEO đầy đủ + JSON-LD
- Hiệu năng cao (điểm PageSpeed ≥ 85/100)

### Nâng cao
- Dark Mode với CSS variables
- Scroll animations + Parallax effects
- Skeleton loading states
- Behavior tracking (click, scroll, time-on-page)
- Webhook validation cho pre-order form
- AI Chatbot với mock responses
- Mini e-commerce:
  - Cart (giỏ hàng) với sessionStorage
  - Wishlist (yêu thích) với API sync
  - Recently Viewed (đã xem) với API sync
- Toast notifications
- Smooth scroll navigation

## Cấu trúc dự án

```
ai-smartwatch/
├── functions/                  # Cloudflare Workers (production API)
├── src/
│   ├── assets/                 # Static assets (fonts, images)
│   ├── components/             # React components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Specs.tsx
│   │   ├── Newsletter.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Countdown.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Chatbot.tsx
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useBehaviorTracking.ts
│   │   ├── useTheme.ts
│   │   └── useCart.ts
│   ├── lib/                    # Libraries
│   │   ├── api.ts              # API client
│   │   ├── data.ts             # Static data
│   │   └── utils.ts            # Utility functions
│   ├── server/                 # Local API server (development)
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── public/                     # Public assets (favicon, images)
├── index.html                  # HTML entry với SEO meta
├── vite.config.ts              # Vite config + proxy /api
├── wrangler.toml               # Cloudflare Workers config
├── tsconfig.json               # TypeScript root config
└── package.json
```

## Bắt đầu

### Yêu cầu môi trường

- Node.js >= 20.19
- npm >= 10

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd ai-smartwatch

# Cài dependencies
npm install
```

### Development

**Chạy frontend + backend cùng lúc (khuyến nghị):**

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API proxy: `/api/*` tự động forward sang backend

**Chạy riêng lẻ:**

```bash
# Chỉ frontend
npm run dev

# Chỉ backend API
npm run dev:server
```

### Build & Deploy

```bash
# Build production
npm run build

# Preview build locally
npm run preview

# Deploy lên Cloudflare Pages + Workers
npm run deploy
```

## API Endpoints

Base URL (dev): `http://localhost:3001/api`  
Base URL (prod): `https://<your-domain>/api`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| POST | `/webhook/preorder` | Đăng ký pre-order |
| GET | `/cart` | Lấy giỏ hàng theo session |
| POST | `/cart` | Sync giỏ hàng |
| GET | `/wishlist` | Lấy wishlist |
| POST | `/wishlist` | Sync wishlist |
| GET | `/viewed` | Lấy danh sách đã xem |
| POST | `/viewed` | Sync danh sách đã xem |
| POST | `/chat` | Chat với AI bot |

Tất cả API yêu cầu header `X-Session-Id` để định danh người dùng (trừ `/health`).

## Triển khai

### Cloudflare Pages (Frontend)

1. Connect repo trên Cloudflare Dashboard
2. Build command: `npm run build`
3. Output directory: `dist`

### Cloudflare Workers (Backend API)

```bash
# Login
npx wrangler login

# Deploy
npm run deploy:worker

# Hoặc deploy toàn bộ
npm run deploy
```

Config trong `wrangler.toml`:
- KV namespace `AIWATCH_KV` để lưu cart/wishlist/viewed

## Tối ưu Performance

Các kỹ thuật đã áp dụng để đạt PageSpeed ≥ 85:

- **Code splitting** - React lazy loading
- **Image optimization** - WebP, lazy load, responsive sizes
- **Font optimization** - preconnect, font-display: swap
- **CSS** - Tailwind purge trong build
- **JS** - Tree shaking, minification
- **Caching** - Static assets hash-named
- **Compression** - Gzip/Brotli (Cloudflare tự động)

## Scripts có sẵn

```bash
npm run dev          # Chạy Vite dev server
npm run dev:server   # Chạy local API server
npm run dev:all      # Chạy cả hai
npm run build        # Build production
npm run preview      # Preview production build
npm run deploy       # Deploy lên Cloudflare
```

## License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

**Phát triển bởi AI SmartWatch Team** - Trang landing page showcase cho sản phẩm đồng hồ thông minh AI.