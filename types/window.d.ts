declare global {
  interface Window {
    recaptchaVerifier: import("firebase/auth").RecaptchaVerifier | undefined
    confirmationResult: any
  }
}

export {} 