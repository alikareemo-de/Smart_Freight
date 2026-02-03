export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthResponse = {
    accessToken: string;
    expiresAt: string;
    email: string;
    role: string;
};
