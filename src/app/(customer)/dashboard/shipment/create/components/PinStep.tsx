'use client';

import { useState } from 'react';
import SuccessModalProps from './SuccessModal';

interface PinStepProps {
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onBack: () => void;
}

export default function PinStep({
  pin,
  setPin,
  onNext,
  onBack,
}: PinStepProps) {

 

  const addDigit = (digit: string) => {
    if (pin.length >= 6) return;

    setPin((prev) => prev + digit);
  };

  const removeDigit = () => {
    setPin((prev) => prev.slice(0, -1));
  };

const continueHandler = () => {
  onNext();
};



  return (
    <>



      <div className="flex flex-col justify-between h-full">

        <div>

          <h2 className="text-2xl font-black text-center">
            Create Verification PIN
          </h2>

          <p className="text-center text-sm text-neutral-500 mt-2">
            This PIN will be required before the rider releases
            the package.
          </p>

          <div className="flex justify-center gap-3 mt-10">

            {Array.from({ length: 6 }).map((_, index) => (

              <div
                key={index}
                className={`w-12 h-14 rounded-xl border flex items-center justify-center text-xl font-bold
                  ${
                    pin[index]
                      ? 'border-green-600 bg-green-50'
                      : 'border-neutral-200'
                  }`}
              >
                {pin[index] ? '•' : ''}
              </div>

            ))}

          </div>

        </div>

        <div>

          <div className="grid grid-cols-3 gap-4">

            {['1','2','3','4','5','6','7','8','9'].map((number) => (

              <button
                key={number}
                onClick={() => addDigit(number)}
                className="h-14 rounded-full hover:bg-neutral-100 text-xl font-bold transition"
              >
                {number}
              </button>

            ))}

            <div />

            <button
              onClick={() => addDigit('0')}
              className="h-14 rounded-full hover:bg-neutral-100 text-xl font-bold"
            >
              0
            </button>

            <button
              onClick={removeDigit}
              className="h-14 rounded-full hover:bg-neutral-100 text-xl"
            >
              ⌫
            </button>

          </div>

          <button
            disabled={pin.length !== 6}
            onClick={continueHandler}
            className={`w-full mt-8 py-4 rounded-xl font-bold transition
            ${
              pin.length === 6
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>

        </div>

      </div>

    </>
  );
}