# 🤖 ERP Copilot AI

> **An AI-powered Multi-Agent ERP Assistant for Warehouse, Inventory, Purchase, Sales, and Business Analytics.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-blue)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)

---

## ✨ What is ERP Copilot AI?

ERP Copilot AI transforms how employees interact with enterprise ERP systems. Instead of navigating hundreds of screens, users simply **ask in natural language**:

```
"Show today's pending GRNs."
"Which purchase orders are delayed?"
"What inventory will run out in 7 days?"
"Auto-create a PO when stock drops below 50 units."
"Predict next month's demand for SKU-1234."
"Generate vendor performance report."
```

The AI intelligently routes queries to **12 specialized LangGraph agents**, performs **Hybrid RAG** over a Qdrant vector database, generates safe SQL, produces Recharts-compatible chart data, and streams responses back in real time.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────┐
│                 Browser (Next.js 14)                │
│         Tailwind CSS + shadcn/ui + Framer Motion    │
└─────────────────────┬──────────────────────────────┘
                      │ HTTPS
              ┌───────▼────────┐
              │  Nginx Proxy   │
              └──────┬─────┬──┘
                     │     │
          ┌──────────▼──┐ ┌▼──────────────────┐
          │ Spring Boot │ │  FastAPI AI Svc    │
          │   :8080     │ │     :8000          │
          │  Java 21    │ │ LangGraph + RAG    │
          └──────┬──────┘ └──────┬─────────────┘
                 │               │
        ┌────────▼──────┐  ┌─────▼──────┐
        │  PostgreSQL   │  │   Qdrant   │
        │   + Redis     │  │ Vector DB  │
        └───────────────┘  └─────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │  Gemini AI  │
                          │ OpenAI/Claude│
                          └─────────────┘
```

---

## 🤖 AI Agents

| Agent | Responsibility |
|-------|---------------|
| **Planner** | Classifies intent, routes to correct agent |
| **Inventory** | Answers stock queries, semantic search |
| **Warehouse** | Warehouse capacity, dead stock analysis |
| **Sales** | Sales order analytics, trends |
| **Purchase** | PO management, vendor queries |
| **Analytics** | Cross-module charts and KPIs |
| **Forecast** | Demand prediction, stock-out alerts |
| **Report** | PDF report generation |
| **SQL** | Safe natural language to SQL |
| **Chart** | Recharts-compatible JSON output |
| **Explanation** | ERP concept explanations |
| **Workflow Automation** | NL → automated multi-step ERP workflows |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animations)
- **Recharts** (data visualization)
- **Zustand** (state management)

### Backend
- **Spring Boot 3.2** + **Java 21**
- **Spring Security** + **JWT** + **RBAC**
- **PostgreSQL** + **Redis**
- **Spring Data JPA**
- **Gradle**

### AI Service
- **FastAPI** + **Python 3.11**
- **LangGraph** + **LangChain**
- **Google Gemini** (primary LLM)
- **Qdrant** (vector database)
- **APScheduler** (workflow scheduling)
- **Pydantic v2**

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **GitHub Actions** (CI/CD)

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 24+
- Git

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/erp-copilot-ai.git
cd erp-copilot-ai
cp .env.example .env
# Edit .env and add your API keys
```

### 2. Start All Services
```bash
docker compose up --build
```

### 3. Access
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Spring Boot API | http://localhost:8080 |
| FastAPI AI Service | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Qdrant Dashboard | http://localhost:6333/dashboard |

### 4. Default Credentials
```
Admin:     admin@erp.com / Admin@123
Warehouse: warehouse@erp.com / Pass@123
Purchase:  purchase@erp.com / Pass@123
Sales:     sales@erp.com / Pass@123
Finance:   finance@erp.com / Pass@123
```

---

## 📁 Project Structure

```
erp-copilot-ai/
├── frontend/                    # Next.js 14 application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities, hooks, API clients
│   └── types/                   # TypeScript types
├── backend/                     # Spring Boot application
│   └── src/main/java/com/erpcopilot/
│       ├── auth/                # JWT + RBAC
│       ├── inventory/           # Inventory module
│       ├── warehouse/           # Warehouse module
│       ├── grn/                 # Goods Receipt Note
│       ├── purchase/            # Purchase Orders
│       ├── sales/               # Sales Orders
│       ├── vendor/              # Vendor management
│       ├── product/             # Product catalog
│       ├── workflow/            # Workflow Automation Engine
│       └── analytics/           # Reports & Analytics
├── ai-service/                  # FastAPI AI service
│   ├── agents/                  # 12 LangGraph agents
│   ├── graph/                   # LangGraph workflow definitions
│   ├── rag/                     # Hybrid RAG components
│   ├── tools/                   # Agent tools
│   ├── workflow/                # Workflow automation engine
│   ├── prompts/                 # Prompt templates
│   └── models/                  # Pydantic schemas
├── infrastructure/
│   ├── nginx/                   # Nginx config
│   └── .github/workflows/       # CI/CD
└── docker-compose.yml
```

---

## 🔐 RBAC Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all modules |
| **WAREHOUSE_MANAGER** | Inventory, Warehouse, GRN |
| **PURCHASE_MANAGER** | Purchase Orders, Vendors, GRN |
| **SALES_MANAGER** | Sales Orders, Products |
| **FINANCE** | Reports, Analytics, Read-only ERP |

---

## 🔄 Workflow Automation Examples

```
User: "Auto-create a purchase order when inventory falls below reorder level"

AI:   ✅ Workflow Created: "Auto Reorder"
      Trigger:    Inventory threshold < reorder_level
      Condition:  product.auto_reorder == true
      Actions:    1. Create Purchase Order
                  2. Notify Purchase Manager
                  3. Log audit entry
```

---

## 📊 ERP Modules

- **Inventory** — Stock levels, movements, alerts
- **Warehouse** — Capacity, zones, dead stock
- **GRN** — Goods Receipt, quality inspection
- **Purchase Orders** — Full PO lifecycle
- **Sales Orders** — Order management, fulfillment
- **Vendors** — Vendor scoring, risk analysis
- **Analytics** — Cross-module KPI dashboard
- **Reports** — PDF generation, Excel export

---

## 🧪 Testing

```bash
# Backend tests
cd backend && ./gradlew test

# AI service tests
cd ai-service && pytest tests/ -v

# Frontend tests
cd frontend && npm run test
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
