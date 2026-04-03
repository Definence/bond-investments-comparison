import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';

export type BondWithInclusion = {
  includedInCalculation: boolean;
};

export function useBondInclusion<T extends BondWithInclusion>(
  bonds: T[],
  setBonds: Dispatch<SetStateAction<T[]>>
) {
  const toggleIncluded = useCallback((index: number) => {
    setBonds((prev) =>
      prev.map((b, i) =>
        i === index ? { ...b, includedInCalculation: !b.includedInCalculation } : b
      )
    );
  }, [setBonds]);

  const selectAllIncluded = useCallback(() => {
    setBonds((prev) => prev.map((b) => ({ ...b, includedInCalculation: true })));
  }, [setBonds]);

  const deselectAllIncluded = useCallback(() => {
    setBonds((prev) => prev.map((b) => ({ ...b, includedInCalculation: false })));
  }, [setBonds]);

  const hasAnyIncludedForCalculation = useMemo(
    () => bonds.some((b) => b.includedInCalculation),
    [bonds]
  );

  return {
    toggleIncluded,
    selectAllIncluded,
    deselectAllIncluded,
    hasAnyIncludedForCalculation,
  };
}
