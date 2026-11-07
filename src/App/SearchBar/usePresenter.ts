import type { ChangeEvent, SubmitEvent } from 'react'
import { showsStore } from '../../stores/ShowsStore'

export function usePresenter() {
  return {
    query: showsStore.query,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      showsStore.setQuery(event.target.value)
    },
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      showsStore.submit()
    },
  }
}
