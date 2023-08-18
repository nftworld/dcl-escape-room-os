import { signedFetch } from '@decentraland/SignedFetch'

import config from './config'

export async function request(action: string, data?: any) {
  const response = await signedFetch(`${config.backend.url}/${action}`, {
    method: 'POST',
    responseBodyType: 'json',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      ...(data || {})
    })
  })

  if (!response?.json) throw new Error(response.statusText)
  return response.json
}

export async function recordUser(data: any) {
  return await request('recordUser', data)
}

export async function recordUserMetadata(data: any) {
  return await request('recordUserMetadata', data)
}

export async function getGame(id: number) {
  return await request('getGame', { id })
}

export async function getUser(id: number) {
  return await request('getUser', { id })
}

export async function getStats() {
  return await request('getStats')
}

export async function getGames() {
  return await request('getGames')
}

export async function getCurrentGameId() {
  return await request('getCurrentGameId')
}

export async function setTask(game: number, task: number) {
  return await request('setTask', { game, task })
}

export async function setCombination(game: number, type: string, combination: number[]) {
  return await request('setCombination', { game, type, combination })
}

export async function cancelEntry(game: number) {
  return await request('cancelEntry', { game })
}
