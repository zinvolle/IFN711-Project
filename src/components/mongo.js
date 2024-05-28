import React, { useState, useEffect } from 'react';
import {FindUser} from '../MongoDB/MongoFunctions';

function MongoUsers() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await FindUser('employer01');
        setUser(fetchedUser);
      } catch (err) {
        console.log(err.message)
        setError(err.message || 'Error fetching user');
      }
    };

    fetchUser();
  }, []);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading?</div>;

  return (
    <div>
      <h1>User: {JSON.stringify(user)}</h1>
      <h1>Error: {error}</h1>
    </div>
  );
}

export default MongoUsers;