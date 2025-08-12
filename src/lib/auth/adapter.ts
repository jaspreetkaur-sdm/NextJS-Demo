import { Adapter } from 'next-auth/adapters';
import { query } from '../db';

export function PostgreSQLAdapter(): Adapter {
  return {
    async createUser(user) {
      const result = await query(
        'INSERT INTO users (email, name, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [user.email, user.name]
      );
      return {
        id: result.rows[0].id.toString(),
        email: result.rows[0].email,
        name: result.rows[0].name,
        emailVerified: null,
      };
    },

    async getUser(id) {
      const result = await query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        emailVerified: null,
      };
    },

    async getUserByEmail(email) {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        emailVerified: null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await query(
        `SELECT u.* FROM users u 
         JOIN accounts a ON u.id = a.user_id 
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      
      if (result.rows.length === 0) return null;
      
      const user = result.rows[0];
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        emailVerified: null,
      };
    },

    async updateUser(user) {
      const result = await query(
        'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [user.name, user.id]
      );
      
      const updatedUser = result.rows[0];
      return {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: null,
      };
    },

    async deleteUser(userId) {
      await query('DELETE FROM users WHERE id = $1', [userId]);
    },

    async linkAccount(account) {
      await query(
        `INSERT INTO accounts 
         (user_id, type, provider, provider_account_id, refresh_token, access_token, 
          expires_at, token_type, scope, id_token, session_state, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      );
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await query(
        'DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2',
        [provider, providerAccountId]
      );
    },

    async createSession({ sessionToken, userId, expires }) {
      await query(
        'INSERT INTO sessions (session_token, user_id, expires, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [sessionToken, userId, expires]
      );
      
      return {
        sessionToken,
        userId,
        expires,
      };
    },

    async getSessionAndUser(sessionToken) {
      const result = await query(
        `SELECT s.*, u.* FROM sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = $1 AND s.expires > CURRENT_TIMESTAMP`,
        [sessionToken]
      );
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        session: {
          sessionToken: row.session_token,
          userId: row.user_id.toString(),
          expires: new Date(row.expires),
        },
        user: {
          id: row.id.toString(),
          email: row.email,
          name: row.name,
          emailVerified: null,
        },
      };
    },

    async updateSession({ sessionToken, expires }) {
      const result = await query(
        'UPDATE sessions SET expires = $1 WHERE session_token = $2 RETURNING *',
        [expires, sessionToken]
      );
      
      if (result.rows.length === 0) return null;
      
      const session = result.rows[0];
      return {
        sessionToken: session.session_token,
        userId: session.user_id.toString(),
        expires: new Date(session.expires),
      };
    },

    async deleteSession(sessionToken) {
      await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
    },

    async createVerificationToken({ identifier, expires, token }) {
      await query(
        'INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, $3)',
        [identifier, token, expires]
      );
      
      return { identifier, token, expires };
    },

    async useVerificationToken({ identifier, token }) {
      const result = await query(
        'DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2 RETURNING *',
        [identifier, token]
      );
      
      if (result.rows.length === 0) return null;
      
      const verificationToken = result.rows[0];
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: new Date(verificationToken.expires),
      };
    },
  };
}
