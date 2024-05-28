export async function FindUser(username) {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${username}`);
      if (!response.ok) {
        return { message: 'error fetching data' };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { message: error.message || 'error fetching data' };
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