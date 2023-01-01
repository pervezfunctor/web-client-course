import { useMemo } from 'react'
import { useAtom } from 'jotai'
import type { PrimitiveAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'

export const useAtomSlice = <Item>(arrAtom: PrimitiveAtom<Item[]>) => {
  const [atoms, remove] = useAtom(useMemo(() => splitAtom(arrAtom), [arrAtom]))
  return useMemo(
    () => atoms.map(itemAtom => [itemAtom, () => remove(itemAtom)] as const),
    [atoms, remove],
  )
}
