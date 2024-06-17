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

export async function CreateUser(entry) {
  try {
    const response = await fetch('http://localhost:4000/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      return errorMessage
    }
  }
  catch (error) {
    console.error(error);
    return {error: 404, message:'Failed to fetch'}
  }
}