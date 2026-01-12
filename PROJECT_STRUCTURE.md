# Dermastore - Complete Project Structure

## Overview

This document defines the complete folder structure for the Dermastore e-commerce platform with:
- **Frontend**: Next.js 14 + React 18
- **Backend**: Magento 2 (Headless)
- **AI/ML Services**: AWS Lambda + Python
- **Infrastructure**: Terraform (AWS)

---

## Complete Folder Structure

```
dermastore/
├── README.md
├── PROJECT_STRUCTURE.md
├── STYLE_GUIDE.md
├── FIGMA_WORKFLOWS.md
├── TECHNICAL_ARCHITECTURE.md
├── COMPONENT_LIBRARY.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci-frontend.yml              # Frontend CI/CD
│   │   ├── ci-lambdas.yml               # Lambda deployment
│   │   ├── ci-terraform.yml             # Infrastructure CI
│   │   └── ci-magento.yml               # Magento deployment
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── infrastructure/                       # Terraform IaC
│   ├── README.md
│   ├── main.tf                          # Root module
│   ├── variables.tf                     # Global variables
│   ├── outputs.tf                       # Root outputs
│   ├── providers.tf                     # AWS provider config
│   ├── backend.tf                       # S3 state backend
│   ├── versions.tf                      # Terraform version constraints
│   │
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── terraform.tfvars
│   │   │   └── backend.hcl
│   │   ├── staging/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── terraform.tfvars
│   │   │   └── backend.hcl
│   │   └── prod/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       ├── terraform.tfvars
│   │       └── backend.hcl
│   │
│   ├── modules/
│   │   ├── networking/
│   │   │   ├── main.tf                  # VPC, subnets, NAT, IGW
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── security-groups.tf
│   │   │
│   │   ├── compute/
│   │   │   ├── main.tf                  # EC2 spot instances
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   ├── spot-fleet.tf
│   │   │   ├── launch-template.tf
│   │   │   ├── autoscaling.tf
│   │   │   └── user-data.sh
│   │   │
│   │   ├── database/
│   │   │   ├── main.tf                  # RDS MySQL
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── parameter-group.tf
│   │   │
│   │   ├── cache/
│   │   │   ├── main.tf                  # ElastiCache Redis
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   │
│   │   ├── search/
│   │   │   ├── main.tf                  # OpenSearch
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   │
│   │   ├── storage/
│   │   │   ├── main.tf                  # S3 buckets
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── cloudfront.tf
│   │   │
│   │   ├── lambda/
│   │   │   ├── main.tf                  # Lambda functions
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   ├── api-gateway.tf
│   │   │   └── iam.tf
│   │   │
│   │   ├── ai-services/
│   │   │   ├── main.tf                  # Rekognition, Personalize, Bedrock
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── iam.tf
│   │   │
│   │   ├── monitoring/
│   │   │   ├── main.tf                  # CloudWatch
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   ├── alarms.tf
│   │   │   └── dashboards.tf
│   │   │
│   │   ├── security/
│   │   │   ├── main.tf                  # WAF, Secrets Manager
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   ├── waf.tf
│   │   │   └── secrets.tf
│   │   │
│   │   └── dns/
│   │       ├── main.tf                  # Route53
│   │       ├── variables.tf
│   │       └── outputs.tf
│   │
│   └── scripts/
│       ├── init-backend.sh              # Initialize S3 backend
│       ├── plan.sh                      # Terraform plan wrapper
│       ├── apply.sh                     # Terraform apply wrapper
│       └── destroy.sh                   # Terraform destroy wrapper
│
├── frontend/                             # Next.js Application
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .env.local.example
│   ├── .env.development
│   ├── .env.production
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── vercel.json
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── images/
│   │   │   ├── hero/
│   │   │   ├── brands/
│   │   │   └── placeholders/
│   │   └── fonts/
│   │       ├── inter/
│   │       └── playfair/
│   │
│   ├── src/
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── layout.tsx               # Root layout
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── loading.tsx              # Global loading
│   │   │   ├── error.tsx                # Global error
│   │   │   ├── not-found.tsx            # 404 page
│   │   │   ├── globals.css              # Global styles
│   │   │   │
│   │   │   ├── (shop)/                  # Shop route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx         # Product listing
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── page.tsx     # Product detail
│   │   │   │   │       └── loading.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── brands/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── search/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (checkout)/              # Checkout route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── cart/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── order-confirmation/
│   │   │   │       └── [orderId]/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── (account)/               # Account route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── account/
│   │   │   │   │   ├── page.tsx         # Dashboard
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [orderId]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── addresses/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── wishlist/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── settings/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── skin-profile/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (ai)/                    # AI Features route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── skin-analysis/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── product-finder/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── routine-builder/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (content)/               # Content pages
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── contact/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── faq/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── policies/
│   │   │   │       ├── privacy/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── terms/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── shipping/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── returns/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   └── api/                     # API Routes
│   │   │       ├── health/
│   │   │       │   └── route.ts
│   │   │       ├── revalidate/
│   │   │       │   └── route.ts
│   │   │       └── webhooks/
│   │   │           └── magento/
│   │   │               └── route.ts
│   │   │
│   │   ├── components/                  # React Components
│   │   │   ├── ui/                      # Base UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── radio.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── spinner.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── rating.tsx
│   │   │   │   └── index.ts             # Barrel export
│   │   │   │
│   │   │   ├── layout/                  # Layout components
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── navigation.tsx
│   │   │   │   │   ├── mega-menu.tsx
│   │   │   │   │   ├── search-bar.tsx
│   │   │   │   │   ├── cart-icon.tsx
│   │   │   │   │   ├── user-menu.tsx
│   │   │   │   │   └── mobile-menu.tsx
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── newsletter.tsx
│   │   │   │   │   └── social-links.tsx
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   └── filter-sidebar.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── product/                 # Product components
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-grid.tsx
│   │   │   │   ├── product-carousel.tsx
│   │   │   │   ├── product-gallery.tsx
│   │   │   │   ├── product-info.tsx
│   │   │   │   ├── product-options.tsx
│   │   │   │   ├── product-reviews.tsx
│   │   │   │   ├── product-tabs.tsx
│   │   │   │   ├── related-products.tsx
│   │   │   │   ├── quick-view.tsx
│   │   │   │   ├── price-display.tsx
│   │   │   │   ├── stock-status.tsx
│   │   │   │   ├── add-to-cart.tsx
│   │   │   │   ├── wishlist-button.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── cart/                    # Cart components
│   │   │   │   ├── cart-drawer.tsx
│   │   │   │   ├── cart-item.tsx
│   │   │   │   ├── cart-summary.tsx
│   │   │   │   ├── quantity-selector.tsx
│   │   │   │   ├── promo-code.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── checkout/                # Checkout components
│   │   │   │   ├── checkout-form.tsx
│   │   │   │   ├── checkout-steps.tsx
│   │   │   │   ├── shipping-form.tsx
│   │   │   │   ├── payment-form.tsx
│   │   │   │   ├── order-summary.tsx
│   │   │   │   ├── address-selector.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── account/                 # Account components
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   ├── profile-form.tsx
│   │   │   │   ├── address-form.tsx
│   │   │   │   ├── order-history.tsx
│   │   │   │   ├── order-detail.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── search/                  # Search components
│   │   │   │   ├── search-modal.tsx
│   │   │   │   ├── search-results.tsx
│   │   │   │   ├── search-filters.tsx
│   │   │   │   ├── search-suggestions.tsx
│   │   │   │   ├── filter-chip.tsx
│   │   │   │   ├── sort-dropdown.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ai/                      # AI Feature components
│   │   │   │   ├── skin-analyzer/
│   │   │   │   │   ├── camera-capture.tsx
│   │   │   │   │   ├── image-upload.tsx
│   │   │   │   │   ├── analysis-result.tsx
│   │   │   │   │   ├── skin-score.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── recommendations/
│   │   │   │   │   ├── product-recommendations.tsx
│   │   │   │   │   ├── personalized-banner.tsx
│   │   │   │   │   ├── routine-builder.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── chatbot/
│   │   │   │   │   ├── chat-widget.tsx
│   │   │   │   │   ├── chat-message.tsx
│   │   │   │   │   ├── chat-input.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── home/                    # Homepage components
│   │   │   │   ├── hero-banner.tsx
│   │   │   │   ├── featured-products.tsx
│   │   │   │   ├── category-grid.tsx
│   │   │   │   ├── brand-carousel.tsx
│   │   │   │   ├── promo-banner.tsx
│   │   │   │   ├── testimonials.tsx
│   │   │   │   ├── instagram-feed.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── forms/                   # Form components
│   │   │   │   ├── form-field.tsx
│   │   │   │   ├── form-error.tsx
│   │   │   │   ├── form-label.tsx
│   │   │   │   ├── contact-form.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── common/                  # Shared components
│   │   │       ├── seo.tsx
│   │   │       ├── analytics.tsx
│   │   │       ├── error-boundary.tsx
│   │   │       ├── loading-screen.tsx
│   │   │       ├── empty-state.tsx
│   │   │       ├── image-with-fallback.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── lib/                         # Core utilities
│   │   │   ├── magento/                 # Magento API client
│   │   │   │   ├── client.ts            # Base client setup
│   │   │   │   ├── graphql.ts           # GraphQL client
│   │   │   │   ├── rest.ts              # REST client
│   │   │   │   ├── queries/
│   │   │   │   │   ├── products.ts
│   │   │   │   │   ├── categories.ts
│   │   │   │   │   ├── cart.ts
│   │   │   │   │   ├── customer.ts
│   │   │   │   │   └── orders.ts
│   │   │   │   ├── mutations/
│   │   │   │   │   ├── cart.ts
│   │   │   │   │   ├── customer.ts
│   │   │   │   │   └── checkout.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ai/                      # AI service clients
│   │   │   │   ├── skin-analysis.ts
│   │   │   │   ├── recommendations.ts
│   │   │   │   ├── chatbot.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── cn.ts                # Classname utility
│   │   │   │   ├── format.ts            # Formatters (price, date)
│   │   │   │   ├── validation.ts        # Form validation
│   │   │   │   ├── storage.ts           # Local storage helpers
│   │   │   │   ├── cookies.ts           # Cookie helpers
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── routes.ts
│   │   │   │   ├── config.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── gtm.ts
│   │   │       ├── events.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── use-cart.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-wishlist.ts
│   │   │   ├── use-products.ts
│   │   │   ├── use-search.ts
│   │   │   ├── use-checkout.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-intersection.ts
│   │   │   ├── use-scroll-lock.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── store/                       # Zustand stores
│   │   │   ├── cart-store.ts
│   │   │   ├── auth-store.ts
│   │   │   ├── wishlist-store.ts
│   │   │   ├── ui-store.ts
│   │   │   ├── filter-store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                       # TypeScript types
│   │   │   ├── product.ts
│   │   │   ├── category.ts
│   │   │   ├── cart.ts
│   │   │   ├── customer.ts
│   │   │   ├── order.ts
│   │   │   ├── checkout.ts
│   │   │   ├── ai.ts
│   │   │   ├── api.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/                      # Additional styles
│   │   │   ├── variables.css
│   │   │   ├── animations.css
│   │   │   └── typography.css
│   │   │
│   │   └── middleware.ts                # Next.js middleware
│   │
│   ├── tests/                           # Frontend tests
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── integration/
│   │   │   ├── cart.test.ts
│   │   │   └── checkout.test.ts
│   │   ├── e2e/
│   │   │   ├── home.spec.ts
│   │   │   ├── product.spec.ts
│   │   │   ├── cart.spec.ts
│   │   │   └── checkout.spec.ts
│   │   ├── setup.ts
│   │   └── mocks/
│   │       ├── handlers.ts
│   │       └── server.ts
│   │
│   └── scripts/
│       ├── generate-sitemap.ts
│       └── sync-translations.ts
│
├── lambdas/                              # AWS Lambda Functions
│   ├── README.md
│   ├── requirements.txt                 # Shared dependencies
│   ├── pyproject.toml
│   │
│   ├── shared/                          # Shared Lambda code
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── logger.py
│   │   ├── responses.py
│   │   ├── exceptions.py
│   │   └── aws_clients.py
│   │
│   ├── skin-analysis/                   # Skin Analysis Lambda
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── skin_types.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── rekognition.py
│   │   │   └── analysis.py
│   │   └── tests/
│   │       ├── __init__.py
│   │       └── test_handler.py
│   │
│   ├── recommendations/                 # Product Recommendations Lambda
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── personalize.py
│   │   │   └── scoring.py
│   │   └── tests/
│   │       ├── __init__.py
│   │       └── test_handler.py
│   │
│   ├── chatbot/                         # AI Chatbot Lambda
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── bedrock.py
│   │   │   └── conversation.py
│   │   ├── prompts/
│   │   │   ├── system.txt
│   │   │   └── templates/
│   │   └── tests/
│   │       ├── __init__.py
│   │       └── test_handler.py
│   │
│   ├── search-enhancement/              # AI Search Lambda
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── opensearch.py
│   │   │   └── nlp.py
│   │   └── tests/
│   │       └── test_handler.py
│   │
│   ├── image-processing/                # Image Processing Lambda
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── resize.py
│   │   │   └── optimize.py
│   │   └── tests/
│   │       └── test_handler.py
│   │
│   ├── webhook-handler/                 # Magento Webhook Handler
│   │   ├── handler.py
│   │   ├── requirements.txt
│   │   ├── events/
│   │   │   ├── __init__.py
│   │   │   ├── order.py
│   │   │   ├── product.py
│   │   │   └── customer.py
│   │   └── tests/
│   │       └── test_handler.py
│   │
│   └── scheduled/                       # Scheduled Tasks
│       ├── sync-products/
│       │   ├── handler.py
│       │   └── requirements.txt
│       ├── train-models/
│       │   ├── handler.py
│       │   └── requirements.txt
│       └── cleanup/
│           ├── handler.py
│           └── requirements.txt
│
├── magento/                              # Magento 2 Customizations
│   ├── README.md
│   │
│   ├── app/
│   │   └── code/
│   │       └── Dermastore/              # Custom module namespace
│   │           ├── Core/                # Core customizations
│   │           │   ├── registration.php
│   │           │   ├── etc/
│   │           │   │   └── module.xml
│   │           │   └── Model/
│   │           │
│   │           ├── Api/                 # Custom API endpoints
│   │           │   ├── registration.php
│   │           │   ├── etc/
│   │           │   │   ├── module.xml
│   │           │   │   ├── di.xml
│   │           │   │   └── webapi.xml
│   │           │   ├── Api/
│   │           │   │   └── CustomEndpointInterface.php
│   │           │   └── Model/
│   │           │       └── CustomEndpoint.php
│   │           │
│   │           ├── Webhooks/            # Webhook dispatchers
│   │           │   ├── registration.php
│   │           │   ├── etc/
│   │           │   │   ├── module.xml
│   │           │   │   └── events.xml
│   │           │   └── Observer/
│   │           │       ├── OrderObserver.php
│   │           │       └── ProductObserver.php
│   │           │
│   │           └── Theme/               # Theme customizations
│   │               └── etc/
│   │
│   ├── app/
│   │   └── design/
│   │       └── frontend/
│   │           └── Dermastore/
│   │               └── default/
│   │                   ├── registration.php
│   │                   ├── theme.xml
│   │                   └── etc/
│   │                       └── view.xml
│   │
│   └── docker/                          # Local Magento Docker
│       ├── docker-compose.yml
│       ├── nginx/
│       │   └── default.conf
│       ├── php/
│       │   └── Dockerfile
│       └── mysql/
│           └── init.sql
│
├── scripts/                              # Project-wide scripts
│   ├── setup-dev.sh                     # Development setup
│   ├── deploy-frontend.sh               # Deploy frontend to Vercel
│   ├── deploy-lambdas.sh                # Deploy Lambda functions
│   ├── deploy-infrastructure.sh         # Run Terraform
│   ├── seed-data.sh                     # Seed test data
│   ├── backup-db.sh                     # Database backup
│   └── run-tests.sh                     # Run all tests
│
├── docs/                                 # Additional documentation
│   ├── api/
│   │   ├── magento-endpoints.md
│   │   └── ai-endpoints.md
│   ├── deployment/
│   │   ├── aws-setup.md
│   │   ├── vercel-setup.md
│   │   └── magento-setup.md
│   ├── development/
│   │   ├── local-setup.md
│   │   ├── coding-standards.md
│   │   └── testing.md
│   └── architecture/
│       ├── decisions/
│       │   ├── adr-001-magento-backend.md
│       │   ├── adr-002-nextjs-frontend.md
│       │   └── adr-003-aws-infrastructure.md
│       └── diagrams/
│           ├── system-overview.png
│           └── data-flow.png
│
├── .vscode/                              # VS Code settings
│   ├── settings.json
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
│
├── .husky/                               # Git hooks
│   ├── pre-commit
│   └── commit-msg
│
├── .gitignore
├── .editorconfig
├── .nvmrc
├── docker-compose.yml                   # Local development
├── Makefile                             # Common commands
└── package.json                         # Root workspace (optional)
```

