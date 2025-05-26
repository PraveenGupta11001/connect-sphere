import React, { useState } from 'react';
import { faq_question } from '../Data/faq_questions';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQs() {
  const [expanded, setExpanded] = useState('');

  const toggleAnswer = (answer) => {
    setExpanded(prev => (prev === answer ? '' : answer));
  };

  return (
    <div className='w-full lg:w-[70%] m-2 md:text-xl flex flex-col'>
      <h1 className='ml-4 pt-4 mb-2 text-xl lg:text-2xl text-indigo-500 font-bold'>
        FAQs (Frequently Asked Questions)
      </h1>

      {faq_question.faqs.slice(0, 3).map((item, i) => {
        const isOpen = expanded === item.answer;

        return (
          <div className='mx-8' key={i}>
            <div
              className='pt-2 grid grid-cols-[95%_1fr] md:grid-cols-[90vw_10vw] lg:grid-cols-[80vw_1fr]  text-indigo-500 font-semibold cursor-pointer transition-all'
              onClick={() => toggleAnswer(item.answer)}
            >
              <h3 className=''>
                Q{i + 1}. {item.question}
              </h3>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {isOpen && (
              <div className='pb-2 md:text-md flex justify-between border border-transparent border-b-indigo-500'>
                <p className='m-2'>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
