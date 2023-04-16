import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CalendarProvider } from './context/context'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<CalendarProvider>
			<Router>
				<App classname='w-screen' />
			</Router>
		</CalendarProvider>
	</React.StrictMode>
)
