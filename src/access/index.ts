import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin') ?? false
}

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}

export const allowFirstUserOrAdmin: Access = async ({ req }) => {
  const { user, payload } = req

  if (user?.roles?.includes('admin')) return true

  const existing = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  return existing.totalDocs === 0
}
