# Role-Based UI Routing & Dashboard Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Role-Based Access Control (RBAC) on the Frontend to route the four system roles (ADMIN, SALES, COORDINATOR, CUSTOMER) to their appropriate dashboards and protect unauthorized access.

**Architecture:** 
1. The Backend JWT token payload will be parsed on the Frontend to extract the user's role.
2. The `login.js` script will route authenticated users to role-specific entry points instead of hardcoding `admin.html`.
3. The `app.js` (or a new `authGuard.js`) will verify the role on every protected page load and redirect unauthorized users to `index.html` or a 403 page.
4. Shell HTML files will be created/adapted for each role (`admin.html`, `sales.html`, `coordinator.html`, `customer.html`).

**Tech Stack:** Vanilla JavaScript, HTML5, CSS3, JWT decoding (Frontend).

**Spec:** Requirement from user chat: "Tách UI cho Customer, Admin, Sales, Coordinator".

## Global Constraints

- Backend provides roles as `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER` (without `ROLE_` prefix in DB, but Spring Security adds `ROLE_` in JWT).
- No new libraries for frontend JWT parsing (use standard `atob` and `JSON.parse`).
- Frontend must not trust the role completely for sensitive data; backend API will still enforce `@PreAuthorize`, but UI must fail gracefully (403).

## Review Focus

- User logs in with `CUSTOMER` role but manually types `/admin.html` in the URL bar (Expectation: Redirected to `index.html` or `customer.html` instantly).
- User's token expires while they are on a protected page (Expectation: Redirected to `login.html`).
- The JWT payload doesn't contain a role (Expectation: Treat as unauthenticated or default restricted state, prompt re-login).
- A user tries to access a protected page completely offline/without backend connection (Expectation: `authGuard` checks local token validity; if expired, redirect to login).

---

### Task 1: Implement JWT Parsing & Routing Logic in `login.js`

**Files:**
- Modify: `frontend/js/login.js`
- Modify: `frontend/js/api.js` (add JWT parser utility)

**Interfaces:**
- Produces: `parseJwt(token)` utility function accessible globally.
- Produces: Dynamic routing in `login.js` based on parsed role.

- [ ] **Step 1: Write JWT parser utility**
In `api.js`, add `function parseJwt(token)` using `atob` to decode the payload.

- [ ] **Step 2: Update `login.js` to route by role**
Modify the `if (response.ok)` block in `login.js`. Extract the role from `data.accessToken` using `parseJwt`.
- Role `ADMIN` -> `admin.html`
- Role `SALES` -> `sales.html`
- Role `COORDINATOR` -> `coordinator.html`
- Role `CUSTOMER` -> `customer.html`
- Fallback -> `index.html`

- [ ] **Step 3: Test Login Routing**
Run: Start backend, login as `admin_demo` and `test_customer`.
Expected: `admin_demo` goes to `admin.html`, `test_customer` goes to `customer.html`.

- [ ] **Step 4: Commit**
```bash
git add frontend/js/api.js frontend/js/login.js
git commit -m "feat(ui): implement dynamic routing based on jwt role"
```

### Task 2: Create Role-Specific Dashboards (Shells)

**Files:**
- Create: `frontend/sales.html`
- Create: `frontend/coordinator.html`
- Create: `frontend/customer.html`
- Modify: `frontend/admin.html`

**Interfaces:**
- Consumes: `authGuard.js` (from Task 3) for protection.

- [ ] **Step 1: Create/Clone shell HTMLs**
Duplicate `admin.html` to create `sales.html`, `coordinator.html`, and `customer.html`. 

- [ ] **Step 2: Customize sidebars**
- `admin.html`: Keep full access (User Management, Menus, Services).
- `sales.html`: Keep Contracts, Customers, Payments. Remove User Management.
- `coordinator.html`: Keep Events, Tasks, Venues. Remove Payments and Users.
- `customer.html`: Change layout to a customer-friendly portal (My Events, My Contracts).

- [ ] **Step 3: Test Dashboards**
Run: Open each HTML file in the browser.
Expected: Visual distinction between the roles' sidebars.

- [ ] **Step 4: Commit**
```bash
git add frontend/*.html
git commit -m "feat(ui): create role-specific dashboard shells"
```

### Task 3: Implement Frontend Auth Guard (RBAC Protection)

**Files:**
- Create: `frontend/js/authGuard.js`
- Modify: All protected HTML files (include `authGuard.js` in `<head>`).

**Interfaces:**
- Consumes: `parseJwt` from `api.js`.

- [ ] **Step 1: Write `authGuard.js`**
Create a script that runs immediately on page load. It checks `localStorage.getItem('token')`. If missing, redirect to `login.html`. If present, parse it.
Check `window.location.pathname`. 
If path includes `admin.html` and role !== `ADMIN`, redirect to `login.html` (or home). Implement similarly for other roles.

- [ ] **Step 2: Attach to HTML files**
Add `<script src="js/authGuard.js"></script>` to `admin.html`, `sales.html`, `coordinator.html`, `customer.html` BEFORE the body starts rendering (to prevent UI flickering).

- [ ] **Step 3: Verify Protection**
Run: Login as CUSTOMER, manually change URL to `/admin.html`.
Expected: Immediately redirected away from `admin.html`.

- [ ] **Step 4: Commit**
```bash
git add frontend/js/authGuard.js frontend/*.html
git commit -m "feat(ui): implement frontend auth guard for rbac"
```
