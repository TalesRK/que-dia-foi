import { useEffect, useState } from 'react'
import './App.css'

const LOCAL_STORAGE_KEY = 'last-guessed-dates'
const DAY_NAMES = {
    0: 'Domingo',
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
}

function App() {
    const [form, setForm] = useState({
        selectedDay: -1,
        selectedDate: createRandomDate(),
    })
    const [results, setResults] = useState([])

    useEffect(() => {
        const lastSavedData = localStorage.getItem(LOCAL_STORAGE_KEY)

        if (lastSavedData) {
            const preMappedData = JSON.parse(lastSavedData)

            setResults(
                preMappedData.map((item) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    guessedDate: new Date(item.guessedDate),
                }))
            )
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results))
    }, [results])

    function clearHistory() {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        setResults([])
    }

    function createRandomDate() {
        const start = new Date(2000, 0, 1)
        const end = new Date(2050, 12, 31)
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )
    }

    function handleDateChange(value) {
        const dateParts = value.split('-')
        const updatedValue = new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2]
        )

        setForm({
            ...form,
            selectedDate: updatedValue,
        })
    }

    function createNewValue() {
        setForm((oldForm) => ({
            ...oldForm,
            selectedDate: createRandomDate(),
            selectedDay: -1,
        }))
    }

    async function handleDayChange(value) {
        setForm((oldForm) => ({
            ...oldForm,
            selectedDay: value,
        }))

        await setResults((oldResults) => [
            {
                createdAt: new Date(),
                guessedDate: form.selectedDate,
                guessedDay: value,
                correctDay: form.selectedDate.getDay() + '',
            },
            ...oldResults,
        ])
    }

    return (
        <div className="App">
            <div className="content">
                <div className="input-session session">
                    <div className="input">
                        <button onClick={() => createNewValue()}>Gerar</button>
                    </div>
                    <div className="input">
                        <input
                            type="date"
                            value={form.selectedDate
                                .toISOString()
                                .substring(0, 10)}
                            onChange={(event) =>
                                handleDateChange(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <select
                            value={form.selectedDay}
                            onChange={(event) =>
                                handleDayChange(event.target.value)
                            }
                        >
                            <option disabled value={-1}>
                                ---Selecionar---
                            </option>
                            <option value={0}>{DAY_NAMES[0]}</option>
                            <option value={1}>{DAY_NAMES[1]}</option>
                            <option value={2}>{DAY_NAMES[2]}</option>
                            <option value={3}>{DAY_NAMES[3]}</option>
                            <option value={4}>{DAY_NAMES[4]}</option>
                            <option value={5}>{DAY_NAMES[5]}</option>
                            <option value={6}>{DAY_NAMES[6]}</option>
                        </select>
                    </div>
                    <div className="input">
                        <button onClick={() => clearHistory()}>Limpar</button>
                    </div>
                </div>
                <div className="results-session session">
                    <div className="results-header">
                        <div className="line-item">Momento da tentativa:</div>
                        <div className="line-item">Data selecionada:</div>
                        <div className="line-item">Dia correto: </div>
                        <div className="line-item">Dia chutado: </div>
                        <div className="line-item">Resultado: </div>
                    </div>
                    <div className="results-list">
                        {results.map((item, index) => (
                            <div
                                className="result-line"
                                key={`${
                                    item.createdAt.toLocaleString() + index
                                }`}
                            >
                                <div className="line-item">{`${item.createdAt.toLocaleString()}`}</div>
                                <div className="line-item">
                                    {`${item.guessedDate.toLocaleDateString()}`}
                                </div>
                                <div className="line-item">
                                    {DAY_NAMES[item.correctDay]}
                                </div>
                                <div className="line-item">
                                    {DAY_NAMES[item.guessedDay]}
                                </div>
                                {item.correctDay === item.guessedDay ? (
                                    <div
                                        style={{ color: 'green' }}
                                        className="line-item"
                                    >
                                        Acertou
                                    </div>
                                ) : (
                                    <div
                                        className="line-item"
                                        style={{ color: 'red' }}
                                    >
                                        Errou
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
