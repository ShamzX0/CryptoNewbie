
// here I create textArea for our input and then we send the content to the API route with react Query
// // in the second step we have to get readable strem of strings from the API

"use client"
import { MessagesContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/validators/message'
import { useMutation } from '@tanstack/react-query'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> { }

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
    const [inputValue, setInputValue] = useState<string>('')

    const { messages, addMessage, removeMessage, updateMessage, setIsMessageUpdating } = useContext(MessagesContext)

    // creating ref for textarea, so after submitting we can automatically put the focus back on the input and user can keep writing without having to click on the input
    const textareaRef = useRef<null | HTMLTextAreaElement>(null)

    const { mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [message] })
            })

            if (!response.ok) {
                throw new Error()
            }

            return response.body
        },
        // we want to put the messages into a state
        onMutate(message) {
            addMessage(message)
        },

        //he I want to dispay the readable stream back to the client in realt-time
        onSuccess: async (stream) => {

            if (!stream) {
                throw new Error('No stream Found.')
            }
            //constructing the bot message
            const id = nanoid()
            const responseMessage: Message = {
                id,
                isUserMessage: false,
                text: '',
            }
            //now I need to add the message to our response state
            addMessage(responseMessage)

            setIsMessageUpdating(true)

            // now lets decode the stream
            const reader = stream.getReader()
            const decoder = new TextDecoder()

            let done = false

            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                // now I decoded the text into regular string and we can display it to the user
                const chunkValue = decoder.decode(value)
                //now I want to update the message with the id we just created
                updateMessage(id, (prev) => prev + chunkValue) // this puts all the chunks of messages we got back (usually by each word) and it puts them in one answer
            }

            setInputValue('')
            setIsMessageUpdating(false)
            //now you can refocus to the text area so the user can write a message again without having to click
            setTimeout(() => {
                textareaRef.current?.focus()
            }, 10)
        },
        onError(_, message) {
            toast.error('Something went wrong! Please try again.')
            removeMessage(message.id)
            textareaRef.current?.focus()
        },
    }
    )

    return (
        <div {...props} className={cn('border-t-[1px] border-dotted border-slate-600 pb-2', className)}>
            <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
                <TextareaAutosize
                    ref={textareaRef}
                    rows={2}
                    maxRows={4}
                    autoFocus
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            const message: Message = {
                                id: nanoid(),
                                isUserMessage: true,
                                text: inputValue
                            }
                            sendMessage(message)
                        }
                    }}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder='Write a message...'
                    className='peer disabled:opacity-50 pr-14 resize-none block w-full border-zinc-300 border-0 bg-slate-700 py-1.5 text-white focus:ring-0 text-sm sm:leading-6'
                />

                <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
                    <kbd className='inline-flex items-flex rounded border bg-white border-gray-500 px-1 font-sans text-xs text-gray-400'>
                        {
                            isLoading ? <Loader2 className='w-3 h-3 animate-spin' /> : <CornerDownLeft className='w-3 h-3' />
                        }
                    </kbd>
                </div>
                <div aria-hidden='true' className='absolute inset-x-0 bottom-0 border-t border-gray-900 peer-focus:border-t-2 peer-focus:border-indigo-600' />
            </div>
        </div>
    )
}

export default ChatInput
