# Tava Health – Full-Stack Engineer Technical Assessment

Welcome! This take-home technical assessment is designed to simulate a real-world feature you might tackle at Tava Health. We want to see how you approach full-stack development, architecture, and usability. The exercise is intentionally open-ended to let your strengths shine.

---

## 🧠 The Task

You're building an **Employee Management Tool** with the following features:

### 1. Employee List

- Fetch and display a list of employees.
- Group employees by department.
- Include a search input to filter employees by name or other fields.
- If a department has no matching employees, omit it from the view.
- Include basic navigation and hover styling.

### 2. Employee Edit

- Clicking an employee should route to an edit form.
- The form should allow editing employee details.
- Persist updates through your API.

### 3. Employee Create

- Ability to route to a new page with a create form.
- Make sure basic form validation and error handling works.
- The user should be redirected to the list view after successful creation.

### 4. Employee Delete

- Clicking on a button or icon on each employee will call the delete endoint,
- The employee list should update after successful delete.

---

## 🧱 What You Need to Do

- Build your **own API** (REST, GraphQL, or other), feel free to use the `src/api/data.json` as a starting point for the initial data and structure and make sure it runs with the provided server script: `npm run server`.

- You may use in-memory data, file-based persistence, or any lightweight DB.

- Routes to implement:
  - `GET /employees` (get all employees)
  - `POST /employees/new` (create a new employee)
  - `PUT /employees/:id` (edit an employee)
  - `DELETE /employees/:id` (remove an employee)

- Build all the necessary UI to support your API endpoints.

- This is a full-stack challenge, make sure to showcase your skills across the stack.

- Feel free to add any packages/libs/frameworks to get the job done.

---

## 🚀 Getting Started

1. Download this repo as a zip file. Please do not fork or create pull requests for this repo.

2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm run dev
```

4. Build out the server and run it with the provided stubbed command in `package.json`

```bash
npm run server
```

---

## ✨ Bonus Ideas (Optional)

- Add sorting, multi-field filtering
- Add loading, error and info features
- Make it responsive
- Add unit or integration tests
- Add the ability to upload a picture for an employee
- Add pagination and enough data for pagination to work properly
- Get creative and show the team your skills!

---

## 📝 Submission Instructions

1. Add notes in a `notes.md` file explaining your thought process, tradeoffs, or areas you'd expand with more time.
2. Once finished, email a zip file of your solution to the Engineering Leader you’re working with. Please do not post your code solution online or try to create a PR with your solution in the public repo.
3. Optional - Include a working demo URL if hosted (Netlify, Vercel, etc).

---

Thanks again for taking the time — we're excited to see what you build!
