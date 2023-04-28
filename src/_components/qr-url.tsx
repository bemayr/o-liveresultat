import { h } from 'preact'
import { signal, useSignalEffect } from '@preact/signals'
import QRCode from 'qrcode'
import { theme } from '../theme'
import { currentUrl } from '../url'

export const CurrentUrlAsQRCode = () => {
  const qrData = signal('')

  useSignalEffect(() => {
    console.log('recalculating qr code')
    QRCode.toDataURL(currentUrl.value!, {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      rendererOpts: {
        quality: 1,
      },
      margin: 3,
      color: {
        dark: theme.value!.f_high,
        light: theme.value!.background,
      },
    }).then((data) => (qrData.value = data))
  })

  return <img src={qrData} alt="QR Code for the Current Site"></img>
}
