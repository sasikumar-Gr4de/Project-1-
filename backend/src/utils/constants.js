// This would typically fetch user statistics from the database
// For now, return mock data
export const auth_stats = {
  total_users: 150,
  active_users: 142,
  new_users_today: 3,
  new_users_this_week: 15,
  users_by_role: {
    admin: 2,
    "data-reviewer": 5,
    annotator: 25,
    coach: 45,
    scout: 28,
    client: 45,
  },
  verification_stats: {
    verified: 135,
    unverified: 15,
  },
};
