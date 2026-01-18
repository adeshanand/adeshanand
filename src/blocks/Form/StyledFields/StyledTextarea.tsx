import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import React from 'react'
import { Error } from '../Error'
import { Width } from '../Width'

export const StyledTextarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 6, width }) => {
  return (
    <Width width={width}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && (
          <span className="text-red-400 ml-1">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </label>
      <textarea
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        {...register(name, { required: required })}
        className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all resize-none"
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
