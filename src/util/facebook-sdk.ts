declare global {
  interface Window {
    fbAsyncInit?: () => void
    FB?: {
      init: (params: {
        appId: string
        autoLogAppEvents: boolean
        xfbml: boolean
        version: string
      }) => void
      login: (
        callback: (response: FBLoginResponse) => void,
        options: {
          config_id: string
          response_type: string
          override_default_response_type: boolean
          extras: { setup: Record<string, unknown> }
        },
      ) => void
    }
  }
}

export type FBLoginResponse = {
  authResponse?: {
    code: string
    accessToken?: string
    userID?: string
  }
  status?: string
}

export type WhatsAppSignupEvent = {
  data: {
    phone_number_id?: string
    waba_id?: string
    business_id?: string
    current_step?: string
  }
  type: 'WA_EMBEDDED_SIGNUP'
  event: 'FINISH' | 'CANCEL' | string
}

const GRAPH_API_VERSION = 'v22.0'

let sdkLoadPromise: Promise<void> | null = null

export function loadFacebookSdk(appId: string): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = new Promise<void>((resolve) => {
    window.fbAsyncInit = () => {
      window.FB!.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: GRAPH_API_VERSION,
      })
      resolve()
    }

    if (window.FB) {
      window.FB.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: GRAPH_API_VERSION,
      })
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)
  })

  return sdkLoadPromise
}

export function launchWhatsAppSignup(configId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'))
      return
    }

    window.FB.login(
      (response) => {
        if (response.authResponse?.code) {
          resolve(response.authResponse.code)
        } else {
          reject(new Error('WhatsApp signup was cancelled or failed'))
        }
      },
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: { setup: {} },
      },
    )
  })
}
