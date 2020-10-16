import {fbAuthentication} from "./firebase";
import {firestoreSetUserData} from "./firestore";
import {DEFAULT_USER_FOLDERS} from "../constants/folders";

export function signInUserWithEmailAndPassword(email, password) {
    return fbAuthentication.signInWithEmailAndPassword(email, password)
}

export function signUpUserWithEmailAndPassword(email, password) {

    return fbAuthentication.createUserWithEmailAndPassword(email, password).then(() => {
        return firestoreSetUserData({cards: [], folders: DEFAULT_USER_FOLDERS})
    })

}

