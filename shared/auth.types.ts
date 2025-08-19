// ============================================================================
// AUTHENTICATION INTERFACES
// ============================================================================

export interface AppUser {
  userId: string
  username: string
  email: string
  name?: string
  givenName?: string
  familyName?: string
  signInDetails?: Record<string, unknown>
}
