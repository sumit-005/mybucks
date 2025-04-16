## Project Documentation: MYBUCKS Web Application

**1. Project Overview**

- **Vision:** To create a modern, intuitive, and responsive web application that seamlessly integrates group expense splitting (like Splitwise) with personal finance management. The goal is to provide users with a single platform to track shared expenses with friends/groups and manage their personal income, expenses, and savings goals.
- **Core Value Proposition:** A simplified, user-friendly interface combining the best of Splitwise's group functionality with robust personal finance tracking, enhanced with features like receipt OCR, group budgeting, and savings pots.
- **Target Audience:** Individuals, couples, housemates, friends, and small groups who need to manage shared finances and also want a clear picture of their personal financial health.
- **Platform:** Responsive Web Application (Desktop & Mobile) built as a Progressive Web App (PWA) with offline support.

**2. Core Modules**

The application is primarily divided into two interconnected modules:

**2.1. Module 1: Group Ledger (Splitwise Clone Functionality)**

- **Objective:** To provide a simple yet powerful way for users to create/join groups, add expenses, track balances, and settle debts within those groups.
- **Key Features:**
  - **User Management:** Ability to add friends within the app (based on registered users).
  - **Group Creation & Management:**
    - Create groups with a name and optional description/avatar.
    - Invite registered friends to join groups.
    - View group members.
    - Leave or archive groups.
  - **Expense Tracking:**
    - Add expenses within a group: Description, Total Amount, Date, Currency.
    - Assign who paid (one or multiple payers).
    - Assign how the expense should be split among participants:
      - Equally
      - Unequally (by exact amounts)
      - By Percentage
      - By Shares
      - (Keep options clear and simple).
    - **Receipt Attachment:** Upload photo of the receipt (stored in Supabase Storage). Display thumbnail/link on expense details.
    - **Grocery OCR:**
      - If expense category = "Groceries" AND a receipt is attached:
        - Trigger an OCR process (e.g., using a Supabase Edge Function calling a cloud OCR service).
        - Parse line items (description, quantity, price) from the receipt.
        - Store structured OCR data linked to the expense (e.g., in a JSONB field).
        - Display parsed items within the expense details view.
    - Add notes to expenses.
    - Edit/Delete expenses (with appropriate permissions).
  - **Balance Calculation & Display:**
    - Real-time calculation of balances within each group (who owes whom).
    - Clear display of overall balance per user within the group.
    - Simplified view showing net amount owed or owing for the logged-in user across all groups.
  - **Settlement:**
    - Record payments between members ("Settle Up").
    - Mark debts as settled partially or fully.
    - Track settlement history.
  - **Group Budgeting:**
    - Ability to set a monthly budget for a group.
    - Visualize total spending against the budget within the group view (e.g., progress bar, remaining amount).
    - Notify (optional) group members if budget is nearing/exceeded.
  - **Activity Feed:** Show a chronological feed of activities within a group (expenses added, settlements, members joining).
  - **Simplification:** Focus on the core workflow of adding expenses and settling up. Avoid overly complex features initially (e.g., complex recurring bills, IOUs outside groups) unless deemed essential for MVP. Prioritize ease of use.

**2.2. Module 2: Personal Money Manager**

- **Objective:** To allow users to track their personal income, expenses (including their share from groups), and savings goals, providing a holistic view of their financial situation.
- **Key Features:**
  - **Income Tracking:**
    - Add income transactions (Source, Amount, Date, Category e.g., Salary, Freelance).
  - **Expense Tracking:**
    - Add personal expenses (Description, Amount, Date, Category).
    - Allow creation of custom expense/income categories.
    - **Automatic Integration:** Automatically include the user's share of expenses from all their groups in their personal expense tracking. Clearly differentiate between personal and group-related expenses.
  - **Financial Overview & Visualization:**
    - Dashboard showing:
      - Total Income vs. Total Expenses (for selected period - e.g., monthly, yearly).
      - Charts (e.g., Pie chart for spending by category, Bar chart for income vs. expense over time).
      - Net cash flow.
  - **Budgeting (Personal):**
    - Set overall monthly/yearly budgets.
    - Optionally set budgets per category.
    - Visualize spending against budgets.
  - **Savings Pots:**
    - Create named savings goals ("pots") (e.g., "Vacation Fund", "New Laptop").
    - Set a target amount and optionally a target date.
    - Manually allocate funds to pots (transferring conceptually from available cash).
    - Visualize progress towards each savings goal.
  - **Reporting:** Generate simple financial summaries (e.g., monthly expense report by category).

**3. Cross-Cutting Features & Requirements**

- **Authentication:** Secure user registration and login using Supabase Auth (Email/Password required, consider Social Logins - Google, etc. as enhancement).
- **User Profiles:** Basic user profile management (name, email, perhaps default currency).
- **UI/UX:**
  - **Responsive Design:** Mobile-first approach using Tailwind CSS, ensuring usability on all screen sizes.
  - **Clean & Intuitive:** Focus on a minimalist, clear, and easy-to-navigate interface.
  - **Progressive Web App (PWA):** Make the application installable, with an app-like feel.
