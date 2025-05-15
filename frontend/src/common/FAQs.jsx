import React, { useState } from 'react'
import { faq_question } from '../Data/faq_questions';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQs() {
    let [expandAns, setExpandAns] = useState('');

    return(
        <div className='w-[100%] lg:w-[70%]  m-2 md:text-xl flex flex-col'>
            <h1 className='ml-4 pt-4 mb-2 text-2xl text-indigo-500 font-bold '>FAQs(Frequently Asked Questions)</h1>
            {faq_question.faqs.map( (item, i) => (
                <div className='mx-8' key={i}>
                    <div className='pt-2 flex justify-between lg:justify-start text-indigo-500 font-semibold'>
                        <h3 className=''>Q{i+1} {item.question}</h3>
                        {expandAns!==item.answer?<ChevronDown onClick={()=>setExpandAns(item.answer)}/>:<ChevronUp onClick={()=>setExpandAns('')}/>}
                    </div>
                    <div className='pb-2 md:text-md  flex justify-between'>
                        {expandAns==item.answer?<p className=' m-2'>{item.answer}</p>:''}
                    </div>
                </div>
                
            ))}
        
        </div>
    )
}