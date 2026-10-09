import { GOOGLE_CLIENT_ID } from '../constants';

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
  hd?: string;
  authProvider: 'google';
}

const STORAGE_KEY = 'azhar_google_user';

/**
 * Safely decodes a Google JWT Credential without external dependencies
 */
export function decodeGoogleJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed.sub || `google-${Date.now()}`,
      name: parsed.name || parsed.email?.split('@')[0] || 'مسؤول معهد المنشاوي',
      email: parsed.email || '',
      picture: parsed.picture,
      givenName: parsed.given_name,
      familyName: parsed.family_name,
      hd: parsed.hd,
      authProvider: 'google',
    };
  } catch (e) {
    console.error('Failed to decode Google JWT:', e);
    return null;
  }
}

/**
 * Retrieves cached Google user from storage
 */
export function getStoredGoogleUser(): GoogleUserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Saves or removes cached Google user
 */
export function setStoredGoogleUser(user: GoogleUserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem('admin_session', 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('admin_session');
    }
  } catch (e) {
    console.error('Failed to update storage for Google user', e);
  }
}

/**
 * Clears current Google session
 */
export function logoutGoogle() {
  setStoredGoogleUser(null);
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
    (window as any).google.accounts.id.disableAutoSelect();
  }
}

/**
 * Initialize Google Identity Services (One Tap & Button)
 */
export function initGoogleIdentityServices(
  onSuccess: (user: GoogleUserProfile) => void,
  onError?: (error: any) => void
) {
  if (typeof window === 'undefined') return;

  const checkSdk = setInterval(() => {
    const google = (window as any).google;
    if (google?.accounts?.id) {
      clearInterval(checkSdk);
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response?.credential) {
              const profile = decodeGoogleJwt(response.credential);
              if (profile) {
                setStoredGoogleUser(profile);
                onSuccess(profile);
              } else {
                onError?.(new Error('فشل فك تشفير بيانات حساب جوجل'));
              }
            } else {
              onError?.(new Error('لم يتم استلام تصريح الدخول من جوجل'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.warn('Google Identity initialization error:', err);
        onError?.(err);
      }
    }
  }, 200);

  // Stop checking after 8 seconds
  setTimeout(() => clearInterval(checkSdk), 8000);
}

/**
 * Render official Google Sign-In Button inside a DOM element
 */
export function renderGoogleSignInButton(
  element: HTMLElement,
  options: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with';
    shape?: 'rectangular' | 'pill' | 'circle';
    width?: number;
  } = {}
) {
  const google = (window as any).google;
  if (!google?.accounts?.id || !element) return false;

  try {
    element.innerHTML = '';
    google.accounts.id.renderButton(element, {
      theme: options.theme || 'outline',
      size: options.size || 'large',
      text: options.text || 'continue_with',
      shape: options.shape || 'rectangular',
      width: options.width || 320,
      logo_alignment: 'left',
      locale: 'ar',
    });
    return true;
  } catch (e) {
    console.error('Failed to render Google Sign-In button', e);
    return false;
  }
}

/**
 * Fast Google OAuth token client popup flow
 */
export async function triggerGoogleOAuthPopup(
  onSuccess: (user: GoogleUserProfile) => void,
  onError: (error: string) => void
) {
  const google = (window as any).google;
  
  // Method 1: Using Google GIS oauth2 token client if available
  if (google?.accounts?.oauth2?.initTokenClient) {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            try {
              // Fetch user profile from Google UserInfo API
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });
              if (res.ok) {
                const info = await res.json();
                const user: GoogleUserProfile = {
                  id: info.sub || `google-${Date.now()}`,
                  name: info.name || info.email?.split('@')[0] || 'مسؤول معهد المنشاوي',
                  email: info.email || '',
                  picture: info.picture,
                  givenName: info.given_name,
                  familyName: info.family_name,
                  hd: info.hd,
                  authProvider: 'google',
                };
                setStoredGoogleUser(user);
                onSuccess(user);
                return;
              }
            } catch (fetchErr: any) {
              console.error('Failed fetching user info:', fetchErr);
            }
          }
          if (tokenResponse?.error) {
            onError(tokenResponse.error_description || tokenResponse.error || 'تعذر تسجيل الدخول عبر Google');
          }
        },
        error_callback: (err: any) => {
          onError(err.message || 'حدث خطأ في نافذة مصادقة جوجل');
        }
      });
      client.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (e: any) {
      console.warn('initTokenClient failed, falling back:', e);
    }
  }

  // Method 2: GIS One-tap prompt
  if (google?.accounts?.id?.prompt) {
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        onError('يرجى التأكد من إضافة رابط الموقع الحالي إلى Authorized JavaScript origins في Google Cloud Console');
      }
    });
    return;
  }

  onError('جاري تحميل مكتبة جوجل، يرجى المحاولة بعد قليل أو التأكد من اتصال الإنترنت');
}
