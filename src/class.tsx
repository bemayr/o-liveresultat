import { Fragment, h } from 'preact'
import { Loader } from './_components/loader'
import { loadClasses, loadClassresults, loadCompetition } from './api'
import './competitions.css'
import { Link, useParams } from 'react-router-dom'

import { QueryClient, useQuery } from '@tanstack/react-query'

const classresultsQuery = (eventId: string, className: string) => ({
  queryKey: ['competitions', eventId, className],
  queryFn: async () => {
    return await loadClassresults(eventId, className)
  },
})

export const loader =
  (queryClient: QueryClient) =>
  ({ params }) =>
    queryClient.ensureQueryData(
      classresultsQuery(params.eventId, params.className)
    )

export function Class() {
  const params = useParams()
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    ...classresultsQuery(params.eventId, params.className),
    refetchInterval: 15 * 1000,
  })

  if (isLoading) return <Loader />

  if (error) return <>'An error has occurred: ' + error.message</>

  return <div>{JSON.stringify(results, null, 2)}</div>
}
