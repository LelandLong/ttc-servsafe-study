# One-Time Convex Deployment (Leland Only)

The professor and admins will NEVER need to do this. This is a one-time setup you (Leland) do, and then the app is ready forever.

## What You Need
- Node.js installed on your computer (download from https://nodejs.org if needed)
- You're already logged into Convex (you have the project URL)

## One-Time Setup (5 minutes)

### Step 1: Open Terminal
Open a terminal/command prompt in the ServSafePWA folder.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Deploy to Convex
```bash
npx convex deploy
```

You may be asked to log in to Convex - use the same account where you created the `good-alpaca-167` project.

### Step 4: Seed the Database
After deploying, open the admin page in your browser. It will detect an empty database and offer to upload the 93 questions. Click "Yes".

### That's It!
The app is now connected to your Convex cloud database. The URL is already configured in the code:
- `https://good-alpaca-167.convex.cloud`

---

## After Setup

### For Professor/Admins
- Just go to the admin URL (e.g., `https://yoursite.github.io/ServSafePWA/admin.html`)
- Edit questions, add new ones, delete old ones
- All changes sync automatically to the cloud
- No technical knowledge needed

### For Students
- Questions are automatically loaded from the cloud
- Any changes the professor makes appear on next page refresh
- Works offline too (uses cached data)

### Network Indicator
Both the study app and admin page show a small banner at the top:
- 🟢 **"Live Cloud Data"** = Connected to Convex, using live data
- 🟡 **"Connecting..."** = Loading from cloud
- ⚫ **"Offline Mode"** = Using locally cached data (still works!)

---

## Troubleshooting

If deployment fails:
1. Make sure you're in the ServSafePWA folder
2. Try `npx convex login` to re-authenticate
3. Then run `npx convex deploy` again

If the admin page shows "Offline Mode":
1. Check your internet connection
2. Open browser console (F12) for error details
3. The Convex URL might need verification

---

## Convex Dashboard
View your data anytime at: https://dashboard.convex.dev

Free tier includes WAY more than this app will ever need.
