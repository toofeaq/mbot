import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Disclosure, Transition } from '@headlessui/react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="w-full px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <ChevronDown
              className={`h-5 w-5 text-[#822378] transition-transform ${
                open ? 'transform rotate-180' : ''
              }`}
            />
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-6 pb-4">
              {children}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}