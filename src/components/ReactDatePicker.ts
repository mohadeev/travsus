// react-datepicker, safe in every build. The Cloudflare (vinext) build loads
// its CommonJS file, where the default import is the whole module object
// ({ default: DatePicker, registerLocale, … }) instead of the component, and
// React crashes ("Element type is invalid … got: object") when the calendar
// opens. Pick the component wherever it is.
import * as ReactDatePickerModule from 'react-datepicker'
import type ReactDatePicker from 'react-datepicker'

const mod: any = ReactDatePickerModule
const DatePicker: typeof ReactDatePicker =
	typeof mod.default === 'function' || mod.default?.$$typeof ? mod.default : mod.default?.default ?? mod

export const registerLocale: (name: string, data: any) => void = mod.registerLocale ?? mod.default?.registerLocale
export default DatePicker
