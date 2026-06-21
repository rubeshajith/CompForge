// utils/debounce.ts
// @/utils/debounce.ts
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
// @/utils/throttle.ts
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
): T {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      // Fire immediately
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCall = now;
      fn(...args);
    } else {
      // Schedule trailing call so the final value always commits
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}
