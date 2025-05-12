import { ResponseType } from "@/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";

export const uploadFileToStorage = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: true, data: null };
    if (typeof file == "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const fileName = file.uri.split("/").pop() || "file.jpg";
      const storageRef = ref(storage, `${folderName}/${fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, data: downloadURL };
    }

    return { success: true };
  } catch (error: any) {
    console.log("error uploading file: ", error);
    return { success: false, msg: error.message || "could not upload file" };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object") return file.uri;

  return require("@/assets/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object") return file.uri;

  return null;
};

export const encodeImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  return url.replace(/%/g, "___PERCENT___");
};

export const decodeImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  return url.replace(/___PERCENT___/g, "%");
};
