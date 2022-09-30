import {useState} from 'react';

import {Layout} from "./Components/UI/Layout";
import {Select, SelectOption} from "./Components";
import { OPTIONS } from './data/data'

import './App.css'

function App() {
    const [valueSingle, setValueSingle] = useState<SelectOption | undefined>(OPTIONS[0])
    const [valueMultiple, setValueMultiple] = useState<SelectOption[]>([OPTIONS[0]])

    const elementLeft = <Select
        optionsConst={OPTIONS}
        value={valueSingle}
        onChange={o => setValueSingle(o)}/>
    const elementRight = <Select
        multiple
        optionsConst={OPTIONS}
        value={valueMultiple}
        onChange={o => setValueMultiple(o)}/>

    return (
        <Layout
            elementLeft={elementLeft}
            elementRight={elementRight}
        />
    )
}

export default App
