import { Fragment, h } from 'preact'
import { Loader } from './_components/loader'
import { loadClasses, loadCompetition } from './api'
import './competitions.css'
import { Link, useParams } from 'react-router-dom'

import { QueryClient, useQuery } from '@tanstack/react-query'

const competitionQuery = (eventId: string) => ({
  queryKey: ['competitions', eventId],
  queryFn: async () => {
    const competition = await loadCompetition(eventId)
    const classes = await loadClasses(eventId)
    return {
      name: competition.name,
      organizer: competition.organizer,
      date: competition.date,
      classes: classes.classes.map((entry) => entry.className),
    }
  },
})

export const loader =
  (queryClient: QueryClient) =>
  ({ params }) =>
    queryClient.ensureQueryData(competitionQuery(params.eventId))

type CompetitionOverview = {
  name: string
  organizer: string
  date: Date
  classes: Array<string>
}
export function Competition({ eventId }: any & { eventId: string }) {
  const params = useParams()
  const {
    data: competition,
    isLoading,
    error,
  } = useQuery(competitionQuery(params.eventId))

  if (isLoading) return <Loader />

  if (error) return <>'An error has occurred: ' + error.message</>

  return (
    <Fragment>
      <div>{competition!.name}</div>
      <div>{competition!.organizer}</div>
      <div>{competition!.date.toLocaleDateString()}</div>
      <ul>
        {competition!.classes.map((name) => (
          <li key={name}>
            <Link
              class="fh"
              to={`/events/${params.eventId}/classes/${encodeURIComponent(
                name
              )}`}
            >
              <div class="fm">{name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
