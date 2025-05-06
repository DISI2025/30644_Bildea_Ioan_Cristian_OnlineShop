# Running locally:
- To run locally, make sure every criteria of the backend services and/or frontend are met.
- Then, run them in the following order:
  + Service Discovery
  + Individual services (e.g. Identity Service)
  + Gateway
  + Frontend

# Git Branching & Workflow for Jira DEAL‑ Stories

This guide defines a clear, consistent workflow to manage feature and sub‑feature branches aligned with your Jira stories (`DEAL-[ID]`).

---

## 🪄 Branch Naming Conventions

### 🛠 Feature Branches
`feature/DEAL-<ID>-<short-description>`

### ✨ Subfeature Branches
- `subfeature/DEAL-<ID>/FE-<short-task-description>`
- `subfeature/DEAL-<ID>/BE-<short-task-description>`


---

## 🧱 Creating Branches

### ➕ Create and switch to a new feature branch
`git checkout -b feature/DEAL-<ID>-add-login-form`

### ➕ Create and switch to a new subfeature branch
`git checkout -b subfeature/DEAL-<ID>/FE-add-login-form-validation`

## 🗂 Committing & Pushing
### ‍🧙 Stage your changes
`git add .`
### 🧙‍♀️ Commit message
`git commit -m "add client-side validation for login form"`
### 🚀 Push and track upstream
`git push -u origin subfeature/DEAL-1234/FE-add-login-form-validation`

## 🔁 Keeping Branches Up to Date
### 🔀 Merge main into your feature
`git checkout feature/DEAL-<ID>-add-login-form`
`git fetch origin`
`git merge origin/main`


## 🧩 Merging Work Back
### 🔀 Merge subfeature into feature
`git checkout feature/DEAL-<ID>-add-login-form`
`git merge subfeature/DEAL-<ID>/FE-add-login-form-validation`
`git push`

### 🔀 Merge feature into main
`git checkout main`
`git merge feature/DEAL-<ID>-add-login-form`
`git push`

## 🧭 Summary Workflow
- Start on main.

- Create feature/DEAL-<ID>-….

- From there, create:

  - `subfeature/DEAL-XXXX/FE-…`

  - `subfeature/DEAL-XXXX/BE-…`

- Work and commit locally.

- Push subfeatures.

- Keep feature up to date from main.

- Merge feature into main when done after you create a merge request and it pass the review.

### 🧩 Merge Request conventions
- Create a merge request for feature branch:
    - Name it `[Feature][DEAL-ID] - Add login`.
    - From `feature/DEAL-<ID>-add-login`.
    - To `main`
- Create a merge request for subfeature FE:
    - Name it `[Subfeature][FE][DEAL-ID] - Add login form validation`.
    - From `subfeature/DEAL-<ID>/FE-add-login-form-validation`.
    - To `feature/DEAL-<ID>-add-login-form`.
- Create a merge request for subfeature BE:
  - name it `[Subfeature][BE][DEAL-ID] - Add login endpoind`.
  - From `subfeature/DEAL-<ID>/BE-add-login-endpoind`.
  - To `feature/DEAL-<ID>-add-login`.
