import { useState } from 'react'
import timeGridPlugin from '@fullcalendar/timegrid'
import EmojiPicker from 'emoji-picker-react'
import FullCalendar from '@fullcalendar/react'
import useCalendar from '../hooks/useCalendar'
import { useNavigate } from 'react-router-dom'

function renderEventContent(eventInfo) {
	return (
		<>
			<b>{eventInfo.timeText}</b>
			<i>{eventInfo.event.title}</i>
		</>
	)
}

export default function Home() {
	const { events } = useCalendar()

	const navigate = useNavigate()

	const [showPicker, setShowPicker] = useState(false)
	const [text, setText] = useState('')

	const onEmojiClick = (emojiData, event) => {
		setText((prevInput) => prevInput + emojiData.emoji)
		setShowPicker(false)
	}

	const codeEmojis = (string) => {
		return [...string]
			.map((el) => {
				return el.codePointAt(0)
			})
			.join(',')
	}

	const onSubmit = () => {
		const unicodeEmojis = codeEmojis(text)

		console.log(`/${unicodeEmojis}`)

		navigate(`/${unicodeEmojis}`)
	}

	const onEventClick = (info) => {
		const unicodeEmojis = codeEmojis(info.el.fcSeg.eventRange.def.title)

		navigate(`/${unicodeEmojis}`)
	}

	return (
		<main className='flex flex-row min-h-screen  w-screen items-center justify-center '>
			<div className='flex flex-row items-center justify-between w-[80vw]'>
				<div className='flex flex-col px-6 w-1/2 items-center'>
					<h2>Click the emoji to add </h2>
					<div className='w-full flex flex-row items-center mb-5'>
						<input
							className='h-10 border-solid border-white border rounded mx-5 w-[90%] '
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<span
							className='p-x-5 cursor-pointer'
							onClick={() => setShowPicker((val) => !val)}>
							&#127773;
						</span>
					</div>
					{showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
					<button
						className='text-white border border-solid border-white mt-10'
						type='submit'
						onClick={onSubmit}>
						Add to Calendar{' '}
					</button>
				</div>
				<div></div>
				<FullCalendar
					plugins={[timeGridPlugin]}
					initialView='timeGridDay'
					events={events}
					eventContent={renderEventContent}
					eventClick={onEventClick}
					viewClassNames={'w-full'}
					height={600}
				/>
			</div>
		</main>
	)
}
