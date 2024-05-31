import React, { useState, useEffect } from 'react';
import {FindUser, FindUserByPublicKey} from '../MongoDB/MongoFunctions';

function MongoUsers() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await FindUser('student01');
        const newUser = await FindUserByPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nDUof0TS0XUqB8GgwCKe0xG7dlPO1EvNDzF2GqR5xKHghkkDrRlCemG9dzqFCnf71+myzosTkDWd0EuB8ioug2bxWwhC+lBa2VY9H5op2AKA1U/ogXJH3Jdgfrc7vR9EOLnRHte+WX6Wu7PI6xDT9oxxLciueAtw+CNsv1jpaXb1V4G7d8f3HEEYI+8O3MwDW/fAVHm95662z/WW+S9vksaFfSaGuktkeqQyH54J7CoFETrbRZ0FAuHlVaKQZm4EicCg0UB4GuV1KXA4YFqkFl1+FdNdFbTGHJFz3Zdsv7CenO8/Vyg6QL5yZ+DQHIkydLiPsotPd2nh3fVmjhYBwIDAQAB')
        setUser(fetchedUser);
        setData(newUser)
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
      <p>Data: {JSON.stringify(data)}</p>
      <h1>Error: {error}</h1>
    </div>
  );
}

export default MongoUsers;