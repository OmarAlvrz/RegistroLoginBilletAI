// This file will be used for the login functionality in the future
// For now, we're keeping the existing login functionality

export class AuthManager {
  private apiBaseUrl: string = 'https://v1-default--production-omaralvrz.sierranegra.cloud';
  
  constructor() {
    // Initialize auth manager
  }
  
  public async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  public async register(fullName: string, email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName
        })
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Correo electrónico ya registrado');
        } else {
          throw new Error('Error en la solicitud');
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}