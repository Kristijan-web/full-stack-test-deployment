declare global {
  interface Error {
    responseData?: {
      isOperational: boolean;
      message: string;
    }; // ili precizniji tip
  }
}

export {};
