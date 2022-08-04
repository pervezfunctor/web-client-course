import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import React from 'react'

const Rslider = () => {
  return (
    <Slider aria-label="slider-ex-1" defaultValue={30} colorScheme="red">
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}

const Gslider = () => {
  return (
    <Slider aria-label="slider-ex-2" colorScheme="green" defaultValue={30}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}

const Bslider = () => {
  return (
    <Slider aria-label="slider-ex-2" colorScheme="blue" defaultValue={30}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}

export const ColorPicker = () => {
  return (
    <>
      <Rslider />
      <Gslider />
      <Bslider />
    </>
  )
}
