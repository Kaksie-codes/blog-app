import React, { useEffect, useRef, useState } from "react";

let currentOTPindex: number = 0
const VerifyOTP = ({ otpLength }: { otpLength: number }) => {
    const [OTP, setOTP] = useState<string[]>(new Array(otpLength).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const { value } = e.target;

        if (isNaN(Number(value))) {
            return;
        }

        const newOtp = [...OTP]

        // allow only one input
        newOtp[index] = value.substring(value.length - 1);

        setOTP(newOtp);
        console.log('Otp>>', OTP);
        console.log('newOtp>>', newOtp)

        

        // // move to the next input if current field is filled
        // if (value && index < otpLength && inputRefs.current[index + 1]) {
        //     inputRefs.current[index + 1]?.focus(); // Null check before accessing focus method
        // }

         // Find the next empty input field and focus on it
    let nextEmptyIndex: number | null = null;
    for (let i = 0; i < otpLength; i++) {
        if (!newOtp[i]) {
            nextEmptyIndex = i;
            break;
        }
    }

    if (nextEmptyIndex !== null) {
        inputRefs.current[nextEmptyIndex]?.focus();
    } else {
        // All fields are filled, proceed to submit the OTP
        const combinedOTP = newOtp.join('');
        if (combinedOTP.length === otpLength) {
            handleOTPSubmit(Number(combinedOTP))
        }
    }

        // // submit Trigger
        // const combinedOTP = newOtp.join('');
        // if (combinedOTP.length === 4) {
        //     handleOTPSubmit(Number(combinedOTP))
        // }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const { key } = e;
        if (key === 'Backspace' && !OTP[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus(); // Null check before accessing focus method
        }
    }

    const handleClick = (index: number) => {
        inputRefs.current[index]?.setSelectionRange(1, 1); // Null check before accessing setSelectionRange

        // more validation
        if (index && !OTP[index - 1]) {
            inputRefs.current[OTP.indexOf("")]?.focus(); // Null check before accessing focus method
        } 
    }

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus(); // Null check before accessing focus method
        }
    }, [])

    const handleOTPSubmit = (otp: number) => {
        console.log('login successful', otp)
    }

    return (
        <form>
            <h1>OTP verification</h1>
            <p>code has been sent to n***k***.com</p>
            <div>
                {
                    OTP.map((value, index) => (
                        <input key={index}
                            ref={(input) => inputRefs.current[index] = input}
                            type="text"
                            className="w-12 h-12 border border-red"
                            onChange={(e) => handleChange(e, index)}
                            value={value}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onClick={() => handleClick(index)}
                        />
                    ))
                }
            </div>
        </form>
    )
}

export default VerifyOTP;
