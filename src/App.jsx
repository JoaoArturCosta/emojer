import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CalendarEvent from './pages/CalenderEvent'
import Home from './pages/Home'

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path=':hash' element={<CalendarEvent />} />
		</Routes>
	)
}

export default App
