import React from 'react';

const aiInterviewBenefits = [
    "Realistic Practice",
    "Actionable Feedback",
    "Maximum Impact",
    "Tailored to Your Industry",
    "Voice & Tone Analysis",
    "Confidence Building",
    "Performance Tracking"
];

const vibrantColors = [
    'from-emerald-400 to-emerald-600', 
    'from-rose-400 to-rose-600',    
    'from-amber-400 to-amber-600',   
    'from-blue-500 to-blue-700',   
    'from-fuchsia-400 to-fuchsia-600', 
    'from-purple-500 to-purple-700',  
    'from-cyan-400 to-cyan-600',    
];

const SubBanner = () => {
    return (
        <section className='flex-wrap hidden md:flex justify-center gap-4 md:gap-6 px-4 mt-10 md:mt-16'>
            {
                aiInterviewBenefits.map((item, index) => (
                    <div
                        key={index}
                        className={`relative group overflow-hidden rounded-full px-5 py-3 bg-gradient-to-r ${vibrantColors[index]} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                    >
                        <span className="text-white font-bold text-lg relative z-10">
                            {item}
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                ))
            }
        </section>
    );
};

export default SubBanner;