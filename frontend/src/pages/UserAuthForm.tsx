import InputBox from "../components/InputBox"


const UserAuthForm = ({type}: {type:string}) => {
  return (
    <div className="h-cover flex items-center justify-center">
        <form action="" className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center  mb-24 ">
                {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
            </h1>
            {
                type !== 'sign-in' ? 
                <InputBox 
                    name="fullname"
                    type='text'
                    placeholder="fullname"
                    id='23'
                    value='du'/> : 
                <h1>Goat</h1>
            }
        </form>
    </div>
  )
}

export default UserAuthForm 