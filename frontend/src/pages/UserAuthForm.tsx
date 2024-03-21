import { Link } from "react-router-dom"
import InputBox from "../components/InputBox"
import GoogleIcon from '../imgs/google.png'
import AnimationWrapper from "../common/page-animation"
import { useState } from "react"

const UserAuthForm = ({type}: {type:string}) => {
    const [formData, setformData] = useState({
        fullname: "",
        username: "", 
        email:"", 
        password:"", 
        passwordCheck:""}); 

    const [validationErrors, setValidationErrors] = useState({
        fullname: "",
        username: "", 
        email:"", 
        password:"", 
        passwordCheck:""
    })

    // let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    // let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleChange = (e:any) => {        
        const { value, id } = e.target;
        setformData({            
              ...formData,
              [id]: value.trim()                 
          }) 
    }
    
    const validateForm = () => { 
        let errors = {};

    // Check each field for emptiness
    Object.keys(formData).forEach(field => {
        if (!formData[field].trim()) {
            errors[field] = 'Field cannot be empty';
        }
    });

    // Check if passwords match
    if (type === 'sign-up' && formData.password !== formData.passwordCheck) {
        errors.passwordCheck = 'Passwords do not match';
    }

    // Set validation errors state
    setValidationErrors(errors);

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        validateForm();
        let serverRoute = type === 'sign-in' ? '/signin' : '/signup'
        

        try{ 
            const res = await fetch(`/api/auth${serverRoute}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to submit form');
            }

            const data = await res.json();
            console.log('data >>', data);
            // userAuthThroughServer(serverRoute, formData);
        }catch(err){
            console.log('error >>', err)
        }

    
    }

  return (
    <AnimationWrapper keyValue={type} className="">
        <section className="h-cover flex items-center justify-center">
            {/* <Toaster/> */}
            <div className="w-[80%] max-w-[400px]">
                <form className="w-full" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center  mb-24 ">
                        {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
                    </h1>
                    {
                        type !== 'sign-in' ? (
                            <>
                                <InputBox
                                    classNames={`bg-grey border-[#ff3860] focus:bg-transparent`}
                                    name="fullname"
                                    type='text'
                                    placeholder="Full name"
                                    id='fullname'
                                    onChange={handleChange}
                                    icon="fi-rr-user"
                                    value={formData.fullname}
                                    errorMessage={validationErrors.fullname}
                                />
                                <InputBox
                                    classNames={`bg-grey border-[#09c372] focus:bg-transparent`}
                                    name="username"
                                    type='text'
                                    placeholder="Username"
                                    id='username'
                                    onChange={handleChange}
                                    icon="fi-rr-user"
                                    value={formData.username}
                                    errorMessage={validationErrors.username}
                                />
                            </>
                        ) : (
                            null
                        )
                
                    }
                    <InputBox
                        classNames={`bg-grey border-grey focus:bg-transparent`}
                        name="email"
                        type='email'
                        placeholder="Email"
                        id='email'
                        onChange={handleChange}
                        icon="fi-rr-envelope"
                        value={formData.email}
                        errorMessage={validationErrors.email}
                    />
                    <InputBox
                        classNames={`bg-grey border-grey focus:bg-transparent`}
                        name="password"
                        type='password'
                        placeholder="Password"
                        id='password'
                        onChange={handleChange}
                        icon="fi-rr-key"
                        value={formData.password}
                        errorMessage={validationErrors.password}
                    />
                        {
                            type !== 'sign-in' && (
                                <InputBox
                                    classNames={`bg-grey border-grey focus:bg-transparent`}
                                    name="password"
                                    type='password'
                                    placeholder="Confirm Password"
                                    id='passwordCheck'
                                    onChange={handleChange}
                                    icon="fi-rr-key"
                                    value={formData.passwordCheck}
                                    errorMessage={validationErrors.passwordCheck}
                                />
                            )
                        }
                    <button
                        type="submit"
                        className="btn-dark center mt-14"
                        // onClick={handleSubmit}
                    >{type.replace('-', ' ')}</button>
                                       
                </form>
                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black"/>
                        <hr className="w-1/2 border-black"/>
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        Continue with Google
                        <img src={GoogleIcon} alt="google icon" className="w-5" />
                    </button> 
                {
                        type === 'sign-in' ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account ?
                            <Link to={'/signup'} className="underline text-black text-xl ml-1">
                                Join us today
                            </Link>
                        </p>
                        ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member ?
                            <Link to={'/signin'} className="underline text-black text-xl ml-1">
                                Sign in here.
                            </Link>
                        </p>
                        )
                    }
            </div>
        </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm 