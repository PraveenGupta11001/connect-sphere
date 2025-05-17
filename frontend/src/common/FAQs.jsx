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
              className='pt-2 flex justify-between lg:justify-start text-indigo-500 font-semibold cursor-pointer'
              onClick={() => toggleAnswer(item.answer)}
            >
              <h3>
                Q{i + 1}. {item.question}
              </h3>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {isOpen && (
              <div className='pb-2 md:text-md flex justify-between'>
                <p className='m-2'>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
