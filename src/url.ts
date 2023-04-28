import { Signal, signal } from '@preact/signals'

export const currentUrl: Signal<string | undefined> = signal(undefined)
