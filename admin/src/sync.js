import { db } from "./configs/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const usersRef = collection(db,'Users');
const productsRef = collection(db,'Products');

export const addUser = async(user) => {
    try {
        await addDoc(usersRef,{
            uid: user.uid,
            role: 'admin'
        });
    } catch (error) {
        return {error: error};
    } 
};

export const updateOrder = async(order) => {
    try {
        await updateDoc(doc(db,"Orders",order.id),{
            deliveryStatus: order.deliveryStatus,
        });
    } catch (error) {
        return {error: error};
    }
};

export const updateProducts = async(product) => {
    try {
        await updateDoc(doc(db, "Products", product.id),{
            short_desc: product.shortDesc,
            features: product.features,
            specs: product.specs,
            imageurl_and_colors: product.imageurl_and_colors,
            price: product.price,
            stock: product.stock,
            timestamp: product.timestamp
        });
    } catch (error) {
        return {error: error};
    }
}

export const addProducts = async(product) => {
    try {
        let existing = null;
        await (await getDocs(query(productsRef, where('name','==',product.name)))).forEach((doc)=>existing=doc.data());
        if (existing) { return {error: 'Product name already exists'}};
        await addDoc(productsRef,{
            uid: product.uid,
            name: product.name,
            brand: product.brand,
            type: product.type,
            category: product.category,
            short_desc: product.shortDesc,
            features: product.features,
            specs: product.specs,
            imageurl_and_colors: product.imageurl_and_colors,
            price: product.price,
            stock: product.stock,
            timestamp: product.timestamp
        });
    } catch (error) {
        return {error: error};
    }   
};

export const deleteProduct = async(productid) => {
    try {
        await deleteDoc(doc(db, "Products", productid))
    } catch (error) {
        return { error: error}
    }
};

export const getUserRole = async(user) => {
    try {
        let userRole = null;
        const response =  await getDocs(query(usersRef, where('uid','==',user.uid)));
        response.forEach((doc)=>userRole = doc.data().role);
        if (!userRole) {return null;}
        if (userRole !== 'admin'){return {error:'User exists but not authorized to access this portal'};}
        return userRole;
    } catch (error) {
        return {error:error};
    }
};