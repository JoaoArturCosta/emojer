import { useContext } from 'react'
import { CalendarContext } from '../context/context'

/**Hook to handle Calendar state across components */
const useCalendar = () => {
	const { events, setEvents } = useContext(CalendarContext)

	const addEvent = (calendarEvent) => {
		setEvents([...events, calendarEvent])
		window.localStorage.setItem('emojer-events', JSON.stringify(events))
	}

	return {
		events,
		addEvent,
	}
}

export default useCalendar
