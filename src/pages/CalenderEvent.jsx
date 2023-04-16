import useCalendar from '../hooks/useCalendar'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

/**Connects to metamask and verifies previous signed message */
const verifyMessage = async (message, address, signature) => {
	try {
		const signerAddr = await ethers.verifyMessage(message, signature)

		if (signerAddr !== address) {
			return false
		}

		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

const ErrorMessage = ({ message }) => {
	if (!message) return null

	return (
		<div role='alert'>
			<div className='bg-red-500 text-white font-bold rounded-t px-4 py-2'>
				Danger
			</div>
			<div className='border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700'>
				<p>{message}</p>
			</div>
		</div>
	)
}

const SuccessMessage = ({ message }) => {
	if (!message) return null

	return (
		<div
			className='bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md'
			role='alert'>
			<div className='flex'>
				<div className='py-1'>
					<svg
						className='fill-current h-6 w-6 text-teal-500 mr-4'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'>
						<path d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z' />
					</svg>
				</div>
				<div>
					<p className='font-bold'>Success</p>
					<p className='text-sm'>{message}</p>
				</div>
			</div>
		</div>
	)
}

/**Handles connection to metamask and awaits signed message */
const signMessage = async ({ setError, message }) => {
	try {
		console.log(message)
		if (!window.ethereum) throw new Error('No Wallet found. Please install one')

		await window.ethereum.send('eth_requestAccounts')
		const provider = new ethers.BrowserProvider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = await provider.getSigner()
		const signature = await signer.signMessage(message)
		const address = await signer.getAddress()

		return {
			message,
			signature,
			address,
		}
	} catch (err) {
		setError(err.message)
	}
}

/**Gets emoji or combination of emojis and converts items
 * to Unicode
 */
const decodeHash = (hash) => {
	const unicodeEmojiArray = hash.split(',')

	return String.fromCodePoint(...unicodeEmojiArray)
}

const CalendarEvent = () => {
	const { addEvent } = useCalendar()

	const navigate = useNavigate()
	const { hash } = useParams()

	const [error, setError] = useState()
	const [successMsg, setSuccessMsg] = useState()
	// eslint-disable-next-line no-unused-vars
	const [message, setMessage] = useState(decodeHash(hash))
	const [showModal, setShowModal] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState([])
	const [isSigned, setIsSigned] = useState(false)

	const handleSign = async (e) => {
		e.preventDefault()
		const data = new FormData(e.target)
		setError()
		const sig = await signMessage({
			setError,
			message: data.get('message'),
		})
		if (sig) {
			const isValid = await verifyMessage(
				sig.message,
				sig.address,
				sig.signature
			)
			if (isValid) {
				setSuccessMsg('Signature is valid!')
				console.log(isValid)
				setIsSigned(isValid)
			} else {
				setError('Invalid signature')
			}
		}
	}

	const handleSelect = (info) => {
		setSelectedEvent({ title: '', start: info.date })
		setShowModal(true)
	}

	const onClick = () => {
		if (isSigned) {
			addEvent({ title: message, start: selectedEvent.start })
			navigate('/')
		}
	}

	return (
		<>
			<h1 className='p-5'>Select a time to start</h1>
			<div className='w-full flex flex-row align-top h-[90vh] p-14 justify-center '>
				<FullCalendar
					plugins={[timeGridPlugin, interactionPlugin]}
					initialView='timeGridDay'
					select={handleSelect}
					dateClick={handleSelect}
					editable={true}
					selectable={true}
					events={selectedEvent}
					viewClassNames={''}
				/>
				{showModal && (
					<div className='flex flex-col items-center'>
						<form className='m-4' onSubmit={handleSign}>
							<div className=' w-full shadow-lg mx-auto rounded-xl bg-white'>
								<main className='mt-4 p-4'>
									<h2 className='text-xl font-semibold text-gray-700 text-center'>
										Add Signed event to Calendar
									</h2>
									<div className=''>
										<div className='my-3'>
											<textarea
												value={message}
												required
												type='text'
												name='message'
												className=' w-full h-24  focus:ring focus:outline-none'
												placeholder='Message'
											/>
										</div>
									</div>
								</main>
								<footer className='p-4 flex flex-col gap-2'>
									<button
										type='submit'
										className='py-3 flex items-center  p-2.5 border border-solid border-black text-black focus:ring focus:outline-none m-b-2 '>
										Sign Event
									</button>

									<ErrorMessage message={error} />
									<SuccessMessage message={successMsg} />
								</footer>
							</div>
						</form>
						<button
							onClick={onClick}
							className={`py-3 flex items-center p-2.5 border border-solid focus:ring focus:outline-none m-b-2 ${
								!isSigned
									? 'text-gray-500 border-gray-500'
									: ' border-white text-white'
							}`}
							disabled={!isSigned}>
							Add to Calendar
						</button>
					</div>
				)}
			</div>
		</>
	)
}

export default CalendarEvent
