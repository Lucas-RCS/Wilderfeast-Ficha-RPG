import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutosaveEntityOptions<T> {
  /** Valor inicial (já carregado do storage) da entidade editada na ficha. */
  initial: T;
  /** Função de persistência (ex.: `saveFeral`, `saveCreature`). */
  save: (entity: T) => T;
  /** Tempo de inatividade antes de persistir, em ms. */
  delayMs?: number;
  /** Quantos pontos de restauração o "Desfazer" guarda. */
  historyLimit?: number;
}

interface UseAutosaveEntityResult<T> {
  /** Estado atual da entidade, já refletindo edições não salvas. */
  entity: T;
  /** Aplica um patch parcial, agenda o salvamento e cria um ponto de desfazer. */
  update: (patch: Partial<T>) => void;
  /** Substitui a entidade inteira (ex.: ao adicionar um item a uma lista). */
  replace: (next: T) => void;
  /** Restaura o estado anterior ao último lote de edições e salva imediatamente. */
  undo: () => void;
  /** Se existe algum ponto de restauração disponível. */
  canUndo: boolean;
  /** Quando a última gravação bem-sucedida ocorreu. */
  lastSavedAt: Date | null;
  /** Se há uma gravação agendada aguardando o fim da digitação. */
  isPending: boolean;
}

/**
 * Mantém uma entidade em estado local, mas grava automaticamente no storage
 * após uma pausa nas edições (debounce). Cada "lote" de edições consecutivas
 * (sem pausa) gera um único ponto de desfazer, evitando um histórico
 * poluído por cada tecla digitada.
 */
export function useAutosaveEntity<T>({
  initial,
  save,
  delayMs = 700,
  historyLimit = 20,
}: UseAutosaveEntityOptions<T>): UseAutosaveEntityResult<T> {
  const [entity, setEntity] = useState<T>(initial);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [, forceRender] = useState(0);

  const historyRef = useRef<T[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef(save);
  saveRef.current = save;
  const entityRef = useRef(entity);
  entityRef.current = entity;

  const persist = useCallback((value: T) => {
    const saved = saveRef.current(value);
    setEntity(saved);
    setLastSavedAt(new Date());
    setIsPending(false);
  }, []);

  const flush = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      persist(value);
    },
    [persist],
  );

  const update = useCallback(
    (patch: Partial<T>) => {
      setEntity((current) => {
        const next = { ...current, ...patch };

        if (timeoutRef.current === null) {
          // Início de um novo lote de edições: guarda o estado anterior.
          historyRef.current = [current, ...historyRef.current].slice(
            0,
            historyLimit,
          );
          forceRender((v) => v + 1);
        } else {
          clearTimeout(timeoutRef.current);
        }

        setIsPending(true);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          persist(next);
        }, delayMs);

        return next;
      });
    },
    [delayMs, historyLimit, persist],
  );

  const replace = useCallback(
    (next: T) => {
      setEntity((current) => {
        historyRef.current = [current, ...historyRef.current].slice(
          0,
          historyLimit,
        );
        forceRender((v) => v + 1);
        flush(next);
        return next;
      });
    },
    [flush, historyLimit],
  );

  const undo = useCallback(() => {
    const [previous, ...rest] = historyRef.current;
    if (!previous) return;
    historyRef.current = rest;
    forceRender((v) => v + 1);
    flush(previous);
  }, [flush]);

  // Garante que edições pendentes não se percam ao sair da tela.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        saveRef.current(entityRef.current);
      }
    };
  }, []);

  return {
    entity,
    update,
    replace,
    undo,
    canUndo: historyRef.current.length > 0,
    lastSavedAt,
    isPending,
  };
}
