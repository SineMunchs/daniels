'use server'

import { Resend } from 'resend'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL ?? 'kontakt@artisanentreprise.dk'
const MAX_FILES = 2
const MAX_TOTAL_BYTES = 5 * 1024 * 1024

export async function sendContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const navn = String(formData.get('navn') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefon = String(formData.get('telefon') ?? '').trim()
  const postnummer = String(formData.get('postnummer') ?? '').trim()
  const by = String(formData.get('by') ?? '').trim()
  const besked = String(formData.get('besked') ?? '').trim()

  if (!navn || !email || !telefon || !postnummer || !besked) {
    return { status: 'error', message: 'Udfyld venligst alle påkrævede felter.' }
  }

  const files = formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (files.length > MAX_FILES) {
    return { status: 'error', message: `Du kan højst vedhæfte ${MAX_FILES} filer.` }
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  if (totalSize > MAX_TOTAL_BYTES) {
    return {
      status: 'error',
      message: `De vedhæftede filer fylder for meget tilsammen (max ${MAX_TOTAL_BYTES / (1024 * 1024)} MB).`,
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY mangler — kan ikke sende kontaktformular.')
    return { status: 'error', message: 'Der skete en fejl. Prøv igen senere.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  )

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: RECIPIENT_EMAIL,
    replyTo: email,
    subject: `Ny tilbudsforespørgsel fra ${navn}`,
    text: [
      `Navn: ${navn}`,
      `E-mail: ${email}`,
      `Telefon: ${telefon}`,
      `Postnummer: ${postnummer}`,
      by && `By: ${by}`,
      '',
      besked,
    ]
      .filter(Boolean)
      .join('\n'),
    attachments,
  })

  if (error) {
    console.error('Kunne ikke sende kontaktformular', error)
    return { status: 'error', message: 'Der skete en fejl. Prøv igen senere.' }
  }

  return { status: 'success', message: 'Tak! Din besked er sendt.' }
}