- **Offline Support:**
  - Implement using PowerSync integrated with Supabase.
  - Critical data (user info, groups, members, expenses, splits, personal finances, pots) should be available offline.
  - Changes made offline should sync automatically when connectivity is restored. Handle potential conflicts gracefully (PowerSync's default or custom logic if needed).
- **Notifications:** In-app notifications for key events (e.g., added to a group, new expense added by others in a group, settlement request/confirmation, budget alerts). (Push notifications are a future enhancement).
- **Search & Filtering:** Ability to search expenses (by description, amount, category) and filter views (by date range, group, category).
- **Currency:**
  - Support multiple currencies for expenses.
  - Allow setting a default currency per user.
  - Handle currency conversions appropriately if mixing currencies within a group (define logic - e.g., use group's default or user's default, or require manual rate). _Simplicity suggests maybe locking a group to a single currency initially._
- **Data Fetching & State Management:** Use React Query for efficient data fetching, caching, and state synchronization, especially important with offline capabilities.

**4. Technical Architecture**

- **Frontend Framework:** Next.js (v13+ App Router recommended for modern features)
- **UI Library/Styling:** React + Tailwind CSS + Shadcn UI 
- **State Management/Data Fetching:** React Query (TanStack Query) 
- **PWA:** Next.js PWA capabilities (e.g., `next-pwa` package or built-in)
- **Backend:** Supabase (BaaS)
  - **Authentication:** Supabase Auth
  - **Database:** Supabase PostgreSQL
  - **Storage:** Supabase Storage (for receipt images)
  - **Serverless Functions:** Supabase Edge Functions (potentially for OCR triggering, complex calculations, or webhook handling)
- **Offline Sync:** PowerSync (connecting to Supabase DB)
- **OCR Service:** External Cloud Service (e.g., Google Cloud Vision AI, AWS Textract, Azure Form Recognizer, or a receipt-specific API) called via Supabase Edge Function. (if not free then use ocr npm package)

**5. Data Model (Conceptual - High Level)**

- `users` (Managed by Supabase Auth, linked to profiles)
- `profiles` (id, user_id, name, default_currency)
- `groups` (id, name, description, budget_amount, budget_period, currency, created_by)
- `group_members` (group_id, user_id, joined_at)
- `expenses` (id, group_id (nullable), description, amount, currency, expense_date, payer_user_id, category_id (nullable), receipt_url, ocr_data (jsonb), created_by_user_id)
- `expense_splits` (id, expense_id, user_id, owed_amount)
- `payments` (id, group_id (nullable), payer_user_id, payee_user_id, amount, currency, payment_date)
- `categories` (id, user_id (nullable for defaults), name, type ('income'/'expense'))
- `personal_transactions` (id, user_id, type ('income'/'expense'), description, amount, currency, transaction_date, category_id, linked_expense_id (nullable))
- `savings_pots` (id, user_id, name, goal_amount, current_amount, target_date)
- `pot_transactions` (id, pot_id, user_id, amount, type ('deposit'/'withdrawal'), transaction_date)

_(Note: This is conceptual. Exact schema, relationships, and use of Supabase RLS need detailed design)._

**6. Non-Functional Requirements**

- **Performance:** Fast load times, smooth transitions, responsive UI interactions. Optimize database queries and frontend rendering.
- **Security:** Implement Supabase Row Level Security (RLS) rigorously to ensure users can only access their own data or data in groups they belong to. Validate all inputs. Protect API keys for external services.
- **Scalability:** While Supabase handles much of the backend scaling, design the data model and queries efficiently.
- **Reliability:** Ensure data integrity, especially during offline sync and settlement calculations. Implement robust error handling.
- **Usability:** Prioritize ease of use and a clear, uncluttered interface.

**7. Development Considerations & Instructions for AI**

- **MVP Focus:** Start with the core functionality: User Auth, Group Creation/Joining, Adding Simple Equal Split Expenses, Viewing Balances, Recording Settlements, Basic Personal Expense/Income Tracking.
- **Iterative Development:** Build features incrementally. Implement offline support (PowerSync) early as it impacts data handling significantly.
- **Component-Based Design:** Use reusable React components.
- **Styling Consistency:** Adhere strictly to Tailwind CSS utility classes for styling. Set up a basic `tailwind.config.js` theme.
- **State Management:** Leverage React Query for server state; use `useState` or `useReducer` for local component state. Avoid complex global state managers unless necessary.
- **PowerSync Integration:** This requires careful setup. Follow PowerSync documentation for Supabase integration. Define which tables need to be synced offline.
- **OCR Implementation:**
  - Create a Supabase Edge Function (`ocr-receipt`).
  - This function takes `storage_object_path` as input.
  - It fetches the image from Supabase Storage.
  - It calls the chosen external OCR service API.
  - It parses the response to extract line items.
  - It updates the corresponding `expenses` table row with the structured `ocr_data`.
  - Trigger this function after successful image upload for grocery expenses (e.g., via a database trigger or client-side call).
- **Clear Code and Comments:** Generate well-structured, readable code with necessary comments, especially for complex logic like split calculations or PowerSync setup.
- **Testing:** Outline basic testing strategies (e.g., component tests, potentially integration tests for core flows).

---

This document provides a solid foundation for Cursor to understand the project requirements, architecture, and feature set. Remember to refine details and make specific decisions (like the exact OCR provider) as development progresses.
