const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
let cachedChatId = process.env.TELEGRAM_CHAT_ID || '';

export function setCachedChatId(chatId: string) {
  cachedChatId = chatId;
}

export function getCachedChatId(): string {
  return cachedChatId;
}

export async function sendTelegramMessage(text: string, chatId?: string): Promise<boolean> {
  const token = TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId || cachedChatId;

  if (!token) {
    console.warn('[Telegram] No bot token configured.');
    return false;
  }

  if (!targetChatId) {
    console.warn('[Telegram] No chat_id configured yet. User needs to send /start to @tradingjul_bot');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error('[Telegram] Error sending message:', err);
    return false;
  }
}

export async function fetchLatestChatId(): Promise<string | null> {
  const token = TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  try {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      const lastUpdate = data.result[data.result.length - 1];
      const chatId = String(
        lastUpdate.message?.chat?.id ||
        lastUpdate.channel_post?.chat?.id ||
        lastUpdate.my_chat_member?.chat?.id ||
        ''
      );
      if (chatId) {
        cachedChatId = chatId;
        return chatId;
      }
    }
  } catch (err) {
    console.error('[Telegram] Error fetching updates:', err);
  }
  return null;
}
