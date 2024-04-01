import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setResetPageMode } from "../redux/auth/authSlice";


const VerifyOTP = ({ otpLength, email , maskedEmail}: { otpLength: number, email:string, maskedEmail:string }) => {
    const { resetPageMode } = useSelector((state:any) => state.auth);
    const [OTP, setOTP] = useState<string[]>(new Array(otpLength).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [resendingOTP, setResendingOTP] = useState<boolean>(false)
    const dispatch = useDispatch();

    // console.log('email', email);
    // console.log('OTP', OTP.join(""), typeof(OTP.join("")));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const { value } = e.target;

        if (isNaN(Number(value))) {
            return;
        }        

        const newOtp = [...OTP]

        // allow only one input
        newOtp[index] = value.substring(value.length - 1);

        setOTP(newOtp);
        
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
             setIsDisabled(false);
            }else {
                setIsDisabled(true); // OTP length is less than required length
            }
        }
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

    useEffect(() => {
        // Reset isDisabled state whenever OTP length changes
        setIsDisabled(OTP.join('').length !== otpLength);
    }, [OTP, otpLength]);

    const verifyOTP = async(e:React.FormEvent) => {
        e.preventDefault();

        try {
            // Submit the form data
            const res = await fetch(`/api/auth/verifyOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, OTP:OTP.join("") }),
            });
            
            const result = await res.json(); 
            const { success, message } = result
            if(success == false){
                toast.error(message)
            }else{
                toast.success(message);               
                setTimeout(() => {
                    dispatch(setResetPageMode('reset-password'));
                }, 3000)            
            }
            // console.log('result >>', result);
        } catch (err) {
            console.log('backend error >>', err);
            // toast.error(err?.data?.message)
        } finally {
            setIsDisabled(true);
        }
    }

    const sendOTP = async () => {
        setResendingOTP(true)
        try {
            // Submit the form data
            const res = await fetch(`/api/auth/generateOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email}),
            });
            
            const result = await res.json(); 
            const { success, message } = result
            if(success == false){
                toast.error(message);
                setResendingOTP(false);
            }else{
                toast.success(message); 
                setResendingOTP(false);                         
            }
            console.log('result >>', result);
        } catch (err) {
            console.log('backend error >>', err);
            setResendingOTP(false);
            // toast.error(err?.data?.message)
        } 
    }

    return (
        <div className={`text-center ${resetPageMode == 'verify-OTP' ? 'block' : 'hidden'}`}>
            <form onSubmit={verifyOTP}>
                <h1 className="text-4xl  font-gelasio font-bold">OTP verification</h1>
                <p>code has been sent to {maskedEmail}</p>
                <div className=" my-[30px] mx-0 flex gap-[30px] items-center justify-center">
                    {
                        OTP.map((value, index) => (
                            <input key={index}
                                ref={(input) => inputRefs.current[index] = input}
                                type="text"
                                className="w-16 h-16 text-4xl text-center border border-black rounded-lg focus:border-[2px] focus:outline-red"
                                onChange={(e) => handleChange(e, index)}
                                value={value}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onClick={() => handleClick(index)}
                            />
                        ))
                    }
                </div>
                
                <button
                    className={`bg-red py-4 px-12 ${isDisabled ? 'cursor-not-allowed bg-red/50' : 'cursor-pointer'} text-white mt-4 text-[18px]`}
                    disabled={isDisabled}>
                    Verify
                </button>
            </form>
            <p className="mt-4">
                Didn't get the OTP,
                <button 
                    onClick={sendOTP}
                    disabled={resendingOTP}
                    className={`"underline hover:text-red ml-3 ${resendingOTP ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >   
                    Resend
                </button>
            </p>
        </div>
    )
}

export default VerifyOTP;
