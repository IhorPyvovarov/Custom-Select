import React from "react";

import styles from "./Layout.module.css"

interface LayoutInterface {
    elementLeft: React.ComponentElement<any, any>,
    elementRight: React.ComponentElement<any, any>
}

export const Layout: React.FC<LayoutInterface> = ({elementLeft, elementRight}) => {
    return (
        <main className={styles['main-wrapper']}>
            <div className={styles.column}>
                <h2>Single select</h2>
                {elementLeft}
            </div>
            <div className={styles.column}>
                <h2>Multiple select</h2>
                {elementRight}
            </div>
        </main>
    )
}