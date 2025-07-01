import { User } from './user';
import { Injectable } from '@angular/core';
import * as Auth from '@aws-amplify/auth';


export type LoginResponse = {
  success: boolean;  
  awaitConfirmation?: boolean;  
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedUser: User | null = null;

  async isLoggedIn(): Promise<boolean> {
    try {
      var loggedUser = await Auth.getCurrentUser();      
      return loggedUser !== null && loggedUser !== undefined;
    } catch {
      return false;
    }
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    try {
      var response = await Auth.resendSignUpCode({username: email});
      console.log('Resend confirmation email response:', response);      
    } catch (error) {
      console.error('Error resending confirmation email:', error);  
      throw error;
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      var response = await Auth.signIn({username, password});
      var loginResponse = {
        success: response.isSignedIn,
        awaitConfirmation: response.nextStep.signInStep === 'CONFIRM_SIGN_UP',        
      }
      return loginResponse;

    } catch (error) {
      console.error('Login failed', error);
      const errorMessage = (error instanceof Error) ? error.message : (typeof error === 'string' ? error : 'Invalid credentials');
      const loginResponse = {
        success: false,
        error: errorMessage
      }

      return loginResponse;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.loggedUser) {
      return this.loggedUser;
    }
    try {
      var loggedUser = await Auth.getCurrentUser();
      const attributes = await Auth.fetchUserAttributes();
      
      this.loggedUser = this.mapUser(loggedUser, attributes);
      
    } catch (error) {
      console.error('Error fetching current user:', error);
      this.loggedUser = null;
      throw error;
    }     

    return this.loggedUser;
  }
  
  async resetPassword(email: string): Promise<void> {
    try {
      var params: Auth.ResetPasswordInput = {
        username: email,        
      }
      var output = await Auth.resetPassword(params);      
      console.log('Password reset initiated ', output);
    } catch (error) {
      console.error('Error initiating password reset:', JSON.stringify(error, null, 2)); 
      throw error;
    }
  }
  
  async signOut(): Promise<void> {        
    try {
      await Auth.signOut();      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    var input: Auth.SignUpInput = {
      username: email,
      password: password,
      options: {
        userAttributes: {
          email: email,
          name: name
        }
      }
    };

    try {
      var output = await Auth.signUp(input);      
      console.log('Registration successful', output);
      return true;
    }catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  }

  private mapUser(user: Auth.GetCurrentUserOutput, attributes:Auth.FetchUserAttributesOutput): User {
    return {
      id: attributes.sub || '',
      email: attributes.email || '',
      name: attributes.name || '',
      username: user.username || '',
    };
  }
}