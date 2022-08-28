import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React from 'react'
import { Filter } from '../../todo'

export type FilterViewProps = Readonly<{
  filter: Filter
  onFilterChange(filter: Filter): void
}>

export const FilterView = ({ filter, onFilterChange }: FilterViewProps) => (
  <RadioGroup onChange={onFilterChange} value={filter} p="2">
    <Stack direction="row">
      <Radio value="All">All</Radio>
      <Radio value="Completed">Completed</Radio>
      <Radio value="Incomplete">Incomplete</Radio>
    </Stack>
  </RadioGroup>
)
