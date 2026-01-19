import type { Access } from 'payload'

export const authenticatedOrPublishedWithAuth: Access = ({ req: { user } }) => {
  // If user is authenticated, they can see everything
  if (user) {
    return true
  }

  // If not authenticated, only show published pages that don't require auth
  return {
    and: [
      {
        _status: {
          equals: 'published',
        },
        or: [
          {
            requiresAuth: {
              equals: false,
            },
          },
          {
            requiresAuth: {
              exists: false,
            },
          },
        ],
      },
    ],
  }
}
