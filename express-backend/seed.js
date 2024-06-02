const { MongoClient } = require('mongodb');

async function seed() {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    try {
        console.log('connecting to MongoDB');
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db('webdatabase');
        const users = database.collection('users');
        

        await users.insertMany([
            { username: "employer01", type:'employer', publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxJFkXfJaMhufB2FAWntmu2y7ca/r18Zxrh/a9qAuQchVA777+0SSxTPpU6H/BzXOWS4zhMAq+27CJU0NlwOLa+690UhUAXOdBq4MR+/ncmuXTq+2FYXeRsKMQjVc6GYHiB3ZOf07zzenxZqw5INe1kBTjmZneA/WjYeGR9pE6moLLW1ZPH0XUhX0ECG6zizp3ol7UcL5OrDU0c57jxPxEW0BDixd8XSnfH36cjyTf++yHOv1foLTWmEgibEKSajxv7DbasJ9SmTzmVqb7eM89AxG+ReTonoj6KPIssYY8Yhrwj5TeE/b1xdS69IQudXCr3bU3CWvgqgb478fssS9VQIDAQAB", 
              signaturePublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu8wDsDtrQouU268dDYt4WWTQ5CarwB2TRbSkrE0UoC8PdteEiQTUNmMWTa/TEnMXBtduP+JbVP2Ffav42QNGjlJpv/6S8TZppBRf9l6ydxVwgvb3kv6TUovWrgvpsuMHjr0mQWcTUkyECT5Xh+tN4tgOVuuX8LOxRCoRSu4tkvzfrit4puh3V6TSWot/ptpapGoygkV0v0+LArpwrIS/eywLhgM0MKXfS7nQCzUQtCEyl6AgvRiZ3TYnA0MY+8QOficW7tZPuwNI6mNoafIkjs43qEJazORJN5NOnbBTbyByCiDPID7hfv51P4p2YXTUwZxpFI1JraD7n4Jv+zzlDwIDAQAB' },
            { username: "university01", type:"university", publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nDUof0TS0XUqB8GgwCKe0xG7dlPO1EvNDzF2GqR5xKHghkkDrRlCemG9dzqFCnf71+myzosTkDWd0EuB8ioug2bxWwhC+lBa2VY9H5op2AKA1U/ogXJH3Jdgfrc7vR9EOLnRHte+WX6Wu7PI6xDT9oxxLciueAtw+CNsv1jpaXb1V4G7d8f3HEEYI+8O3MwDW/fAVHm95662z/WW+S9vksaFfSaGuktkeqQyH54J7CoFETrbRZ0FAuHlVaKQZm4EicCg0UB4GuV1KXA4YFqkFl1+FdNdFbTGHJFz3Zdsv7CenO8/Vyg6QL5yZ+DQHIkydLiPsotPd2nh3fVmjhYBwIDAQAB",
              signaturePublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAovOOyL7CQaSZGNPUjMbMTra7mdMswPdvfiqSHEr9OWWF7PzYttXkW9KUon7gt2mNAOIYrpT5+r3x/RgHjmdzdjSHt83xAzELT4ZdvIvxsoIJth8TyZXNDvg8Cv+Z+xlgRNa5FqraLrvCdc7fS5AZm22zjzAyokH4aaGmV3SGsggCUqJGRmvQndEX+AGhaWTv5CYK4g4P+QXEoikU4YKu1twSKL3k5Pu06UzpLctU27q7yMFn3+CysmWt5YRkMsJe86Q0E9MvGbvabvCkDeiSyj0IMUQ3J5mj5+mdd99wP5jtzphcWXsfufqa5BmpLdzQFkoP5pVAMSu+wVFjmeMM5wIDAQAB'
             },
            { username: "student01", type: "student", publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxtP3eJUr9jMG4Ikt0z/BcHgG/fYxnVugGDERvRxBpHAaZlYr0pzeU4pMetK9Qbi5yYDBfhbnfD7doWv7icMFjWHTS6z2xeu9mk+d18+Am/JsJqwPehe0oj1vMXQuyirM7NrZ4Kgf1qMNC3B0zqAlgx6VhVRqRaSxq6cRjeYAgyaGLRGShdmMn2kUa3Xz/92dZ99boQFAkodmn1lIJi0MTcS8ioYC2Tt2WI/GqgiV7zsJkZVHim4kcOIEZfjMMmhHLaOX0zHaELbGt4a4JQ/s3bynq117j/utBEVjU0ZcZm/f9GtlLBuKiw1B/u5lguK3wfzkUEptI+kpbq8qC9qvhQIDAQAB",
              signaturePublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjKBVyEEfs8XW5RO0+5BNAneeIQVDD8UAeYCUBc7k5bMtPjnxB+dzJK1o6c1pVQ8Jjkl2iRhDFYLQRmG3ouDk8m7TkeMohLv7Dl0g9pqotoP0Cp5xIPEnUqTAYWW+aeqVst+Mqc/dhJGjHY8brbl9ffiBQQO+NHNQE/QhMeZkGcpNan5SwnbhRP0ron6Yuh26KYWwVhCElIsi9lrcfT7f4DIgMmKNO3cId0TQuV4/p8laB790cyQqZ9efT0ouH7/WBDCbiS7EwVCLAvI7zQ7FE8V1ERhova5Kud0/uahe8zhB9453r9TPCeOFLsCEEGiOzNfhtkv2MJqlsTnxy9tuFQIDAQAB'
             }
          ]);

        console.log('Seeding successful');

    }catch (err) {
        console.error(err);  
    } finally {
        await client.close();
        console.log("Connection to MongoDB closed");
    }
}

seed()