import styled from 'styled-components'
import { format } from 'date-fns'

export type Trend = {
  id: string
  direction: 'UP' | 'DOWN'
  type: 'MANUAL' | 'CORRECTION'
  createdAt: Date
  updatedAt: Date
  distance?: string
}

const Wrapper = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.colors.hover};
  }

  &::before {
    content: '';
    border-left: 1px solid ${(props) => props.theme.colors.primary};
    position: absolute;
    top: 0;
    left: 1em;
    bottom: 0;
  }

  &:last-child::before {
    bottom: 100%;
  }

  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 1.5em;
`

const CreatedAt = styled.span`
  width: 11em;
  font-size: 0.8em;
`

const Correction = styled.span`
  background-color: ${(props) => props.theme.colors.warning};
  color: ${(props) => props.theme.colors.border};
  margin-left: 0.5em;
  font-size: 0.7em;
  padding: 0 0.2em;
  border-radius: 0.2em;
`

const Distance = styled.span`
  position: absolute;
  top: -0.5em;
  left: 0.5em;
  font-size: 0.7em;
  background-color: ${(props) => props.theme.colors.primary};
  padding: 0.2em;
  border-radius: 0.2em;
`

const TrendItem = ({ direction, createdAt, type, distance }: Trend) => (
  <Wrapper>
    <Distance>{distance}</Distance>

    <CreatedAt>{format(createdAt, 'eee dd LLL hh:mm a')}</CreatedAt>

    {direction === 'UP' ? 'Uptrend' : 'Downtrend'}

    {type === 'CORRECTION' && <Correction>Correction</Correction>}
  </Wrapper>
)

export default TrendItem
