import { ResponseType } from "@/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";

// const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/images/upload`;

export const uploadFileToStorage = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: true, data: null };
    if (typeof file == "string") {
      return { success: true, data: file };
    }

    // if (file && file.uri) {
    //   const formData = new FormData();
    //   formData.append("file", {
    //     uri: file?.uri,
    //     type: "image/jpeg",
    //     name: file?.uri?.split("/").pop() || "file.jpg",
    //   } as any);

    //   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); //*
    //   formData.append("folder", folderName); //*

    //   const response = await axios.post(CLOUDINARY_API_URL, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });

    //   return { success: true, data: response?.data?.secure_url };
    // }

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
