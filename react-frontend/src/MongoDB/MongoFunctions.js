export async function FindUser(username) {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${username}`);
      if (!response.ok) {
        return { error: '404', message: 'error fetching data' };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: '404', message: error.message || 'error fetching data' };
    }
  }


export async function GetAllUsers() {
    try {
        const response = await fetch(`http://localhost:4000/api/users/all`);
        if (!response.ok) {
          return { message: 'error fetching data' };
        }
        const data = await response.json();
        return data;
      } catch (error) {
        return { message: error.message || 'error fetching data' };
      }
}

export async function FindUserByPublicKey(publicKey) {
  try {
    const encoodedPublicKey = encodeURIComponent(publicKey);
    const response = await fetch(`http://localhost:4000/api/userskey/${encoodedPublicKey}`);
    if (!response.ok) {
      return { error: '404', message: 'error fetching data' };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: '404', message: error.message || 'error fetching data' };
  }
}