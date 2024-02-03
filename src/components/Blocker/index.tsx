import React from 'react'
import styles from './Blocker.module.scss'
import { initSSOWidget } from "../../utils";

interface propsType {
    text: any; cta: any;
}
const handleLoginToggle = (): void => {
    initSSOWidget();
};

const Blocker = (props: propsType) => {
    const { text, cta } = props;
    return (
        <div className={styles.blockerContainer}>
            <p>{text}</p>
            <button onClick={handleLoginToggle}>{cta}</button>
        </div>
    )
}
export default Blocker;