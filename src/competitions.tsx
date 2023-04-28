import { Fragment, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { Link } from 'preact-router/match'
import { Loader } from './_components/loader'
import {
  competitions,
  loadCompetitions,
  Competition,
  Competitions as CompetitionsType,
} from './api'
import { useSignalEffect } from '@preact/signals'
import { fold } from '@devexperts/remote-data-ts'
import './competitions.css'

export function Competitions(props: any & { path: string }) {
  useSignalEffect(() => {
    console.log(competitions.value)
  })

  // incoroparet all of those:
  // https://tkdodo.eu/blog/react-query-meets-react-router
  // https://reactrouter.com/en/main/start/overview#skeleton-ui-with-suspense
  // https://tanstack.com/

  useEffect(() => {
    ;(async () => await loadCompetitions())()
  }, [])

  return (
    <Fragment>
      <h1>Events</h1>

      {/* Tabs: https://codepen.io/Wendy-Ho/pen/MWWBvmd?editors=1100 */}
      {/* Lists: https://codepen.io/chriscoyier/pen/gOxgYxO */}

      {fold<string, CompetitionsType, any>(
        () => <Loader />,
        () => <Loader />,
        (err) => <p>{JSON.stringify(err)}</p>,
        (data) => (
          <Fragment>
            <div class="wrapper">
              <input class="radio" id="past" name="group" type="radio" />
              <input
                class="radio"
                id="today"
                name="group"
                type="radio"
                checked
              />
              <input class="radio" id="future" name="group" type="radio" />
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
                  <ByDate competitions={data.past} />
                </div>
                <div class="panel" id="today-panel">
                  <Today competitions={data.today} />
                </div>
                <div class="panel" id="future-panel">
                  <ByDate competitions={data.future} />
                </div>
              </div>
            </div>
          </Fragment>
        )
      )(competitions.value)}

      {/* <ul>
        {competitions.value.foldL?.today &&
          competitions.today.map((competition) => (
            <li key={competition.id}>
              <Link class="fh" href={'/event/' + competition.id}>
                {competition.name}
              </Link>
              <div class="fm">{competition.organizer}</div>
              <div class="fl">{competition.date.toLocaleDateString()}</div>
            </li>
          ))}
      </ul> */}
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
          <Link class="fh" href={'/event/' + competition.id}>
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
                <Link class="fh" href={'/event/' + competition.id}>
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
