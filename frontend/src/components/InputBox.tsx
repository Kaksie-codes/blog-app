
const InputBox = ({
  name, 
  type, 
  id, 
  value, 
  placeholder
} : {
  name: string,
  type: any,
  id: any,
  value:any,
  placeholder:string
}) => {
  return (
    <div className="relative w-[100%] mb-4 ">
        <input 
          name={name}
          type={type} 
          placeholder={placeholder}
          id={id}
          defaultValue={value}
          className=""          
          />
    </div>
  )
}

export default InputBox