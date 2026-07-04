class AuthHandler {
  constructor() {
    this.validUsers = new Map([
      ['admin', 'password123'],
      ['user', 'userpass']
    ]);
  }

  async handleLogin(event) {
    try {
      const body = JSON.parse(event.body || '{}');
      
      if (!body.username || !body.password) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          body: JSON.stringify({
            error: 'Username and password are required'
          })
        };
      }

      const storedPassword = this.validUsers.get(body.username);
      
      if (!storedPassword || storedPassword !== body.password) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          body: JSON.stringify({
            error: 'Invalid credentials'
          })
        };
      }

      // Generate simple token (in production, use JWT)
      const token = Buffer.from(`${body.username}:${Date.now()}`).toString('base64');

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          token: token,
          username: body.username,
          expiresIn: 3600
        })
      };
    } catch (error) {
      console.error('Auth handler error:', error);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          error: 'Internal server error'
        })
      };
    }
  }

  validateToken(token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [username, timestamp] = decoded.split(':');
      
      // Check if token is less than 1 hour old
      const tokenAge = Date.now() - parseInt(timestamp);
      const oneHour = 60 * 60 * 1000;
      
      if (tokenAge > oneHour) {
        return null;
      }
      
      return { username };
    } catch (error) {
      return null;
    }
  }
}

module.exports = { AuthHandler };