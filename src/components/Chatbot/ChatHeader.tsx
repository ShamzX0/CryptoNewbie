"use client"

import { FC } from 'react'

interface ChatHeaderProps {

}

const ChatHeader: FC<ChatHeaderProps> = ({ }) => {
    return <div className='w-full flex gap-3 justify-start items-center text-white'>
        <div className='flex flex-col items-start text-sm'>
            <p className='text-xs ml-3 '>Chat with</p>
            <div className='flex gap-1.5 items-center'>
                <p className='rounded-full w-2 h-2 bg-green-500' />
                <p className='font-normal font-unbounded'>Newbie Support</p>
            </div>
        </div>
    </div>
}

export default ChatHeader