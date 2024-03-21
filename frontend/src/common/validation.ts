// export default function validation ({ values }: { values:any }){
//     const errors = {};

//     let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
//     let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//     if(values.fullname === ''){
//         errors.name = 'Name is required';
//     }

//     if(values.email === ''){
//         errors.email = 'Email is required';
//     } 
//     else(!emailRegex.test(values.email)){
//         errors.email = 'Invalid Email'
//     }
// }