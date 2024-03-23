const storeInSession = (key:any, value:any) => {
    return sessionStorage.setItem(key, value);
}

const lookInSession = (key:any) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key:any) => {
    return sessionStorage.removeItem(key);
}

const logOutUser = () => {
    sessionStorage.clear();
}

export { storeInSession, lookInSession, removeFromSession, logOutUser };