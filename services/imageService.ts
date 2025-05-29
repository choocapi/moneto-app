import { ResponseType } from "@/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { CLOUD_VISION_API_KEY } from "@/config/api";

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

export const analyzeReceiptWithVisionApi = async (
  file: { uri?: string } | string
): Promise<ResponseType> => {
  try {
    let base64Image = "";
    if (typeof file === "string") {
      const response = await fetch(file);
      const blob = await response.blob();
      base64Image = await blobToBase64(blob);
    } else if (file && file.uri) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      base64Image = await blobToBase64(blob);
    } else {
      return { success: false, msg: "Không có ảnh hợp lệ" };
    }

    const body = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    };
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${CLOUD_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    if (data.responses && data.responses[0]?.fullTextAnnotation?.text) {
      return { success: true, data: data.responses[0].fullTextAnnotation.text };
    }
    return { success: false, msg: "Không nhận diện được nội dung hóa đơn" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(",")[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const scanReceiptAndParse = async (
  file: { uri?: string } | string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: false, msg: "Không có ảnh hợp lệ" };

    const visionRes = await analyzeReceiptWithVisionApi(file);
    console.log("visionRes", visionRes.data);
    if (!visionRes.success) {
      return {
        success: false,
        msg: visionRes.msg || "Không nhận diện được hóa đơn",
      };
    }
    const text = visionRes.data as string;

    let amount = 0;
    const totalMatch = text.match(/([\d\.]+)\s*Tổng đài góp ý\/khiếu nại/i);
    if (totalMatch) {
      amount = Number(totalMatch[1].replace(/\./g, ""));
    }

    let date = "";
    const ctMatch = text.match(/CT:\s*\w+-(\d{2}\/\d{2}\/\d{4})/);
    if (ctMatch) {
      date = new Date(ctMatch[1].split("/").reverse().join("-")).toISOString();
    }

    let imageUrl = getFilePath(file);

    const keywords = [
      "Bách hoá xanh",
      "Vinmart",
      "Co.opmart",
      "Big C",
      "Winmart",
      "Circle K",
      "FamilyMart",
      "GS25",
      "Lotte",
      "Mega Market",
      "Aeon",
      "Vinmart+",
    ];

    const textNoTone = removeVietnameseTones(text);
    let description = "Hoá đơn";
    for (const kw of keywords) {
      if (textNoTone.includes(removeVietnameseTones(kw))) {
        description = kw;
        break;
      }
    }

    return {
      success: true,
      data: {
        amount,
        date: date ? new Date(date) : new Date(),
        description: description,
        image: imageUrl,
      },
    };
  } catch (e: any) {
    return { success: false, msg: "Có lỗi khi scan hóa đơn" };
  }
};

function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
