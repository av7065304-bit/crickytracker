/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TossAlertSubscription {
  enabled: boolean;
  option: 'all' | 'specific';
  subscribedTeams: string[]; // Team shortnames or ids, e.g. ['IND', 'AUS']
}

const STORAGE_KEY = 'cricedge_toss_subscription_v1';

export const DEFAULT_SUBSCRIPTION: TossAlertSubscription = {
  enabled: true,
  option: 'all',
  subscribedTeams: ['IND', 'AUS', 'ENG', 'PAK']
};

export function getTossSubscription(): TossAlertSubscription {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        enabled: parsed.enabled ?? true,
        option: parsed.option ?? 'all',
        subscribedTeams: parsed.subscribedTeams ?? ['IND', 'AUS', 'ENG', 'PAK']
      };
    }
  } catch (e) {
    console.error('Failed to read toss subscription config', e);
  }
  return { ...DEFAULT_SUBSCRIPTION };
}

export function saveTossSubscription(sub: TossAlertSubscription) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    // Dispatch storage event or custom event for immediate UI updates
    window.dispatchEvent(new Event('cricedge-subscription-change'));
  } catch (e) {
    console.error('Failed to save toss subscription config', e);
  }
}

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  teamId?: string;
  teamLogo?: string;
  type: 'toss' | 'general';
  timestamp: string;
}

/**
 * Triggers a real Web Notification if allowed, and dispatches a custom event
 * for a beautifully crafted in-app push notification banner.
 */
export function triggerTossAlert(teamId: string, teamName: string, teamLogo: string, decision: string) {
  const sub = getTossSubscription();
  
  if (!sub.enabled) {
    console.log('Toss alerts are disabled globally');
    return;
  }

  // Check if subscribed to this specific team
  if (sub.option === 'specific' && !sub.subscribedTeams.includes(teamId)) {
    console.log(`User is not subscribed to toss alerts for ${teamName} (${teamId})`);
    return;
  }

  const title = `🚨 CricEdge Toss Alert: ${teamLogo} ${teamName}`;
  const body = `${teamName} won the toss and decided to ${decision || 'Bowl first'}! Deep analysis is now active.`;
  
  // 1. HTML5 Web Notification API
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: '/cricedge-logo.png', // Fallback or placeholder
        });
      } catch (e) {
        console.warn('Standard Web Notification failed, continuing with custom overlay', e);
      }
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // 2. Custom in-app event trigger
  const event = new CustomEvent('cricedge-in-app-push', {
    detail: {
      id: Math.random().toString(36).substring(2, 9),
      title,
      body,
      teamId,
      teamLogo,
      type: 'toss',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } as InAppNotification
  });
  window.dispatchEvent(event);
}
