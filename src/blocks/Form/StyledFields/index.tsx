import { StyledText } from './StyledText'
import { StyledEmail } from './StyledEmail'
import { StyledTextarea } from './StyledTextarea'
import { StyledNumber } from './StyledNumber'
import { Checkbox } from '../Checkbox'
import { Country } from '../Country'
import { Message } from '../Message'
import { Select } from '../Select'
import { State } from '../State'

export const styledFields = {
  checkbox: Checkbox,
  country: Country,
  email: StyledEmail,
  message: Message,
  number: StyledNumber,
  select: Select,
  state: State,
  text: StyledText,
  textarea: StyledTextarea,
}
