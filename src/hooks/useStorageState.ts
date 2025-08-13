/* eslint-disable react-hooks/exhaustive-deps */
import { del, get, save } from "@/shared/utils/secureStore";
import { useCallback, useEffect, useReducer } from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      _state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    get(key).then((value) => {
      setState(value);
    });
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      if (value === null) {
        del(key);
      } else {
        save(key, value);
      }
    },
    [key]
  );

  return [state, setValue];
}
