import { useCallback, useEffect, useRef, useState } from 'react';

type UnknownRecord = Record<string, unknown>;

const sharedFetchCache = new Map<string, Promise<UnknownRecord>>();

function fetchShared(endpoint: string, cacheKey: string): Promise<UnknownRecord> {
  const key = `${endpoint}::${cacheKey}`;
  let promise = sharedFetchCache.get(key);
  if (!promise) {
    promise = fetch(endpoint)
      .then((response) => response.json() as Promise<UnknownRecord>)
      .catch(() => {
        sharedFetchCache.delete(key);
        return {};
      });
    sharedFetchCache.set(key, promise);
  }
  return promise;
}

export interface UseSyncedPreferenceOptions<T> {
  field: string;
  get: () => T;
  set: (value: T) => void;
  toPayload: (value: T) => unknown;
  fromPayload: (raw: unknown) => T;
  endpoint: string;
  enabled: boolean;
  cacheKey?: string;
  method?: 'PUT' | 'POST';
  onSaved?: (response: UnknownRecord) => void;
}

export interface UseSyncedPreferenceResult<T> {
  value: T;
  updateValue: (next: T) => void;
}

export function useSyncedPreference<T>({
  field,
  get,
  set,
  toPayload,
  fromPayload,
  endpoint,
  enabled,
  cacheKey = '',
  method = 'PUT',
  onSaved,
}: UseSyncedPreferenceOptions<T>): UseSyncedPreferenceResult<T> {
  const [value, setValueState] = useState<T>(() => get());
  const appliedLocalChangeRef = useRef(false);
  const latestRef = useRef({ field, set, toPayload, endpoint, enabled, method, onSaved });
  latestRef.current = { field, set, toPayload, endpoint, enabled, method, onSaved };

  useEffect(() => {
    appliedLocalChangeRef.current = false;
    if (!enabled) return;
    let cancelled = false;
    fetchShared(endpoint, cacheKey).then((response) => {
      if (cancelled || appliedLocalChangeRef.current) return;
      const raw = response[field];
      if (raw === null || raw === undefined) return;
      const next = fromPayload(raw);
      set(next);
      setValueState(next);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, endpoint, cacheKey, field]);

  const updateValue = useCallback((next: T) => {
    const { field, set, toPayload, endpoint, enabled, method, onSaved } = latestRef.current;
    appliedLocalChangeRef.current = true;
    set(next);
    setValueState(next);
    if (!enabled) return;
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: toPayload(next) }),
    })
      .then((response) => response.json() as Promise<UnknownRecord>)
      .then((data) => onSaved?.(data))
      .catch(() => {});
  }, []);

  return { value, updateValue };
}
