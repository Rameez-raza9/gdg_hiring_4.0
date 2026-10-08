# Deploy GDGoC SVEC Hiring and collect applications

This project is a Vite static website. **Vercel is the recommended host** for the quickest GitHub-connected deployment. Render also works; setup for both is below.

## 1. Setup Apps Script in your Google Sheet

1. Open your Google Sheet: [**GDGoC SVEC 4.0 Applications**](https://docs.google.com/spreadsheets/d/105h2_S65Uyv4uf40yxAA1fAt405cHbYq3-JMr7JsRp4/edit) while logged in to **`dynamicrameez0786@gmail.com`**.
2. **Remove unwanted collaborators**: Click **Share** (top-right) and ensure only your account (`dynamicrameez0786@gmail.com`) has owner access. If any previous accounts (like Sidhi's email) are listed, remove them.
3. Open **Extensions > Apps Script**.
4. Replace the contents of `Code.gs` in the editor with the complete contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs) from this project.
5. In Apps Script, choose **Deploy > New deployment**:
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Description:** `GDGoC SVEC 4.0 Hiring Form Handler`
   - **Execute as:** `Me (dynamicrameez0786@gmail.com)`
   - **Who has access:** `Anyone`
6. Click **Deploy**, authorize the permissions using your Google account (`dynamicrameez0786@gmail.com`), and copy the deployed Web App URL (ending in `/exec`).

## 2. Connect the URL to the Website

In the project folder, open `.env.local` (and add to Vercel environment variables):

```text
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec
```

Then test locally:

```powershell
npm install
npm run dev
```

Submit a test application. The script will automatically create the `Applications` tab in your Google Sheet with all headers and append the row.

## 3. GitHub & Vercel Deployment

Repository: [https://github.com/Rameez-raza9/gdg_hiring_4.0.git](https://github.com/Rameez-raza9/gdg_hiring_4.0.git)

`.gitignore` excludes `node_modules`, `dist`, and local `.env` files, so the Apps Script URL in `.env.local` will not be pushed.

### Import and deploy

1. Sign in to Vercel and choose **Add New > Project**.
2. Import the GitHub repository you just pushed.
3. Check the project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (the repository root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` (the default is fine)
4. Before deploying, open **Environment Variables** and add:
   - **Name:** `VITE_GOOGLE_SHEETS_WEB_APP_URL`
   - **Value:** the Apps Script URL ending in `/exec`
   - **Environments:** Production, Preview, and Development
5. Choose **Deploy**. Vercel builds the Vite site and gives you a public `vercel.app` address.
6. Open that address and submit a test application. Verify it appears in the `Applications` tab.

Vercel's [Vite deployment guide](https://vercel.com/docs/frameworks/frontend/vite) covers importing and deploying Vite projects. Vite-prefixed environment variables are included in the client build, so the Apps Script URL is public; it is an endpoint, **not a secret**.

## 4. Or publish on Render

1. Sign in to Render and choose **New > Static Site**.
2. Connect the GitHub repository used above and select the `main` branch.
3. Use these settings:
   - **Root Directory:** leave blank (repository root)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add this environment variable in the site settings:
   - **Name:** `VITE_GOOGLE_SHEETS_WEB_APP_URL`
   - **Value:** the Apps Script URL ending in `/exec`
5. Create the static site and wait for the deploy to finish.
6. Open its `onrender.com` address and submit a test application. Verify it appears in the `Applications` tab.

Render's [Static Sites guide](https://render.com/docs/static-sites) explains connecting a repository, setting the build and publish directories, and adding environment variables.

## 5. Updating the site

After changing the source code, commit and push the change to GitHub. Vercel and Render will build and deploy the new commit. If you change the Apps Script URL, update `VITE_GOOGLE_SHEETS_WEB_APP_URL` in the host's environment-variable settings and trigger a new deployment.

## Updating the Google Sheet columns

The Apps Script writes every submitted form value to its matching column, including personal and academic details, domain and wing, prerequisite response, written answers, experience level, project answer and description for third-year Tech applicants, wing-specific selections and responses, event experience, and the accuracy confirmation. It assigns each new response a sequential, unique 10-digit Application ID using a script property protected by a lock. Keep the `LAST_APPLICATION_ID` script property so IDs remain unique. If the `Applications` tab already exists, the script adds any missing headers at the end and preserves existing rows.

After changing `google-apps-script/Code.gs`, update the existing Apps Script deployment so the live `/exec` endpoint runs the new code:

1. Save the updated `Code.gs` in Apps Script.
2. Choose **Deploy > Manage deployments**.
3. Select the active web app deployment and click **Edit** (pencil icon).
4. For **Version**, choose **New version**, then click **Deploy**.
5. Keep using the same `/exec` URL. The next application submission adds missing headers and writes the new fields.

Google's [versioning guide](https://developers.google.com/apps-script/guides/versions) confirms that editing an existing deployment to use a new version updates its code while retaining its deployment URL.

## 6. Interviewer & Admin Portal Setup

The web application includes an **Admin & Interview Evaluation Portal** designed for interviewers to review applicants during interviews and save evaluations to a new sheet:

1. **How to open the portal**:
   - Click the **"Interviewer Portal"** button in the top-right header of the website, or navigate directly to `/#admin` (e.g. `http://localhost:5173/#admin` or `https://your-app.vercel.app/#admin`).
2. **Features**:
   - **Real-time Search**: Search candidates instantly by name, roll number, email, branch, or wing.
   - **Filters**: Filter by Domain (Tech / Non-Tech), Wing (Web, Mobile, AI/ML, Cloud, etc.), and Review Status (All / Pending / Reviewed).
   - **Application Inspection**: Click any candidate to review their full profile: Why GDG, Why Wing, Experience level, Projects & descriptions, contact details (with quick mail/call/WhatsApp links).
   - **Evaluation & Scoring Form**:
     - Reviewer Name (automatically remembered in your browser).
     - Attendance Status (`Attended`, `Absent`, `Rescheduled`).
     - Ratings from 1 to 5 for:
       - Technical Knowledge & Problem Solving
       - Communication & Articulation
       - Passion & Community Fit
       - Cumulative average score calculation.
     - Final Recommendation (`Selected`, `Shortlisted`, `Waitlisted`, `Rejected`).
     - Detailed Interview Notes & Feedback.
   - **Save to New Sheet**:
     - Clicking **"Save Review to New Sheet"** submits the evaluation to Google Sheets, where it is automatically appended to the **`Reviewed_Candidates`** sheet!
     - The candidate is immediately marked with a green checkmark and their decision badge in the directory.
   - **CSV Export**: Click **"Export CSV"** in the top bar to download all applicant reviews locally.

### Updating Apps Script to enable live sheet sync:

1. In your Google Sheet, open **Extensions > Apps Script**.
2. Replace `Code.gs` with the updated code in [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Click **Deploy > Manage deployments > Edit (pencil icon)**.
4. Set **Version** to **New version**, and click **Deploy**.
5. The `Reviewed_Candidates` sheet will automatically be created with formatted headers (`Reviewed At`, `Reviewer Name`, `Attendance Status`, `Final Decision`, `Ratings`, `Interview Notes`, `Candidate Profile`, etc.) the first time a review is saved!

## Data and access notes

- The Apps Script creates an `Applications` tab and appends one application per row. It validates required fields, email, phone, and response lengths server-side.
- The Apps Script creates a `Reviewed_Candidates` tab and stores interview scores, recommendations, and feedback per candidate.
- The Sheet stays private to its collaborators. The `/exec` URL is a public submission endpoint because applicants must be able to submit without logging in; do not treat it as a password or use it to read Sheet data.
- Never put Google passwords, service-account credentials, or other private keys in the frontend or in a `VITE_` variable.
- If `VITE_GOOGLE_SHEETS_WEB_APP_URL` is unset, the site uses localStorage and labels the result as a local preview. Those submissions do not go to Google Sheets.

## Download applications as an Excel workbook

Applications are stored in the private Google Sheet and new rows appear there as applicants submit. To create an Excel copy, open the Sheet and choose **File > Download > Microsoft Excel (.xlsx)**. This downloads a snapshot; later submissions continue to appear in Google Sheets, so download again when you need an updated Excel file. Keep the downloaded workbook private because it contains applicant personal information.

