type PerfLevel = 'info' | 'warn' | 'error';

function shouldLog() {
  return process.env.NODE_ENV !== 'production';
}

export function perfLog(scope: string, event: string, payload?: Record<string, unknown>, level: PerfLevel = 'info') {
  if (!shouldLog()) {
    return;
  }

  const timestamp = new Date().toISOString();
  const message = `[perf][${scope}] ${event}`;
  const data = payload ?? {};

  if (level === 'error') {
    console.error(message, { timestamp, ...data });
    return;
  }

  if (level === 'warn') {
    console.warn(message, { timestamp, ...data });
    return;
  }

  console.info(message, { timestamp, ...data });
}
