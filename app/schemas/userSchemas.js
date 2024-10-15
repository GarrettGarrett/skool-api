export const userSchema = {
  id: 'string',
  name: 'string',
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  bio: 'string',
  location: 'string',
  createdAt: 'string',
  updatedAt: 'string',
  profilePicture: 'string',
  socialLinks: {
    facebook: 'string',
    instagram: 'string',
    linkedin: 'string',
    twitter: 'string',
    website: 'string',
    youtube: 'string',
  },
  stats: {
    totalPosts: 'number',
    totalFollowers: 'number',
    totalFollowing: 'number',
    totalSharedGroups: 'number',
  },
  groups: {
    memberOf: [{
      id: 'string',
      name: 'string',
      displayName: 'string',
      description: 'string',
      totalMembers: 'number',
      totalPosts: 'number',
    }],
    createdByUser: [{
      id: 'string',
      name: 'string',
      displayName: 'string',
      description: 'string',
      totalMembers: 'number',
      totalPosts: 'number',
    }],
  },
  pageTitle: 'string',
  pageMeta: 'object', // Assuming this is an object with various metadata
};

export const userResponseSchema = {
  id: 'string',
  handle: 'string',
  displayName: 'string',
  bio: 'string',
  followers: 'number',
  following: 'number',
  posts: [{
    id: 'string',
    content: 'string',
    createdAt: 'string',
    likes: 'number',
    reposts: 'number'
  }]
};

// Add more schemas as needed
