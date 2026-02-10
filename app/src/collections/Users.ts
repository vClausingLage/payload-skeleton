import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrSelf, allowFirstUserOrAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: allowFirstUserOrAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
  },
  fields: [
    // Email added by default
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      access: {
        update: adminOnly,
      },
    },
  ],
}
