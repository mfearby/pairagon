import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MantineProvider
                defaultColorScheme="dark"
                theme={{
                    colors: {
                        dark: [
                            '#C1C2C5',
                            '#A6A7AB',
                            '#909296',
                            '#5C5F66',
                            '#373A40',
                            '#2C2E33',
                            '#25262B',
                            '#0c1e36',
                            '#141517',
                            '#0b1e3e',
                        ],
                    },
                    primaryShade: { dark: 9 },
                }}
            >
                <ModalsProvider>
                    <Notifications />
                    <App />
                </ModalsProvider>
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
)
