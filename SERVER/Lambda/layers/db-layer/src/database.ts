// src/database.ts
import { createConnection, Connection } from 'mysql2/promise';

export interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

class Database {
  private connection: Connection | null = null;

  async initialize(config: DBConfig): Promise<void> {
    this.connection = await createConnection(config);
  }

  async connect(): Promise<void> {
    if (this.connection) {
      await this.connection.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
    }
  }

  async executeQuery(query: string, values?: any[]): Promise<any> {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    const [rows] = await this.connection.query(query, values);    
    return rows;
  }

  async executeCommand(query: string, values?: any[]): Promise<any> {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    const [result] = await this.connection.execute(query, values);
    return result;
  }

  async beginTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    await this.connection.beginTransaction();
  }

  async commit(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    await this.connection.commit();
  }

  async rollback(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not initialized');
    }
    await this.connection.rollback();
  }
}

export default Database;