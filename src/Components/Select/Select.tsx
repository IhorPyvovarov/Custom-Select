import React, {useState, useEffect, useRef, MouseEventHandler, Key} from 'react'

import styles from './Select.module.css'

export type SelectOption = {
    label: string,
    value: string
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption,
    onChange: (value: SelectOption | undefined) => void
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[],
    onChange: (value: SelectOption[]) => void
}

type SelectProps = {
    optionsConst: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export const Select = ({multiple, value, onChange, optionsConst}: SelectProps) => {
    const [options, setOptions] = useState(optionsConst)
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    function toggleShowing() {
        setIsOpen(prev => !prev)
        setFilter('')
    }

    function selectOption(option: SelectOption) {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter((o) => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    function clearOptions(event: React.MouseEvent) {
        event.stopPropagation()
        multiple ? onChange([]) : onChange(undefined)
    }

    function isSelectedOption(option: SelectOption) {
        if (multiple) return value.includes(option)
        return option === value
    }

    function displayValue() {
        if (multiple) {
            return optionsConst.map((option) => {
                return value.includes(option) && <button key={option.value}
                                                         className={styles['option-badge-btn']}
                                                         onClick={(e) => {
                                                             e.stopPropagation()
                                                             selectOption(option)
                                                         }}>
                    {option.label}
                    <span className={styles['remove-btn']}>&times;</span>
                </button>
            })
        }
        return value?.label
    }

    function blurContainerHandler(e: React.FocusEvent) {
        if (e.relatedTarget?.dataset.fieldType === 'filter') return
        setIsOpen(false)
    }

    useEffect(() => {
        const filteredOptions = optionsConst.filter(({label}) => label.toLowerCase().indexOf(filter) === 0)
        setOptions(filteredOptions)
    }, [filter]);


    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
            }
        }
        containerRef.current?.addEventListener("keydown", handler)
        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }
    }, [isOpen, highlightedIndex, options])

    return (
        <div ref={containerRef}
             tabIndex={0}
             className={styles.container}
             onClick={toggleShowing}
             onBlur={(e) => blurContainerHandler(e)}>

            <span className={styles.value}>{displayValue()}</span>
            <div className={styles.caret}></div>
            <div className={styles.divider}></div>

            <button
                className={styles["clear-btn"]}
                onClick={(e) => clearOptions(e)}
            >&times;</button>

            <div className={`${styles['options-wrapper']} ${isOpen ? styles.show : ""}`}>
                   <input
                       type="text"
                       id="filter"
                       className={`${styles['filter-input']} ${styles['filter-input__mb']}`}
                       placeholder="Filter"
                       onClick={(e) => e.stopPropagation()}
                       onBlur={(e) => e.stopPropagation()}
                       onChange={(e) => setFilter(e.target.value)}
                       value={filter}
                       data-field-type="filter" />

                <ul className={`${styles.options}`}>
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            className={`${styles.option} ${highlightedIndex === index && styles.highlighted} ${isSelectedOption(option) && styles.selected}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                selectOption(option)
                                !multiple && setIsOpen(false)
                            }}
                            onMouseEnter={() => {
                                setHighlightedIndex(index)
                            }}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}