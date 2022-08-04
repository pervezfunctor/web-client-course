import {
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import React from 'react'

const colors = ['red', 'green', 'blue']

export const ColorPicker = () => {
  return (
    <Flex direction="column">
      {colors.map(col => (
        <Box key={col} pt={6} pb={2}>
          <Slider
            aria-label="slider-ex-1"
            w="400px"
            defaultValue={30}
            colorScheme={col}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      ))}
    </Flex>
  )
}
