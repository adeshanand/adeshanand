import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

import { ArchiveBlock } from './ArchiveBlock'
import { CallToActionBlock } from './CallToAction'
import { ContentBlock } from './Content'
import { FormBlock } from './Form'
import { MediaBlock } from './MediaBlock'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  disableTopPadding?: boolean
  disableGradient?: boolean
}> = (props) => {
  const { blocks, disableTopPadding, disableGradient = false } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              // Check if it's a content block and should have gradient background
              const isContentBlock = blockType === 'content'
              const isMediaBlock = blockType === 'mediaBlock'
              const shouldHaveGradient = !disableGradient && isContentBlock && index === 0 && !disableTopPadding

              // Prepare props based on block type
              const blockProps: any = { ...(block as Page['layout'][0]) }
              
              // Only add backgroundColor for content blocks
              if (isContentBlock) {
                blockProps.backgroundColor = shouldHaveGradient ? 'gradient' : 'default'
              }
              
              // Only add disableInnerContainer for media blocks
              if (isMediaBlock) {
                blockProps.disableInnerContainer = true
              }

              return (
                <div 
                  className={shouldHaveGradient ? '' : 'my-16'} 
                  key={(block as Page['layout'][0]).id || index}
                >
                  <Block {...blockProps} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
