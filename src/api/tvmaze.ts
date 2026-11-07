const API_URL = 'https://api.tvmaze.com/search/shows'

export interface Show {
  id: number
  name: string
  genres: string[]
  language: string | null
  premiered: string | null
  ended: string | null
  status: string | null
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  network: { name: string } | null
  webChannel: { name: string } | null
  summary: string | null
  url: string
}

interface SearchResult {
  score: number
  show: Show
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`TVmaze responded with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function searchShows(query: string, signal: AbortSignal): Promise<Show[]> {
  const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, { signal })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  const results: SearchResult[] = await response.json()
  return results.map((result) => result.show)
}
