# Deploy GDGoC SVEC Hiring and collect applications

This project is a Vite static website. **Vercel is the recommended host** for the quickest GitHub-connected deployment. Render also works; setup for both is below.

## 1. Create the Google Sheet receiver

1. Create a Google Sheet, for example **GDGoC SVEC 4.O Applications**. Keep its sharing permissions restricted to the hiring team.
2. Open the Sheet and choose **Extensions > Apps Script**. This attaches the script to that Sheet. If you already created a standalone project from the Apps Script home page, you can keep it; use the spreadsheet ID setup below.
3. Open [`google-apps-script/Code.gs`](google-apps-script/Code.gs) in this project, copy its full contents into the Apps Script editor, and save.
4. For a standalone Apps Script project, open **Project Settings** (gear icon) > **Script Properties** > **Add script property**. Set the property name to `SPREADSHEET_ID`. Its value is the ID in the Sheet URL between `/d/` and `/edit`. Example: `https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit` → ID is `1AbC...XyZ`. Save the property. Do not put this ID in the website's `.env` file.
5. In Apps Script, choose **Deploy > New deployment**. Select **Web app** as the deployment type.
6. Set **Execute as** to your Google account. Set access to **Anyone** so applicants can submit without signing in. The web app runs as you and writes to the Sheet; applicants do not get access to read the Sheet.
7. Choose **Deploy**, complete Google's authorization prompt, then copy the deployed URL ending in `/exec`.

Google's [Apps Script web app guide](https://developers.google.com/apps-script/guides/web) describes web app deployment and execution identity.

## 2. Test locally first (optional)

From the project folder, create `.env.local` by copying `.env.example`. Put your deployed URL on the right side of this line:

```text
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then run:

```powershell
npm install
npm run dev
```

Submit one clearly marked test application. The script creates an `Applications` tab with headers when the first response arrives. Confirm the row appears in the Sheet before sharing the public site. The Apps Script **Executions** page should show a `doPost` execution; expand it and check **Cloud logs** for `Application row appended to Applications.` A `Completed` execution alone only means the handler returned; an error caught by the script can also appear as completed, so check the log and Sheet row.

## 3. Publish on Vercel (recommended)

### Push this project to GitHub

Create an empty GitHub repository, then run these commands from the project folder. Replace `YOUR_GITHUB_USERNAME` with your account name:

```powershell
git init
git add .
git commit -m "Initial GDGoC SVEC hiring site"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/gdgoc-svec-hiring.git
git push -u origin main
```

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

## Data and access notes

- The Apps Script creates an `Applications` tab and appends one application per row. It validates required fields, email, phone, and response lengths server-side.
- The Sheet stays private to its collaborators. The `/exec` URL is a public submission endpoint because applicants must be able to submit without logging in; do not treat it as a password or use it to read Sheet data.
- Never put Google passwords, service-account credentials, or other private keys in the frontend or in a `VITE_` variable.
- If `VITE_GOOGLE_SHEETS_WEB_APP_URL` is unset, the site uses localStorage and labels the result as a local preview. Those submissions do not go to Google Sheets.

## Download applications as an Excel workbook

Applications are stored in the private Google Sheet and new rows appear there as applicants submit. To create an Excel copy, open the Sheet and choose **File > Download > Microsoft Excel (.xlsx)**. This downloads a snapshot; later submissions continue to appear in Google Sheets, so download again when you need an updated Excel file. Keep the downloaded workbook private because it contains applicant personal information.
