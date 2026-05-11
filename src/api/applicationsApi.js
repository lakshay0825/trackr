import { api } from './client'

const path = '/api/applications'

export async function listApplications() {
  const { data } = await api.get(path)
  return data
}

export async function createApplication(body) {
  const { data } = await api.post(path, body)
  return data
}

export async function updateApplication(id, body) {
  const { data } = await api.patch(`${path}/${id}`, body)
  return data
}

export async function deleteApplication(id) {
  await api.delete(`${path}/${id}`)
}

export async function seedDefaultApplications() {
  const { data } = await api.post(`${path}/seed-defaults`)
  return data
}
