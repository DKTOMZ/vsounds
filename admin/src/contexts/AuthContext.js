import { browserSessionPersistence, browserLocalPersistence, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import {createContext, useContext, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {auth, db} from "../configs/firebase";
import { setOrders, setProducts, setUsersCount } from '../redux/store';
import { addUser, getUserRole } from '../sync';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [currentAdmin, setCurrentAdmin] = useState();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const registerAdmin = async(email,password) => {
        let user = null;
        try {
            user =  await createUserWithEmailAndPassword(auth,email,password);
            await signOut(auth);
            const addResponse = await addUser({uid : user.user.uid});
            if (addResponse) {return {error:'Something went wrong. Try again'};}
            await sendEmailVerification(user.user);
            return {verifyEmail:'Please check email/spam folder to verify your account then login'};
        } catch (error) {
            return {error: error.code}
        }
    };
    
    const loginWithGoogle = async() => {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        try {
            const UserCredential = await signInWithPopup(auth,provider);
            const roleResponse = await getUserRole({uid: UserCredential.user.uid});
            if (roleResponse.error) {
                await signOut(auth);
                return {error:roleResponse.error};
            }
            if (!roleResponse) {
                const addResponse = await addUser({uid: UserCredential.user.uid});
                if (addResponse.error) {
                    await signOut(auth);
                    return {error:'Something went wrong. Try again'};
                }
            }
            return 'Logged in';
        } catch (error) {
            return {error: error.code}
        }
    };

    const loginAdmin = async(email,password,persistence=null) => {
        try {
            persistence 
            ? await setPersistence(auth,browserLocalPersistence)
            : await setPersistence(auth,browserSessionPersistence);
        } catch (error) {
            return {error: error.code}
        }

        let user = null;

        try {
            user = await signInWithEmailAndPassword(auth,email,password);
            const roleResponse = await getUserRole({uid: user.user.uid});
            if (roleResponse.error) {
                await signOut(auth);
                return {error:roleResponse.error};
            }
            if (user.user.emailVerified) {return 'Logged in'}
            await sendEmailVerification(user.user);
            await signOut(auth);
            return {verifyEmail:'Please check email/spam folder to verify your account then login'};
        } catch (error) {
            return {error: error.code}
        }

    };

    const resetAdminPassword = async(email) => {
        try {
            await sendPasswordResetEmail(auth,email);
            return {resetEmail:'Please check email/spam folder to reset your account password then login'};
        } catch (error) {
            return {error: error.code};
        }
    };

    const updateAdminProfile = async(photoURL=null,name=null,password=null,) => {
        if (password) {
            try {
                await updatePassword(auth.currentUser,password);    
            } catch (error) {
                return {passworderror:error.code};
            }
        }
        try {
            await updateProfile(auth.currentUser,{
                displayName: name,
                photoURL: photoURL
            });
        } catch (error) {
            return {profileerror:error.code};
        }
    };

    const logOutAdmin = async() => {
        try {
            await signOut(auth);
            return;
        } catch (error) {
            return {error: error.code};
        }
    };

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((user)=>{
            setCurrentAdmin(user);
            setLoading(false);
        });
        return unsubscribe;
    },[currentAdmin]);

    useEffect(()=>{
        if (!currentAdmin) {return ;}
        const unsubscribe = onSnapshot(collection(db,'Products'),(snapshot)=>{
            dispatch(setProducts(snapshot.docs.map((doc)=>{
            let id = doc.id; let data = doc.data();
            return { id: id, ...data}
            })));
        },async(error)=>{
            if (error) {return}
        });
        return unsubscribe;
    },[currentAdmin]);

    useEffect(()=>{
        if (!currentAdmin) {return ;}
        const unsubscribe = onSnapshot(collection(db,'Orders'),(snapshot)=>{
            dispatch(setOrders(snapshot.docs.map((doc)=>{
                let id = doc.id; let data = doc.data();
                return { id: id, ...data}
                })));
        },async(error)=>{
            if (error) {return}
        });
        return unsubscribe;
    },[currentAdmin]);

    useEffect(()=>{
        if (!currentAdmin) {return ;}
        const unsubscribe = onSnapshot(collection(db,'Users'),(snapshot)=>{
            dispatch(setUsersCount(snapshot.docs.filter((doc)=>doc.data().role === 'customer').length));
        },async(error)=>{
            if (error) {return}
        });
        return unsubscribe;
    },[currentAdmin]);

    const localUser = {registerAdmin,loginWithGoogle,loginAdmin,resetAdminPassword,updateAdminProfile,logOutAdmin,currentAdmin};

    return (
        <AuthContext.Provider value={localUser}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

