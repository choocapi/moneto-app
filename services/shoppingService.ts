import { deleteDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { ResponseType, ShoppingType } from "@/types";
import { collection, doc, setDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";

export const createOrUpdateShopping = async (
  shoppingData: Partial<ShoppingType>
): Promise<ResponseType> => {
  try {
    let shoppingToSave = { ...shoppingData };

    if (!shoppingData?.id) {
      // new shopping item
      shoppingToSave.name = shoppingData.name || "";
      shoppingToSave.price = shoppingData.price || 0;
      shoppingToSave.description = shoppingData.description || "";
      shoppingToSave.quantity = shoppingData.quantity || 1;
      shoppingToSave.bought = shoppingData.bought || false;
      shoppingToSave.isUrgent = shoppingData.isUrgent || false;
      shoppingToSave.uid = shoppingData.uid;
      shoppingToSave.created = new Date();
    }

    // include wallet id if updating
    const shoppingRef = shoppingData?.id
      ? doc(firestore, "shoppings", shoppingData?.id)
      : doc(collection(firestore, "shoppings"));

    await setDoc(shoppingRef, shoppingToSave, { merge: true }); // update data
    return { success: true, data: { ...shoppingToSave, id: shoppingRef.id } };
  } catch (error: any) {
    console.log("error creating or updating shopping: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteShopping = async (
  shoppingId: string
): Promise<ResponseType> => {
  try {
    const shoppingRef = doc(firestore, "shoppings", shoppingId);
    await deleteDoc(shoppingRef);

    return { success: true, msg: "Đã xóa mục mua sắm thành công" };
  } catch (error: any) {
    console.log("error deleting shopping: ", error);
    return { success: false, msg: error.message };
  }
};

export const clearShoppingList = async (uid: string): Promise<ResponseType> => {
  try {
    const shoppingRef = collection(firestore, "shoppings");
    const q = query(shoppingRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true, msg: "Đã xóa toàn bộ danh sách mua sắm" };
  } catch (error: any) {
    console.log("error clearing shopping list: ", error);
    return { success: false, msg: error.message };
  }
};