---

## Quick Reference

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `/infrastructure` | Terraform IaC for AWS |
| `/frontend` | Next.js storefront |
| `/lambdas` | Python Lambda functions |
| `/magento` | Magento 2 customizations |
| `/scripts` | Deployment & utility scripts |
| `/docs` | Extended documentation |

### Terraform Modules

| Module | Resources Created |
|--------|-------------------|
| `networking` | VPC, subnets, NAT, security groups |
| `compute` | EC2 spot fleet, ASG, launch templates |
| `database` | RDS MySQL, parameter groups |
| `cache` | ElastiCache Redis cluster |
| `search` | OpenSearch domain |
| `storage` | S3 buckets, CloudFront distribution |
| `lambda` | Lambda functions, API Gateway |
| `ai-services` | Rekognition, Personalize, Bedrock |
| `monitoring` | CloudWatch dashboards, alarms |
| `security` | WAF, Secrets Manager |
| `dns` | Route53 zones, records |

### Lambda Functions

| Function | Purpose | Trigger |
|----------|---------|---------|
| `skin-analysis` | Analyze skin images | API Gateway |
| `recommendations` | Product recommendations | API Gateway |
| `chatbot` | AI-powered chat | API Gateway |
| `search-enhancement` | NLP search | API Gateway |
| `image-processing` | Resize/optimize images | S3 trigger |
| `webhook-handler` | Process Magento events | API Gateway |
| `sync-products` | Sync product data | CloudWatch scheduled |
| `train-models` | Retrain ML models | CloudWatch scheduled |

---

## Getting Started Commands

```bash
# Clone and setup
git clone https://github.com/yourorg/dermastore.git
cd dermastore

# Setup development environment
make setup

# Infrastructure
cd infrastructure/environments/dev
terraform init -backend-config=backend.hcl
terraform plan
terraform apply

# Frontend
cd frontend
npm install
npm run dev

# Lambdas
cd lambdas
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run tests
make test
```
