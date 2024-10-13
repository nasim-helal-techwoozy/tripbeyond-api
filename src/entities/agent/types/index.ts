export interface User {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Agent {
  agentID: number;
  orgType: string;
  orgName: string;
  orgAddress: string;
  country: string;
  state: string;
  city: string;
  phoneNumber: string;
  zipCode: string;
  docs: string;
  user: User;
}
