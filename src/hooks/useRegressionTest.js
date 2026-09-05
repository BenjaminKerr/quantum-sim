import { performRegressionTest } from "../lib/performRegressionTest.js";
import { useState } from "react";

export function useRegressionTest() {
    const [result, setResult] = useState(false);

    function runTest() {
        setResult( performRegressionTest(true) );
    }

    return { result, runTest };
}