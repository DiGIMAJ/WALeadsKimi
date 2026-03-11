declare module '@paystack/inline-js' {
  interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    metadata?: Record<string, any>;
    onClose?: () => void;
    callback?: (response: { reference: string }) => void;
  }

  interface PaystackHandler {
    openIframe: () => void;
  }

  function setup(config: PaystackConfig): PaystackHandler;

  export default { setup };
}
