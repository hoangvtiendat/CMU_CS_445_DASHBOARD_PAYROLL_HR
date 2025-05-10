interface Login {
  // username: string;
  username: string;
  password: string;
}
interface Token {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  role: string;

}

interface LoginResponse {
  user: {
    id: number;
    username: string;
    // fullName: string;
    email: string;
    role: "Employee" | "Hr" | "Payroll" | "Admin"; // Define roles correctly
  };
  token: string; // Just the token string, not the whole Token object
}

export type { Login, Token, LoginResponse};
