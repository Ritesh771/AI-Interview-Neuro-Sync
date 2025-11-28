"use client";

import React, { useState } from 'react'
import InterviewOverlay from './interview-overlay';
import InterviewCall from './interview-call';


type InterviewContetProps = {
    data: any
}

const InterviewContent = (data: InterviewContetProps) => {
    const [startInterview, setStartInterview] = useState(false);
    const handleStartInterview = () => setStartInterview(true);

    return (
        <>
            {!startInterview && <InterviewOverlay handleStartInterview={handleStartInterview} />}
            <InterviewCall startInterview={startInterview} InterViewData={data} />
        </>

    )
}

export default InterviewContent