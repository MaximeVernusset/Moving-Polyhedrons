import type { RgbColor } from "./RgbColor"

export type EventData = {
    event : Event,
    data: number | string | RgbColor | object | null | undefined
}