# Google Sheets Integration Setup

## Overview
Email subscriptions dari "Notify Me" modal akan dikirim ke Google Sheets menggunakan Google Apps Script.

## Setup Steps

### 1. Create Google Sheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "Inxora Studio - Email Subscribers"

### 2. Setup Apps Script
1. Di Google Sheet, klik **Extensions > Apps Script**
2. Hapus kode default dan paste kode berikut:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add header if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email', 'Status']);
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4A5568');
      headerRange.setFontColor('#FFFFFF');
    }
    
    // Check if email already exists
    const emailColumn = sheet.getRange(2, 2, Math.max(1, sheet.getLastRow() - 1), 1).getValues();
    const emailExists = emailColumn.some(row => row[0] === data.email);
    
    if (emailExists) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'This email is already subscribed'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add new subscription
    const timestamp = new Date();
    sheet.appendRow([timestamp, data.email, 'Subscribed']);
    
    // Format new row
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Successfully subscribed!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function doGet() {
  return ContentService.createTextOutput('Google Sheets API is running!');
}
```

3. Klik **Save** (ikon disk atau Ctrl+S)
4. Beri nama project: "Inxora Email Subscription API"

### 3. Deploy Web App
1. Klik **Deploy > New deployment**
2. Klik ikon **gear** di sebelah "Select type"
3. Pilih **Web app**
4. Setting deploy:
   - **Description**: "Inxora Email API"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Klik **Deploy**
6. Authorize aplikasi jika diminta
7. **Copy Web App URL** yang muncul (format: `https://script.google.com/macros/s/...`)

### 4. Add to Environment Variables
1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` dan tambahkan URL:
   ```bash
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

## Testing

### Test dari Browser
```bash
# GET request (test if API is running)
curl https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# POST request (test email submission)
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test dari Website
1. Klik tombol "Notify Me"
2. Masukkan email
3. Klik "Notify Me"
4. Check Google Sheet - email baru harus muncul

## Troubleshooting

### Error: "Authorization required"
- Pastikan "Who has access" di-set ke **Anyone**
- Re-deploy jika perlu

### Error: "Script function not found"
- Pastikan function name adalah `doPost` (case-sensitive)
- Save script dan re-deploy

### Email tidak masuk ke Sheet
1. Check browser console untuk error
2. Pastikan `VITE_GOOGLE_SHEETS_URL` sudah benar di `.env`
3. Test URL dengan curl command di atas
4. Pastikan script sudah di-deploy sebagai Web App

### Duplicate Emails
Script otomatis check duplikat. Jika email sudah ada, akan muncul error message.

## Google Sheet Structure

Sheet akan memiliki struktur:

| Timestamp | Email | Status |
|-----------|-------|--------|
| 2025-01-01 12:00:00 | user@example.com | Subscribed |
| 2025-01-02 14:30:15 | another@example.com | Subscribed |

## Notes
- Mode `no-cors` digunakan untuk bypass CORS restrictions
- Backup ke localStorage tetap aktif sebagai fallback
- Timestamp menggunakan timezone server (Google Apps Script)
- Sheet akan auto-create header row jika kosong

## Security
- URL Google Apps Script bersifat public tapi unique
- Tidak ada sensitive data yang dikirim
- Rate limiting handled by Google
- Consider adding reCAPTCHA untuk production use
