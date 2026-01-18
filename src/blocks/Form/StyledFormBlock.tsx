'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '../../components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { styledFields } from './StyledFields'
import { getClientSideURL } from '../../utilities/getURL'

export type StyledFormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  className?: string
}

/**
 * Styled version of FormBlock that matches the existing Contact section design
 * Uses transparent glass-morphism styling with white text
 */
export const StyledFormBlock: React.FC<
  {
    id?: string
  } & StyledFormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    className = '',
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className={`mx-auto max-w-2xl ${className}`}>
      {enableIntro && introContent && !hasSubmitted && (
        <div className="mb-6">
          <RichText className="text-slate-300" data={introContent} enableGutter={false} />
        </div>
      )}
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-6 backdrop-blur-sm">
            <RichText className="text-green-400" data={confirmationMessage} />
          </div>
        )}
        {isLoading && !hasSubmitted && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-slate-300">Sending your message...</p>
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 backdrop-blur-sm mb-6">
            <p className="text-red-400">{`${error.status || '500'}: ${error.message || ''}`}</p>
          </div>
        )}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = styledFields?.[field.blockType as keyof typeof styledFields]
                if (Field) {
                  return (
                    <Field
                      key={index}
                      form={formFromProps}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  )
                }
                return null
              })}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-6 py-3 text-base font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
            >
              {submitButtonLabel || 'Submit'}
            </button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
