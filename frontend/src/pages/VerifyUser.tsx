import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";


const VerifyUser = () => {
    const [isVerified, setIsverified] = useState(false);
    const{ token }= useParams();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`/api/auth/verifyUser?token=${token}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                setIsverified(true);
            } catch (error) {
                setIsverified(false);
            }
        }

        verifyUser();
    }, [])
  return (
    <>
        {
            isVerified ? (
                <div>
                    User Verified
                </div>
            ) : (
                <div>
                    user not verified
                </div>
            )
        }
    </>
  )
}

export default VerifyUser