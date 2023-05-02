import {
  RemoteData,
  initial,
  pending,
  success,
  failure,
} from '@devexperts/remote-data-ts'
import { Signal, signal } from '@preact/signals'

const BASE_URL = 'https://liveresultat.orientering.se/api.php?method='

const fetchLiveresult = async <TFailure, TSuccess>(
  method: string,
  signal: Signal<RemoteData<TFailure, TSuccess>>,
  transform: (json: any) => TSuccess
) => {
  signal.value = pending
  await fetch(BASE_URL + method)
    .then((response) => response.json())
    .then((data) => {
      signal.value = success(transform(data))
    })
    .catch((reason) => (signal.value = failure(reason)))
}
export const lastHash: Signal<string | undefined> = signal(undefined)

export type Competition = {
  id: number
  name: string
  organizer: string
}
export type Competitions = {
  past: Map<number, Array<Competition>>
  today: Array<Competition>
  future: Map<number, Array<Competition>>
}
export const competitions: Signal<RemoteData<string, Competitions>> =
  signal(initial)

export const loadCompetitions = () =>
  fetchLiveresult('getcompetitions', competitions, (data) => {
    const today = new Date().setHours(0, 0, 0, 0)
    const result: Competitions = {
      past: new Map<number, Array<Competition>>(),
      today: new Array<Competition>(),
      future: new Map<number, Array<Competition>>(),
    }
    for (const competition of data.competitions) {
      const date = new Date(competition.date).setHours(0, 0, 0, 0)
      if (date < today) {
        if (!result.past.has(date))
          result.past.set(date, new Array<Competition>())
        result.past.get(date)?.push(competition)
      }
      if (date === today) result.today.push(competition)
      if (date > today) {
        if (!result.future.has(date))
          result.future.set(date, new Array<Competition>())
        result.future.get(date)?.push(competition)
      }
    }
    return result
  })

export const getCompetitions = () =>
  fetch(`${BASE_URL}getcompetitions`)
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().setHours(0, 0, 0, 0)
      const result: Competitions = {
        past: new Map<number, Array<Competition>>(),
        today: new Array<Competition>(),
        future: new Map<number, Array<Competition>>(),
      }
      for (const competition of data.competitions) {
        const date = new Date(competition.date).setHours(0, 0, 0, 0)
        if (date < today) {
          if (!result.past.has(date))
            result.past.set(date, new Array<Competition>())
          result.past.get(date)?.push(competition)
        }
        if (date === today) result.today.push(competition)
        if (date > today) {
          if (!result.future.has(date))
            result.future.set(date, new Array<Competition>())
          result.future.get(date)?.push(competition)
        }
      }
      return result
    })

export type CompetitionInfo = {
  id: number
  name: string
  organizer: string
  date: Date
  timediff: number
  multidaystage: number
  multidayfirstday: number
}
export const loadCompetition = async (
  competitionId: string
): Promise<CompetitionInfo> => {
  const result = await fetch(
    BASE_URL + 'getcompetitioninfo&comp=' + competitionId
  )
    .then((response) => response.json())
    .then((data) => ({ ...data, date: new Date(data.date) }))
  return result
}

export interface Classes {
  status: string
  classes: Array<{
    className: string
  }>
  hash: string
}
export const loadClasses = async (competitionId: string): Promise<Classes> => {
  const result = await fetch(
    `${BASE_URL}getclasses&comp=${competitionId}`
  ).then((response) => response.json())
  return result
}

export interface Classresult {
  status: string
  className: string
  splitcontrols: unknown
  results: Array<Result>
  hash: string
}
export interface Result {
  place: string
  name: string
  club: string
  result: string
  status: ResultStatus
  timeplus: string
  progress: number
  start: number
}
export enum ResultStatus {
  Ok = 0,
  DidNotStart = 1,
  DidNotFinish = 2,
  MissingPunch = 3,
  Disqualified = 4,
  OverMaxTime = 5,
  NotStartedYet1 = 9,
  NotStartedYet2 = 10,
  WalkOver = 11,
  MovedUp = 12,
}
export const loadClassresults = async (
  competitionId: string,
  className: string,
  lastHash: string | undefined
): Promise<Classresult> => {
  const result = await fetch(
    `${BASE_URL}getclassresults&comp=${competitionId}&unformattedTimes=false&class=${className}&last_hash=${lastHash}`
  ).then((response) => response.json())
  return result
}
