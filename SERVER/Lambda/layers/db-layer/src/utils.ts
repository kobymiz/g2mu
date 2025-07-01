import Database, { DBConfig } from "./database";
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';


const DB_CREDENTIALS_KEY = "rds_db_credensials";

export const getDatabase = async () : Promise<Database>=>{        
    var dbConfig = await getDBConfig();    

    var database = new Database();   
    if(dbConfig != null){ 
        await database.initialize(dbConfig);    
    }

    return database;
}

let _dbConfig: DBConfig | null = null;

const getDBConfig = async ()=>{
    if(!_dbConfig){        
        const dbConfigString = await getSecretValue(DB_CREDENTIALS_KEY);        
        if(!dbConfigString){
            throw "DB Config String not found";
        }

        _dbConfig = JSON.parse(dbConfigString);
    }    

    return _dbConfig;
    
}

const getSecretValue = async (secretKey: string): Promise<string> => {
    const client = new SecretsManagerClient();

    try {
        const command = new GetSecretValueCommand({ SecretId: secretKey });
        
        const data = await client.send(command);        
        if (data.SecretString) {
            return data.SecretString;
        } else {
            const buff = Buffer.from(data.SecretBinary as Uint8Array);
            return buff.toString('ascii');
        }
    } catch (err) {
        console.error(`Error retrieving secret ${secretKey}:`, err);
        throw err;
    }
}
