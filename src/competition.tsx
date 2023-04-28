import { Fragment, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { Loader } from './_components/loader'
import { CompetitionInfo, loadClasses, loadCompetition } from './api'
import { signal, useSignal, useSignalEffect } from '@preact/signals'
import {
  RemoteData,
  failure,
  fold,
  initial,
  pending,
  success,
} from '@devexperts/remote-data-ts'
import './competitions.css'
import Router, { Link } from 'preact-router'

type CompetitionOverview = {
  name: string
  organizer: string
  date: Date
  classes: Array<string>
}
export function Competition({ eventId }: any & { eventId: string }) {
  const info = useSignal<RemoteData<string, CompetitionOverview>>(initial)
  useSignalEffect(() => {
    console.log(info.value)
  })

  useEffect(() => {
    ;(async () => {
      info.value = pending
      try {
        const competition = await loadCompetition(eventId)
        const classes = await loadClasses(eventId)
        info.value = success({
          name: competition.name,
          organizer: competition.organizer,
          date: competition.date,
          classes: classes.classes.map((entry) => entry.className),
        })
      } catch (error) {
        info.value = failure(`${error}`)
      }
    })()
  }, [])

  return (
    <Fragment>
      <div>
        <Router>
          <p path="/event/:eventId">Event Overview</p>
          <p path="/event/:eventId/class/:classId">Class Results</p>
        </Router>
      </div>
      {fold<string, CompetitionOverview, any>(
        () => <Loader />,
        () => <Loader />,
        (err) => <p>{JSON.stringify(err)}</p>,
        (data) => (
          <Fragment>
            <div>{data.name}</div>
            <div>{data.organizer}</div>
            <div>{data.date.toLocaleDateString()}</div>
            <ul>
              {data.classes.map((name) => (
                <li key={name}>
                  <Link
                    class="fh"
                    href={`/event/${eventId}/class/${encodeURIComponent(name)}`}
                  >
                    <div class="fm">{name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </Fragment>
        )
      )(info.value)}

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
