import { Button, ButtonGroup, Center, Text } from '@chakra-ui/react'
import React from 'react'

export type PaginationProps = Readonly<{
  // first page is 1
  current: number
  total: number
  onPageChange(page: number): void
}>

export const Pagination = ({
  current,
  total,
  onPageChange,
}: PaginationProps) => (
  <ButtonGroup alignContent="flex-end">
    <Center>
      <Text>
        ({current} of {total})
      </Text>
    </Center>
    <Button disabled={current <= 1} onClick={() => onPageChange(1)}>
      First
    </Button>
    <Button
      disabled={current <= 1}
      onClick={() => onPageChange(Math.max(current - 1, 0))}
    >
      Previous
    </Button>
    <Button
      disabled={current >= total}
      onClick={() => onPageChange(Math.min(current + 1, total))}
    >
      Next
    </Button>
    <Button disabled={current >= total} onClick={() => onPageChange(total)}>
      Last
    </Button>
  </ButtonGroup>
)
