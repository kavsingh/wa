import { Action } from 'redux'

export interface GAudioNode<PROPS = {}> {
  id: string
  color: string
  label: string
  props: PROPS
  type: string
}

export interface ActionWithPayload<TYPE, PAYLOAD> extends Action<TYPE> {
  payload: PAYLOAD
}
