import { Fragment, h } from 'preact'
import { Link } from 'react-router-dom'
import { Loader } from './_components/loader'
import { Competition, getCompetitions } from './api'
import { useQuery, QueryClient } from '@tanstack/react-query'
import './competitions.css'
import { signal } from '@preact/signals'

const contactDetailQuery = () => ({
  queryKey: ['competitions'],
  queryFn: async () => await getCompetitions(),
})

export const loader = (queryClient: QueryClient) => () =>
  queryClient.ensureQueryData(contactDetailQuery())

const visibleEvents = signal('today')
const setVisibleEventType = (
  event: h.JSX.TargetedEvent<HTMLInputElement, Event>
) => {
  visibleEvents.value = event.currentTarget.id
}

export function Competitions(): h.JSX.Element {
  const {
    data: competitions,
    isLoading,
    error,
  } = useQuery(contactDetailQuery())

  /* Tabs: https://codepen.io/Wendy-Ho/pen/MWWBvmd?editors=1100 */
  /* Lists: https://codepen.io/chriscoyier/pen/gOxgYxO */

  if (isLoading) return <Loader />

  if (error) return <>'An error has occurred: ' + error.message</>

  return (
    <Fragment>
      <div class="wrapper">
        <input
          class="radio"
          id="past"
          name="group"
          type="radio"
          onChange={setVisibleEventType}
          checked={visibleEvents.value === 'past'}
        />
        <input
          class="radio"
          id="today"
          name="group"
          type="radio"
          onChange={setVisibleEventType}
          checked={visibleEvents.value === 'today'}
        />
        <input
          class="radio"
          id="future"
          name="group"
          type="radio"
          onChange={setVisibleEventType}
          checked={visibleEvents.value === 'future'}
        />
        <div class="tabs">
          <label class="tab" id="past-tab" for="past">
            Past
          </label>
          <label class="tab" id="today-tab" for="today">
            Today
          </label>
          <label class="tab" id="future-tab" for="future">
            Future
          </label>
        </div>
        <div class="panels">
          <div class="panel" id="past-panel">
            <ByDate competitions={competitions!.past} />
          </div>
          <div class="panel" id="today-panel">
            <Today competitions={competitions!.today} />
          </div>
          <div class="panel" id="future-panel">
            <ByDate competitions={competitions!.future} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

type TodayProps = {
  competitions: Array<Competition>
}
function Today({ competitions }: TodayProps) {
  return (
    <ul>
      {competitions.map((competition) => (
        <li key={competition.id}>
          <Link class="fh" to={`/events/${competition.id}`}>
            {competition.name}
          </Link>
          <div class="fm">{competition.organizer}</div>
        </li>
      ))}
    </ul>
  )
}

type ByDateProps = {
  competitions: Map<number, Array<Competition>>
}
function ByDate({ competitions }: ByDateProps) {
  return (
    <ul>
      {[...competitions.entries()].slice(0, 10).map(([date, competitions]) => (
        <li key={date}>
          <p>{new Date(date).toLocaleDateString()}</p>
          <ul>
            {competitions.map((competition) => (
              <li key={competition.id}>
                <Link class="fh" to={`/events/${competition.id}`}>
                  {competition.name}
                </Link>
                <div class="fm">{competition.organizer}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
