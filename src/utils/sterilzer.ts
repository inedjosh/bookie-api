export const sterilizeUser = (user: any) => {
  return {
    id: user?._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    role: user.role,
    profile_url: user.profile_url,
  };
};
