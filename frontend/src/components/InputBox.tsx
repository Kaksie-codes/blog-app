import { useState } from "react"

const InputBox = ({
  name, 
  type, 
  id, 
  // value, 
  placeholder,
  icon
} : {
  name: string,
  type: any,
  id: any,
  // value:any,
  placeholder:string,
  icon:string
}) => {
  const [passwordVisible, setPassWordVisible] = useState<boolean>(false);

  return (
    <div className="relative w-[100%] mb-4 ">
        <input 
          name={name}
          type={type === 'password' ? passwordVisible ? 'text' : "password" : type} 
          placeholder={placeholder}
          id={id}
          // defaultValue={value}
          className={`input-box ${type === 'password' ? 'pr-12' : ''}`}          
          />
          <i className={`fi ${icon} absolute input-icon`}></i>
        {
          type === 'password' && <i className={`"fi ${passwordVisible ? 'fi-rr-eye' : 'fi-rr-eye-crossed'} input-icon left-[auto] right-4 cursor-pointer"`} onClick={() => setPassWordVisible(!passwordVisible)}></i>
        }
    </div>
  )
}

export default InputBox