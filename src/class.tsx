import { Fragment, h } from 'preact'
import { Loader } from './_components/loader'
import { loadClasses, loadClassresults, loadCompetition } from './api'
import './competitions.css'
import { Link, useParams } from 'react-router-dom'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

// let lastHash: undefined | string = undefined

const classresultsQuery = (
  eventId: string,
  className: string,
  queryClient: QueryClient
) => {
  const queryKey = ['competitions', eventId, className]
  return {
    queryKey,
    queryFn: async () => {
      // use the hash here: https://stackoverflow.com/a/70512446
      const lastHash = queryClient.getQueryData(queryKey)?.hash
      const result = await loadClassresults(eventId, className, lastHash)
      const hash = result.hash
      const status = result.status
      console.log({ lastHash, hash, status })
      return result
    },
  }
}

export const loader =
  (queryClient: QueryClient) =>
  ({ params }) =>
    queryClient.ensureQueryData(
      classresultsQuery(params.eventId, params.className, queryClient)
    )

export function Class() {
  const params = useParams()
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    ...classresultsQuery(params.eventId!, params.className!, useQueryClient()),
    structuralSharing: (oldData, newData) => {
      console.log({ oldData, newData })
      if (newData?.status === 'NOT MODIFIED') return oldData!
      else return newData
    },
    refetchInterval: 15 * 1000,
  })

  if (isLoading) return <Loader />

  if (error) return <>'An error has occurred: ' + error.message</>

  return (
    <>
      <h2>{params.className}</h2>
      <table>
        {result &&
          result.results.map((runnerInfo) =>
            runnerInfo.name === 'Hans Georg Gratzer' ? (
              <tr>
                <td key={runnerInfo.place}>🤡</td>
                <td key={runnerInfo.name}>{runnerInfo.name}</td>
                <td key={runnerInfo.club}>{runnerInfo.club}</td>
                <td colSpan={3}>
                  <a href="https://orienteering.sport/iof/fair-play/">
                    heute gibt es leider kein Ergebnis für dich
                  </a>
                </td>
              </tr>
            ) : (
              <tr>
                <td key={runnerInfo.place}>{runnerInfo.place}</td>
                <td key={runnerInfo.name}>{runnerInfo.name}</td>
                <td key={runnerInfo.club}>{runnerInfo.club}</td>
                <td key={runnerInfo.result}>{runnerInfo.result},</td>
                {/* <td key={runnerInfo.status}>{runnerInfo.status},</td> */}
                <td key={runnerInfo.timeplus}>{runnerInfo.timeplus},</td>
                {/* <td key={runnerInfo.progress}>{runnerInfo.progress},</td> */}
                <td key={runnerInfo.start}>
                  {new Date(
                    runnerInfo.start * 10 - 3600000
                  ).toLocaleTimeString()}
                </td>
              </tr>
            )
          )}
      </table>
    </>
  )
}
