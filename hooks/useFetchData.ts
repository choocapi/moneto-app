import { firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const useFetchData = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    const hasInvalidConstraints = constraints.some(
      (constraint) => constraint === undefined || constraint === null
    );

    if (hasInvalidConstraints) {
      setLoading(false);
      setData([]);
      return;
    }

    try {
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, ...constraints);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          }) as T[];
          setData(fetchedData);
          setLoading(false);
        },
        (error: any) => {
          console.log("error fetching data: ", error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (error: any) {
      console.log("Error setting up query:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
};

export default useFetchData;
