const { admin, firestore } = require('./config/firebaseConfig')
const auth = admin.auth();
const tes = async () => {
  // const collectionRef = firestore.collection('articles');
  // const collectionRef = firestore.collection('dataset');

  // collectionRef.get()
  //   .then(snapshot => {
  //     const batch = admin.firestore().batch();

  //     snapshot.forEach(doc => {
  //       batch.delete(doc.ref);
  //     });

  //     return batch.commit();
  //   })
  //   .then(() => {
  //     console.log('Seluruh dokumen dihapus dari koleksi.');
  //   })
  //   .catch(error => {
  //     console.error('Error menghapus dokumen:', error);
  //   });
  const targetUid = 'DbM1cC4pV2WimTrnEg2U2ucWoxZ3';
  auth.getUser(targetUid)
    .then((usersRecords) => {
      // usersRecords.users.forEach((userRecord) => {
      //   console.log('User data:', userRecord.toJSON());
      // });
      console.log('User data:', usersRecords.toJSON());
      // usersRecords.users.forEach((userRecord) => {
      //   console.log('User data:', userRecord.toJSON());
      // });
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found with UID:', targetUid);
      } else {
        console.error('Error fetching user data:', error);
      }
    });
}
tes();
