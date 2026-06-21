# یک دستیار آموزشی هوشمند برای یادگیری برنامه‌نویسی پیاده‌سازی کنید.

سیستم باید بتواند با توجه به سطح دانشجو، توضیحات آموزشی مناسب ارائه دهد، برای او مسیر یادگیری طراحی کند، کوییز تولید کند، کد بنویسد، و پروژه‌های GitHub را بررسی کند.

---

## قابلیت‌ها

### 1. Quiz Generator Tool

تولید کوییز از موضوع موردنظر دانشجو.

نمونه:

```text
Generate a quiz about React Context API
```

---

### 2. Code Generator Tool

تولید کد و مثال‌های آموزشی.

نمونه:

```text
Generate a FastAPI CRUD example
```

---

### 3. GitHub Review Tool

بررسی پروژه‌های GitHub و ارائه بازخورد.

نمونه:

```text
Review this repository:
https://github.com/username/project
```

---

### 4. Learning Roadmap Tool

تولید مسیر یادگیری شخصی‌سازی شده.

نمونه:

```text
Create a roadmap for becoming a Backend Developer
```

---

## Middleware ها

### Student Level Middleware

پاسخ‌ها باید بر اساس سطح دانشجو تنظیم شوند.

سطوح:

- Beginner
- Intermediate
- Advanced

مثال:

```text
What is useEffect?
```

Beginner:

```text
توضیح ساده همراه با مثال
```

Advanced:

```text
توضیح فنی همراه با جزئیات Lifecycle و Cleanup Function
```

---

### Conversation Summary Middleware

در صورت طولانی شدن مکالمه، خلاصه‌ای از گفتگو تولید شده و به عنوان Context در ادامه مکالمه استفاده شود.

---

### Context Management Middleware

اطلاعات مهم کاربر مانند:

- سطح دانشجو
- تکنولوژی‌های موردعلاقه
- مسیر یادگیری فعلی
- موضوعات مطالعه شده

باید مدیریت و در پاسخ‌ها استفاده شوند.

---

## رابط کاربری

پروژه باید دارای رابط کاربری چت باشد.

پیشنهاد:

- Next.js
- Vercel AI SDK
- Vercel AI Chat Template

استفاده از Template ها و کامپوننت‌های آماده Vercel مجاز است.

---

## ابزارهای مورد نیاز

- LangChain
- GitHub API یا GitHub MCP
- Vercel AI SDK

---

## قابلیت‌های امتیازی

موارد زیر الزامی نیستند اما امتیاز اضافه خواهند داشت:

### YouTube Search Tool (+5)

پیدا کردن ویدئوهای آموزشی مرتبط با موضوع.

نمونه:

```text
Find videos for FastAPI Authentication
```

### Context7 Integration (+5)

استفاده از Context7 برای دسترسی به مستندات و منابع به‌روز تکنولوژی‌ها.

نمونه:

```text
Latest documentation for LangChain
```

### رابط کاربری حرفه‌ای (+10)

پیاده‌سازی رابط کاربری حرفه‌ای با استفاده از:

- Vercel AI Chat Template
- Components آماده
- طراحی مناسب
- تجربه کاربری بهتر

---

## تحویل پروژه

- لینک GitHub Repository
- ویدئوی کوتاه (Screen Recording) از قابلیت‌های پروژه

---

## معیارهای ارزیابی (100 نمره)

| بخش | امتیاز |
|------|---------|
| پیاده‌سازی صحیح Agent | 20 |
| Quiz Generator Tool | 10 |
| Code Generator Tool | 10 |
| GitHub Review Tool | 15 |
| Learning Roadmap Tool | 10 |
| Student Level Middleware | 10 |
| Context & Conversation Management | 15 |
| کیفیت کد و ساختار پروژه | 5 |
| مستندسازی پروژه | 5 |

### امتیاز اضافه

- YouTube Search Tool: +5
- Context7 Integration: +5
- رابط کاربری حرفه‌ای: +10