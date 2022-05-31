import { useState, useEffect, useCallback } from 'react';
import {
  useCollection,
  useCollectionData,
  useCollectionOnce,
} from 'react-firebase-hooks/firestore';
import { firestore, firebase } from 'configs/firebase/config';

const useFirestoreLoadMore = (queryFn, messageRef) => {
  const [query, setQuery] = useState(null);
  const [last, setLast] = useState(null);
  const [data, setData] = useState([]);

  const [qData, loading, error] = useCollectionOnce(query);
  // const [mdxx] = useCollectionOnce(
  //   firestore
  //     .collection('messages')
  //     .where(
  //       'conversation_id',
  //       '==',
  //       'b55ff38a-fb61-4a79-a26a-cb791777cb8b' || null
  //     )
  //     .orderBy('createdAt', 'desc')
  //     .limit(15)
  // );

  // useEffect(() => {
  //   setQuery(queryFn());
  // }, [mdxx]);
  useEffect(() => {
    setData([]);
    setQuery(queryFn());
  }, [queryFn]);

  useEffect(() => {
    if (qData && qData) {
      setLast(qData.docs[qData.docs.length - 1]);
      setData([...data, ...qData.docs]);
    }
  }, [qData]);
  // console.log({
  //   mdxx,
  //   data: data.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   })),
  // });

  const more = useCallback(() => {
    setQuery(queryFn().startAfter(last));
  }, [queryFn, setQuery, last]);

  return [[data, loading, error], more];
};

export default useFirestoreLoadMore;
