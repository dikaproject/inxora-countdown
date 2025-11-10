/**
 * Email Subscription Service
 * 
 * Handles email subscription for launch notifications.
 * Sends data to Google Sheets via Google Apps Script Web App.
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the following code:
 * 
 * function doPost(e) {
 *   try {
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     const data = JSON.parse(e.postData.contents);
 *     
 *     // Add header if sheet is empty
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow(['Timestamp', 'Email', 'Status']);
 *     }
 *     
 *     // Check if email already exists
 *     const emailColumn = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
 *     const emailExists = emailColumn.some(row => row[0] === data.email);
 *     
 *     if (emailExists) {
 *       return ContentService.createTextOutput(JSON.stringify({
 *         success: false,
 *         message: 'This email is already subscribed'
 *       })).setMimeType(ContentService.MimeType.JSON);
 *     }
 *     
 *     // Add new subscription
 *     sheet.appendRow([new Date(), data.email, 'Subscribed']);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({
 *       success: true,
 *       message: 'Successfully subscribed!'
 *     })).setMimeType(ContentService.MimeType.JSON);
 *     
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({
 *       success: false,
 *       message: 'Error: ' + error.toString()
 *     })).setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * 
 * 4. Deploy as Web App (Deploy > New deployment > Select type: Web app)
 * 5. Set "Execute as" to your account
 * 6. Set "Who has access" to "Anyone"
 * 7. Copy the Web App URL and paste it in GOOGLE_SHEETS_URL below
 */

interface SubscriptionResult {
  success: boolean
  message: string
}

// Replace this with your Google Apps Script Web App URL
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || ''

// Fallback to localStorage if Google Sheets URL is not configured
const STORAGE_KEY = 'inxora_email_subscribers'

/**
 * Get all subscribers from localStorage
 */
function getSubscribers(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save subscribers to localStorage
 */
function saveSubscribers(emails: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails))
  } catch (error) {
    console.error('Failed to save subscribers:', error)
  }
}

/**
 * Check if email is valid format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Subscribe an email for launch notifications
 * 
 * @param email - The email address to subscribe
 * @returns Promise with subscription result
 */
export async function subscribeEmail(email: string): Promise<SubscriptionResult> {
  // Validate email format
  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    }
  }

  // Normalize email (lowercase, trim)
  const normalizedEmail = email.toLowerCase().trim()

  // If Google Sheets URL is configured, send to Google Sheets
  if (GOOGLE_SHEETS_URL) {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: normalizedEmail,
          timestamp: new Date().toISOString()
        }),
      })

      // Note: no-cors mode doesn't allow reading the response
      // We assume success if no error is thrown
      // Also save to localStorage as backup
      const subscribers = getSubscribers()
      if (!subscribers.includes(normalizedEmail)) {
        subscribers.push(normalizedEmail)
        saveSubscribers(subscribers)
      }

      return {
        success: true,
        message: 'Successfully subscribed!',
      }
    } catch (error) {
      console.error('Google Sheets submission error:', error)
      // Fall through to localStorage-only method
    }
  }

  // Fallback: Use localStorage only
  try {
    // Get existing subscribers
    const subscribers = getSubscribers()

    // Check if already subscribed
    if (subscribers.includes(normalizedEmail)) {
      return {
        success: false,
        message: 'This email is already subscribed',
      }
    }

    subscribers.push(normalizedEmail)
    saveSubscribers(subscribers)

    return {
      success: true,
      message: 'Successfully subscribed!',
    }
  } catch (error) {
    console.error('Subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}

/**
 * Get total number of subscribers
 */
export function getSubscriberCount(): number {
  return getSubscribers().length
}

/**
 * Check if an email is subscribed
 */
export function isSubscribed(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim()
  return getSubscribers().includes(normalizedEmail)
}

/**
 * Example function to send to backend API
 * Uncomment and implement when you have a backend
 */
/*
async function sendToBackend(email: string): Promise<void> {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('Failed to subscribe via API')
  }
}
*/
