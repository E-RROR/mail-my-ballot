import React from 'react'
import { render, fireEvent, waitForElement, act } from '@testing-library/react'
import { InitialForm } from './InitialForm'
import { StateContainer } from '../App'
import { osmGeocode } from '../lib/osm'
import { client } from '../lib/trpc'
import { mocked } from 'ts-jest/utils'
import { sampleAddress } from '../common/testData'
jest.mock('../lib/osm')
jest.mock('../lib/trpc')

test('InitialForm works', async () => {
  const { getByLabelText, getByTestId } = render(
    <InitialForm/>,
    { wrapper: StateContainer }
  )

  const mockedOsmGeocode = mocked(osmGeocode)
  mockedOsmGeocode.mockResolvedValue(sampleAddress)

  const addLocale = mocked(client, true).addLocale = jest.fn().mockResolvedValue({
    type: 'data',
    data: 'xxx',
  })

  act(() => {
    fireEvent.change(getByLabelText(/^Address/i), {
      target: {
        value: '100 S Biscayne Blvd, Miami, FL 33131'
      },
    })
    fireEvent.click(getByTestId('initialform-submit'), {
        bubbles: true,
        cancelable: true,
    })
  })

  await waitForElement(() => getByTestId('status-title'))

  expect(mockedOsmGeocode).toHaveBeenCalled()
  expect(addLocale).toHaveBeenCalled()
  expect(getByTestId('status-title')).toHaveTextContent('Great News!')
  expect(getByTestId('status-detail')).toHaveTextContent(sampleAddress.state)
  expect(getByTestId('status-detail')).toHaveTextContent(sampleAddress.county)
})
