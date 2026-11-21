# Screenshot list — Demo environment chapter

Not a page: files whose name starts with `_` are not published (Starlight's docs loader skips them).
This list is the input for the screenshot pipeline. Each id is captured in English and in Chinese
(`zh-cn`), in a freshly reset experience account of the demo environment (demo.operoncore.app).
`<prefix>` is the account's sign-in prefix.

| Id | Page | Role (sign-in) | Screen | State to capture |
|---|---|---|---|---|
| `demo/sign-in-notice` | overview | signed out | `/login` | Sign-in page with the demo notice "This is a demo environment. Do not upload real documents or personal data." |
| `demo/demo-inbox-list` | overview | tenant admin (`<prefix>.admin`) | `/demo-inbox` | Inbox with at least the checklist email and an e-sign invitation listed. |
| `demo/secretary-cases-board` | annual-returns | secretary (`<prefix>.secretary`) | Secretary workspace › Cases | Board with the four annual return cards and the incorporation / change cards in their columns. |
| `demo/annual-return-acra-filing` | annual-returns | secretary | Orchid Mesa annual return › Continue in chat | The "ACRA filing" card with "Fill the ACRA form". |
| `demo/incorporation-id-extracted` | incorporation | secretary | Fernreach incorporation › People roster | Nadia Chua's card after both NRIC sides uploaded and "Extract from ID": fields marked "Extracted from the ID below — please check". |
| `demo/incorporation-acra-mock-filled` | incorporation | secretary | Mock ACRA registration wizard (acra-demo.operoncore.app) | First wizard page filled in by the demo extension for Kestrel Bay. Needs the demo extension installed. |
| `demo/change-director-signing` | corporate-changes | secretary | Juniper Forge change of director › Continue in chat | "Collect signed documents" card, "By signer" view, signers "Waiting". |
| `demo/checklist-staff-sent` | client-checklist | sales (`<prefix>.sales`) | Marigold Lane change of director case | "Prerequisites" panel before the client submits: two answers prefilled, new director empty. |
| `demo/checklist-staff-confirmed` | client-checklist | sales | Same case | Panel after the client submitted and "Confirm complete" was pressed. |
| `demo/crm-board-stages` | crm-invoices | sales | CRM › Opportunity | Kanban board with opportunities in New, Qualified, Cold, Agreed, Won, Lost. |
| `demo/crm-contract-draft` | crm-invoices | sales | Halcyon Ridge payroll opportunity › Contract | Contract in preparation with the client signatory set. |
| `demo/invoices-list-statuses` | crm-invoices | tenant admin | Invoices | Invoice list, tab All: drafts, awaiting payment, paid, overdue. |
| `demo/bookkeeping-a-f5-check` | bookkeeping | accountant (`<prefix>.accountant`) | Tidewater quarter › workbench › Review › F5 check | F5 boxes of the booked quarter. |
| `demo/bookkeeping-b-todos` | bookkeeping | accountant | Juniper Forge quarter › workbench › Documents, filter "To do" | Open to-dos of the half-booked quarter. |
| `demo/bookkeeping-c-run-progress` | bookkeeping | accountant | Marigold Lane quarter › workbench › Documents | "AI bookkeeping run" card while running (phase, counterparties, spend). |
| `demo/settings-reset-card` | reset-faq | tenant admin | Settings › About | "Demo account" card with "Available until" and "Reset demo account". |
| `demo/portal-sign-in-code` | client-portal | portal (`<prefix>.client`) | `/portal/login` › Email me a sign-in code | "Enter the code" screen. |
| `demo/portal-home` | client-portal | portal | `/portal` | Home of Marigold Lane Kitchen (redesigned portal): the four tiles, key figures and the Waiting on you board. |
| `demo/portal-esign-waiting` | client-portal | portal | `/portal/esign` | The three tiles and the engagement letter under "Waiting for your signature". |
| `demo/portal-documents-folder` | client-portal | portal | Documents | Folder "Shared with Marigold Lane" with its two PDFs. |
| `demo/portal-accounting-questions` | client-portal | portal | Accounting & Tax › the bookkeeping case › Open | The case page: two questions "To answer", and "Handled by" on the right. |
| `demo/portal-checklist-open` | client-portal | portal | Secretarial › checklist › Open | New-director checklist with two answers prefilled. |
| `demo/portal-invoicenow-received` | client-portal | portal | Invoices › Received | Invoice TWS-2026-045 and credit note TWS-CN-2026-003 (wait about 15 minutes after the reset). |
| `demo/portal-invoicenow-delivered` | client-portal | portal | Invoices › Sent | The open-house invoice sent live, Delivery shows a tick and the time. |
