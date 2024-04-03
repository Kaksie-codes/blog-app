import { useState } from "react"

const InputBox = ({
  name, 
  type, 
  // id, 
  onChange,
  value, 
  placeholder,  
  icon,
  errorMessage
} : {
  name: string,
  type: any,
  // id: any,
  onChange: any,
  value:any,
  placeholder:string, 
  icon:string,
  errorMessage?:string
}) => {
  const [passwordVisible, setPassWordVisible] = useState<boolean>(false);

  return (
    <div className="pb-5 relative">
      <div className="relative w-[100%]">
          <input
            name={name}
            type={type === 'password' ? passwordVisible ? 'text' : "password" : type}
            placeholder={placeholder}
            // id={id}
            onChange={onChange}
            value={value}
            className={`w-full ${errorMessage?.length ? 'border-red' : 'border-grey'} bg-grey focus:bg-transparent ${type === 'password' ? 'pr-12' : ''} w-[100%] rounded-md p-4  pl-12 border placeholder:text-black`}
            />
            <i className={`fi ${icon} absolute input-icon`}></i>
          <div className="cursor-pointer">
            {
              type === 'password' && <i className={`"fi ${passwordVisible ? 'fi-rr-eye' : 'fi-rr-eye-crossed'} input-icon left-[auto] right-4 cursor-pointer"`} onClick={() => setPassWordVisible(!passwordVisible)}></i>
            }
          </div>
      </div>
      {errorMessage && <p className="text-[#ff3860] absolute -bottom-[2px]">{errorMessage}</p>}
    </div>
  )
}

export default InputBox