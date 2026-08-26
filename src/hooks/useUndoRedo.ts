import { useState, useCallback, useRef } from 'react';

export interface UndoRedoOptions<T> {
  maxHistory?: number;
  debounceMs?: number;
}

export function useUndoRedo<T>(initialState: T, options: UndoRedoOptions<T> = {}) {
  const { maxHistory = 50, debounceMs = 400 } = options;

  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const stateRef = useRef<T>(state);
  stateRef.current = state;

  const debounceTimerRef = useRef<number | null>(null);
  const pendingSnapshotRef = useRef<T | null>(null);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Record an explicit, immediate snapshot (e.g. before clearing sheet or clicking increment)
  const pushImmediate = useCallback((newState: T | ((prev: T) => T)) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const resolved = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(stateRef.current) 
      : newState;

    const currentSnapshot = JSON.parse(JSON.stringify(stateRef.current));
    setPast(prev => [...prev.slice(-(maxHistory - 1)), currentSnapshot]);
    setFuture([]);
    setState(resolved);
  }, [maxHistory]);

  // Set state with debounced history recording (useful for continuous typing in inputs)
  const setWithDebounce = useCallback((newState: T | ((prev: T) => T)) => {
    const resolved = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(stateRef.current) 
      : newState;

    if (!pendingSnapshotRef.current) {
      pendingSnapshotRef.current = JSON.parse(JSON.stringify(stateRef.current));
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      if (pendingSnapshotRef.current) {
        setPast(prev => [...prev.slice(-(maxHistory - 1)), pendingSnapshotRef.current!]);
        setFuture([]);
        pendingSnapshotRef.current = null;
      }
    }, debounceMs);

    setState(resolved);
  }, [debounceMs, maxHistory]);

  // Direct reset without adding to history or resetting history with new base
  const resetState = useCallback((newState: T) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    pendingSnapshotRef.current = null;
    setState(newState);
    setPast([]);
    setFuture([]);
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (past.length === 0) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      pendingSnapshotRef.current = null;
    }

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    const current = JSON.parse(JSON.stringify(stateRef.current));

    setPast(newPast);
    setFuture(prev => [current, ...prev]);
    setState(previous);
  }, [past]);

  // Redo
  const redo = useCallback(() => {
    if (future.length === 0) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      pendingSnapshotRef.current = null;
    }

    const next = future[0];
    const newFuture = future.slice(1);
    const current = JSON.parse(JSON.stringify(stateRef.current));

    setPast(prev => [...prev, current]);
    setFuture(newFuture);
    setState(next);
  }, [future]);

  return {
    state,
    setState: setWithDebounce,
    setImmediate: pushImmediate,
    resetState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyDepth: past.length
  };
}
