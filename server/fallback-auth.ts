// Fallback authentication for deployment
export function createFallbackUser() {
  return {
    id: 'demo_user',
    email: 'demo@village-one.app',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    bio: 'Demo user for Village-One application',
    archetype: 'collaborative',
    level: 1,
    contributions: 0,
    profileImageUrl: null,
    socialLinks: null,
    skills: null,
    website: null,
    location: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}