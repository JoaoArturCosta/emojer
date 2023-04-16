import { createContext, useState } from 'react'

export const CalendarContext = createContext()

/**Context for calendar events, to share state globally. Saves
 * events to local storage to persist through sessions
 */
export const CalendarProvider = ({ children }) => {
	const [events, setEvents] = useState(
		JSON.parse(window.localStorage.getItem('emojer-events'))
	)

	return (
		<CalendarContext.Provider value={{ events, setEvents }}>
			{children}
		</CalendarContext.Provider>
	)
}
