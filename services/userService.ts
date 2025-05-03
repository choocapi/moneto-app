import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToStorage } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    // upload image
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUploadRes = await uploadFileToStorage(
        updatedData.image,
        "users"
      );
      if (!imageUploadRes.success) {
        return {
          success: true,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      updatedData.image = imageUploadRes.data;
    }
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);

    return { success: true, msg: "Cập nhật thành công" };
  } catch (error: any) {
    console.log("error updating user: ", error);
    return { success: false, msg: error?.message };
  }
};
