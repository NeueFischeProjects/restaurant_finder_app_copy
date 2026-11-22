import {Route, Routes} from 'react-router-dom'
import WelcomePage from './component/WelcomePage.tsx'
import AddNewRestaurant from './component/AddNewRestaurant.tsx'
import RestaurantDetails from './component/RestaurantDetails.tsx'
import EditRestaurant from './component/EditRestaurant.tsx'
import axios from "axios";
import {useEffect, useState} from "react";

export default function App() {
    // undefined = wird geprüft, null = nicht eingeloggt, string = GitHub-Name
    const [user, setUser] = useState<string | null | undefined>(undefined)

    useEffect(() => {
        axios.get<string>('/api/auth/me')
            .then((response) => setUser(response.data))
            .catch(() => setUser(null))
    }, [])

    function login() {
        // Im Dev-Modus (Vite auf 5173) liegt das Backend auf 8080, sonst auf derselben Adresse
        const host = window.location.port === '5173' ? 'http://localhost:8080' : window.location.origin
        window.location.href = host + '/oauth2/authorization/github'
    }

    function logout() {
        axios.post('/api/auth/logout').then(() => setUser(null))
    }

    if (user === undefined) {
        return <main><p>Lade …</p></main>
    }

    if (user === null) {
        return (
            <main>
                <h1>Restaurant Finder</h1>
                <p>Bitte melde dich an, um die Restaurants zu sehen.</p>
                <button type="button" onClick={login}>Mit GitHub anmelden</button>
            </main>
        )
    }


    return (
        <main>
            <h1>Restaurant Finder</h1>
            <p>
                Angemeldet als <strong>{user}</strong>{' '}
                <button type="button" onClick={logout}>Abmelden</button>
            </p>
            
            <Routes>
                <Route path="/" element={<WelcomePage/>}/>
                <Route path="/addNewRestaurant" element={<AddNewRestaurant/>}/>
                <Route path="/restaurantDetails" element={<RestaurantDetails/>}/>
                <Route path="/editRestaurant/:id" element={<EditRestaurant/>}/>
            </Routes>

            <footer>
                <p>© 2026 Group 2 | HePaZa</p>
            </footer>
        </main>
    )
}