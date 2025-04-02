export const handleSearch = (query, users) => {
    if (!query) return users; // If no query, return full list
    return users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  };
  