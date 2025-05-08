import { ResponseType, WalletType } from "@/types";
import { uploadFileToStorage } from "./imageService";
import { firestore } from "@/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    // upload image
    if (walletData.image) {
      const imageUploadRes = await uploadFileToStorage(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: true,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData?.id) {
      // new wallet
      walletToSave.amount = walletData.amount || 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    // include wallet id if updating
    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); // update data
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating or updating wallet: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);

    return { success: true, msg: "Đã xóa ví thành công" };
  } catch (error: any) {
    console.log("error deleting wallet: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionsSnapshot = await getDocs(transactionsQuery);
      if (transactionsSnapshot.size == 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);

      transactionsSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();

      console.log(
        `${transactionsSnapshot.size} transactions detected in this batch`
      );
    }

    return { success: true, msg: "Tất cả giao dịch đã được xóa thành công" };
  } catch (error: any) {
    console.log("error deleting transactions by wallerId: ", error);
    return { success: false, msg: error.message };
  }
};
